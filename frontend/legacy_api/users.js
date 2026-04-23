import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { role, search, limit = 100, school_code } = req.query;
      let query = supabase.from('users').select('*').order('created_at', { ascending: false }).limit(parseInt(limit));
      if (role) query = query.eq('role', role);
      if (school_code) query = query.ilike('email', `%${school_code}%`);
      if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,school_name.ilike.%${search}%,district.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      const safeData = (data || []).map(({ password_hash, ...rest }) => rest);
      return res.status(200).json(safeData);
    }
    if (req.method === 'POST') {
      const { action } = req.body;
      if (action === 'bulk-import') {
        const { users: userList } = req.body;
        if (!Array.isArray(userList) || userList.length === 0) return res.status(400).json({ error: 'No users to import' });
        const rows = userList.map(u => ({ name: u.name, email: u.email, phone: u.phone || null, role: u.role || 'functionary', school_name: u.school_name || null, district: u.district || null, password_hash: u.password_hash || null, status: 'active', created_at: new Date().toISOString() }));
        const { data, error } = await supabase.from('users').insert(rows).select();
        if (error) throw error;
        return res.status(201).json({ imported: data.length, users: data });
      }
      const { name, email, phone, role, school_name, district, password_hash, status } = req.body;
      const { data, error } = await supabase.from('users').insert({ name, email, phone, role, school_name, district, password_hash: password_hash || null, status: status || 'active', created_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (updates.password_hash === '') delete updates.password_hash;
      const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ error: err.message });
  }
}
