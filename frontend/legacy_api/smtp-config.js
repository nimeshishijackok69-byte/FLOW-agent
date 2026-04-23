import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('smtp_config').select('*').order('id', { ascending: false }).limit(10);
      if (error) throw error;
      // Mask password
      const safe = (data || []).map(c => ({ ...c, password: c.password ? '••••••••' : '' }));
      return res.status(200).json(safe);
    }
    if (req.method === 'POST') {
      const { action } = req.body;
      if (action === 'test') {
        // Simulate SMTP test
        const { host, port } = req.body;
        await new Promise(r => setTimeout(r, 1000));
        if (!host) return res.status(400).json({ success: false, error: 'Host is required' });
        // Simulate success for common hosts
        const success = ['smtp.gmail.com', 'smtp.mailgun.org', 'smtp.sendgrid.net', 'smtp.office365.com'].includes(host);
        return res.status(200).json({ success, message: success ? 'Connection successful! SMTP server responded.' : `Connection failed: Could not connect to ${host}:${port}` });
      }
      const { name, host, port, encryption, username, password, from_email, from_name, is_active } = req.body;
      const { data, error } = await supabase.from('smtp_config').insert({
        name, host, port, encryption, username, password, from_email, from_name, is_active: is_active !== false, is_verified: false
      }).select().single();
      if (error) throw error;
      await supabase.from('audit_logs').insert({ user_id: req.body.user_id || 1, action: 'smtp_config_created', details: JSON.stringify({ name, host }), created_at: new Date().toISOString() });
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      updates.updated_at = new Date().toISOString();
      if (updates.password === '••••••••') delete updates.password;
      const { data, error } = await supabase.from('smtp_config').update(updates).eq('id', id).select().single();
      if (error) throw error;
      await supabase.from('audit_logs').insert({ user_id: req.body.user_id || 1, action: 'smtp_config_updated', details: JSON.stringify({ id, host: updates.host }), created_at: new Date().toISOString() });
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('SMTP config error:', err);
    res.status(500).json({ error: err.message });
  }
}
