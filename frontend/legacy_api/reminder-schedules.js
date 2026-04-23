import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('reminder_schedules').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { form_id, form_title, template_id, template_name, days_before, is_active } = req.body;
      const { data, error } = await supabase.from('reminder_schedules').insert({
        form_id, form_title, template_id, template_name,
        days_before: typeof days_before === 'string' ? days_before : JSON.stringify(days_before),
        is_active: is_active !== false, total_sent: 0, created_at: new Date().toISOString()
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (updates.days_before && typeof updates.days_before !== 'string') updates.days_before = JSON.stringify(updates.days_before);
      const { data, error } = await supabase.from('reminder_schedules').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('reminder_schedules').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Reminder schedules error:', err);
    res.status(500).json({ error: err.message });
  }
}
