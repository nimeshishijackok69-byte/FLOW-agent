import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { submission_id } = req.query;
      let query = supabase.from('comments').select('*').order('created_at', { ascending: true });
      if (submission_id) query = query.eq('submission_id', parseInt(submission_id));
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { submission_id, user_id, user_name, user_role, content } = req.body;
      const { data, error } = await supabase.from('comments').insert({ submission_id, user_id, user_name, user_role, content, created_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Comments error:', err);
    res.status(500).json({ error: err.message });
  }
}
