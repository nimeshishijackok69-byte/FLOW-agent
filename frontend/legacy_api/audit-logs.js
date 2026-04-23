import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { user_id, action, limit = 100 } = req.query;
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(parseInt(limit));
      if (user_id) query = query.eq('user_id', parseInt(user_id));
      if (action) query = query.eq('action', action);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { user_id, action, details } = req.body;
      const { data, error } = await supabase.from('audit_logs').insert({ user_id, action, details, created_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Audit logs error:', err);
    res.status(500).json({ error: err.message });
  }
}
