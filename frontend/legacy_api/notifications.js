import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { user_id, is_read } = req.query;
      let query = supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50);
      if (user_id) query = query.eq('user_id', parseInt(user_id));
      if (is_read !== undefined) query = query.eq('is_read', is_read === 'true');
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { user_id, title, message, type } = req.body;
      const { data, error } = await supabase.from('notifications').insert({ user_id, title, message, type: type || 'info', is_read: false, created_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, is_read } = req.body;
      if (id === 'all') {
        const { user_id } = req.body;
        const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', user_id).select();
        if (error) throw error;
        return res.status(200).json(data);
      }
      const { data, error } = await supabase.from('notifications').update({ is_read }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Notifications error:', err);
    res.status(500).json({ error: err.message });
  }
}
