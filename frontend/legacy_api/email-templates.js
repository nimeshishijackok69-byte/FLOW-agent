import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { type, form_id } = req.query;
      let query = supabase.from('email_templates').select('*').order('created_at', { ascending: false });
      if (type) query = query.eq('type', type);
      if (form_id) query = query.eq('form_id', parseInt(form_id));
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name, subject, body: bodyText, type, form_id } = req.body;
      const { data, error } = await supabase.from('email_templates').insert({ name, subject, body: bodyText, type: type || 'invite', form_id, created_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from('email_templates').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('email_templates').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Email templates error:', err);
    res.status(500).json({ error: err.message });
  }
}
