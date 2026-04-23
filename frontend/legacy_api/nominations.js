import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { form_id, functionary_id, school_code, status } = req.query;
      let query = supabase.from('nominations').select('*').order('invited_at', { ascending: false });
      if (form_id) query = query.eq('form_id', parseInt(form_id));
      if (functionary_id) query = query.eq('functionary_id', parseInt(functionary_id));
      if (school_code) query = query.eq('school_code', school_code);
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { action } = req.body;
      if (action === 'bulk-nominate') {
        const { nominations: nomList } = req.body;
        if (!Array.isArray(nomList)) return res.status(400).json({ error: 'Invalid nominations list' });
        const rows = nomList.map(n => ({
          form_id: n.form_id, functionary_id: n.functionary_id, teacher_name: n.teacher_name,
          teacher_email: n.teacher_email, teacher_phone: n.teacher_phone || null,
          school_code: n.school_code, status: 'invited',
          unique_token: `tok_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
          link_type: n.link_type || 'otp', invited_at: new Date().toISOString(), reminder_count: 0
        }));
        // Auto-create teacher accounts
        for (const n of nomList) {
          const { data: existing } = await supabase.from('users').select('id').eq('email', n.teacher_email).single();
          if (!existing) {
            await supabase.from('users').insert({ name: n.teacher_name, email: n.teacher_email, phone: n.teacher_phone || null, role: 'teacher', school_name: n.school_name || null, district: n.district || null, status: 'active', created_at: new Date().toISOString() });
          }
        }
        const { data, error } = await supabase.from('nominations').insert(rows).select();
        if (error) throw error;
        return res.status(201).json({ created: data.length, nominations: data });
      }
      const body = req.body;
      const token = `tok_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
      // Auto-create teacher account if needed
      let teacherId = body.teacher_id;
      if (!teacherId && body.teacher_email) {
        const { data: existing } = await supabase.from('users').select('id').eq('email', body.teacher_email).single();
        if (existing) { teacherId = existing.id; }
        else {
          const { data: newUser } = await supabase.from('users').insert({ name: body.teacher_name, email: body.teacher_email, phone: body.teacher_phone || null, role: 'teacher', status: 'active', created_at: new Date().toISOString() }).select().single();
          teacherId = newUser?.id;
        }
      }
      const { data, error } = await supabase.from('nominations').insert({
        form_id: body.form_id, functionary_id: body.functionary_id, teacher_id: teacherId,
        teacher_name: body.teacher_name, teacher_email: body.teacher_email, teacher_phone: body.teacher_phone,
        school_code: body.school_code, status: 'invited', unique_token: token,
        link_type: body.link_type || 'otp', invited_at: new Date().toISOString(), reminder_count: 0
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from('nominations').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('nominations').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Nominations error:', err);
    res.status(500).json({ error: err.message });
  }
}
