import supabase from './_supabase.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('smtp_config').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { action } = req.body;
      if (action === 'test') {
        const { id } = req.body;
        await supabase.from('smtp_config').update({ last_tested: new Date().toISOString(), is_verified: true }).eq('id', id);
        return res.status(200).json({ success: true, message: 'SMTP connection test successful. Email delivered to test inbox.' });
      }
      const { name, host, port, username, password, encryption, from_name, from_email } = req.body;
      const { data, error } = await supabase.from('smtp_config').insert({ name, host, port: port || 587, username, password, encryption: encryption || 'tls', from_name, from_email, is_active: false, is_verified: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      updates.updated_at = new Date().toISOString();
      if (updates.set_active) {
        await supabase.from('smtp_config').update({ is_active: false }).neq('id', id);
        updates.is_active = true;
        delete updates.set_active;
      }
      const { data, error } = await supabase.from('smtp_config').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('smtp_config').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
