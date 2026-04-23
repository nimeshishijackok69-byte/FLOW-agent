import supabase from './_supabase.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { id, category } = req.query;
      if (id) { const { data, error } = await supabase.from('email_tpl').select('*').eq('id', parseInt(id)).single(); if (error) throw error; return res.status(200).json(data); }
      let q = supabase.from('email_tpl').select('*').order('created_at', { ascending: false });
      if (category) q = q.eq('category', category);
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name, slug, subject, body, category, variables } = req.body;
      const { data, error } = await supabase.from('email_tpl').insert({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), subject, body, category: category || 'general', variables: typeof variables === 'string' ? variables : JSON.stringify(variables || []), is_builtin: false, is_active: true, used_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      updates.updated_at = new Date().toISOString();
      if (updates.variables && typeof updates.variables !== 'string') updates.variables = JSON.stringify(updates.variables);
      const { data, error } = await supabase.from('email_tpl').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('email_tpl').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
