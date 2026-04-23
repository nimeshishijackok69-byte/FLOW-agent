import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { form_id } = req.query;
      let query = supabase.from('form_versions').select('*').order('version', { ascending: false });
      if (form_id) query = query.eq('form_id', parseInt(form_id));
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Form versions error:', err);
    res.status(500).json({ error: err.message });
  }
}
