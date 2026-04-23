import supabase from './_supabase.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('email_reminders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const b = req.body;
      const { data, error } = await supabase.from('email_reminders').insert({ name: b.name, description: b.description, template_id: b.template_id, template_name: b.template_name, schedule_type: b.schedule_type || 'one_time', schedule_config: typeof b.schedule_config === 'string' ? b.schedule_config : JSON.stringify(b.schedule_config || {}), recipient_filter: typeof b.recipient_filter === 'string' ? b.recipient_filter : JSON.stringify(b.recipient_filter || {}), recipient_count: b.recipient_count || 0, is_active: b.is_active !== false, next_run: b.next_run, total_sent: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      updates.updated_at = new Date().toISOString();
      if (updates.schedule_config && typeof updates.schedule_config !== 'string') updates.schedule_config = JSON.stringify(updates.schedule_config);
      if (updates.recipient_filter && typeof updates.recipient_filter !== 'string') updates.recipient_filter = JSON.stringify(updates.recipient_filter);
      const { data, error } = await supabase.from('email_reminders').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('email_reminders').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
