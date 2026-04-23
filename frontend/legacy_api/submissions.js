import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { form_id, user_id, status, search, id, school_code } = req.query;
      if (id) {
        const { data, error } = await supabase.from('submissions').select('*').eq('id', parseInt(id)).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      let query = supabase.from('submissions').select('*').order('submitted_at', { ascending: false });
      if (form_id) query = query.eq('form_id', parseInt(form_id));
      if (user_id) query = query.eq('user_id', parseInt(user_id));
      if (status) query = query.eq('status', status);
      if (school_code) query = query.ilike('responses', `%${school_code}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase.from('submissions').insert({
        form_id: body.form_id, user_id: body.user_id, user_name: body.user_name, user_email: body.user_email,
        form_title: body.form_title, responses: typeof body.responses === 'string' ? body.responses : JSON.stringify(body.responses || {}),
        status: body.status || 'submitted', score: body.score, is_draft: body.is_draft || false,
        submitted_at: new Date().toISOString()
      }).select().single();
      if (error) throw error;
      // Update nomination status if applicable
      if (body.nomination_id) {
        await supabase.from('nominations').update({ status: body.is_draft ? 'in_progress' : 'completed', completed_at: body.is_draft ? null : new Date().toISOString() }).eq('id', body.nomination_id);
      }
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (updates.responses && typeof updates.responses !== 'string') updates.responses = JSON.stringify(updates.responses);
      const { data, error } = await supabase.from('submissions').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('submissions').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Submissions error:', err);
    res.status(500).json({ error: err.message });
  }
}
