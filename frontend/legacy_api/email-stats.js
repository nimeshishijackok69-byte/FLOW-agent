import supabase from './_supabase.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const [logsR, tplR, remR, smtpR] = await Promise.all([
      supabase.from('email_log').select('id,status,sent_at,opened_at,clicked_at,template_name'),
      supabase.from('email_tpl').select('id,name,used_count,is_active'),
      supabase.from('email_reminders').select('id,is_active,total_sent'),
      supabase.from('smtp_config').select('id,is_active,is_verified')
    ]);
    const logs = logsR.data || [];
    const total = logs.length;
    const delivered = logs.filter(l => l.status === 'delivered').length;
    const opened = logs.filter(l => l.opened_at).length;
    const clicked = logs.filter(l => l.clicked_at).length;
    const bounced = logs.filter(l => l.status === 'bounced').length;
    const failed = logs.filter(l => l.status === 'failed').length;
    const spam = logs.filter(l => l.status === 'spam').length;
    return res.status(200).json({
      total_sent: total, delivered, opened, clicked, bounced, failed, spam,
      delivery_rate: total > 0 ? Math.round((delivered / total) * 100) : 0,
      open_rate: delivered > 0 ? Math.round((opened / delivered) * 100) : 0,
      click_rate: opened > 0 ? Math.round((clicked / opened) * 100) : 0,
      bounce_rate: total > 0 ? Math.round((bounced / total) * 100) : 0,
      templates_count: (tplR.data || []).length,
      active_templates: (tplR.data || []).filter(t => t.is_active).length,
      active_reminders: (remR.data || []).filter(r => r.is_active).length,
      total_reminder_sent: (remR.data || []).reduce((a, r) => a + (r.total_sent || 0), 0),
      smtp_active: (smtpR.data || []).find(s => s.is_active),
      by_template: logs.reduce((acc, l) => { const n = l.template_name || 'Unknown'; acc[n] = (acc[n] || 0) + 1; return acc; }, {}),
      by_day: logs.reduce((acc, l) => { if (l.sent_at) { const d = l.sent_at.split('T')[0]; acc[d] = (acc[d] || 0) + 1; } return acc; }, {})
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
