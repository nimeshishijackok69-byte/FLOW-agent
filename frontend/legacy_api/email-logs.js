import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { type, status, search, limit = 100 } = req.query;
      let query = supabase.from('email_logs').select('*').order('sent_at', { ascending: false }).limit(parseInt(limit));
      if (type) query = query.eq('type', type);
      if (status) query = query.eq('status', status);
      if (search) query = query.or(`recipient_name.ilike.%${search}%,recipient_email.ilike.%${search}%,subject.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { action } = req.body;
      if (action === 'send') {
        // Simulate sending emails
        const { template_id, template_name, recipients, subject, body, type, form_id, school_code, variables } = req.body;
        const logs = [];
        for (const r of (recipients || [])) {
          let finalSubject = subject || '';
          let finalBody = body || '';
          // Variable substitution
          const vars = { ...variables, teacher_name: r.name, user_name: r.name, email: r.email, school_code: school_code || '' };
          for (const [k, v] of Object.entries(vars)) {
            finalSubject = finalSubject.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
            finalBody = finalBody.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
          }
          logs.push({
            template_id, template_name: template_name || 'Custom',
            recipient_name: r.name || '', recipient_email: r.email,
            subject: finalSubject, body: finalBody,
            type: type || 'custom', status: 'sent',
            form_id, school_code: r.school_code || school_code,
            metadata: JSON.stringify({ variables: vars }),
            sent_at: new Date().toISOString()
          });
        }
        if (logs.length > 0) {
          const { data, error } = await supabase.from('email_logs').insert(logs).select();
          if (error) throw error;
          await supabase.from('audit_logs').insert({ user_id: req.body.user_id || 1, action: 'emails_sent', details: JSON.stringify({ count: logs.length, template: template_name, type }), created_at: new Date().toISOString() });
          return res.status(201).json({ sent: data.length, logs: data });
        }
        return res.status(400).json({ error: 'No recipients' });
      }
      if (action === 'resend') {
        const { log_id } = req.body;
        const { data: original } = await supabase.from('email_logs').select('*').eq('id', log_id).single();
        if (!original) return res.status(404).json({ error: 'Log not found' });
        const { data, error } = await supabase.from('email_logs').insert({
          ...original, id: undefined, status: 'sent', error_message: null, sent_at: new Date().toISOString(),
          metadata: JSON.stringify({ resent_from: log_id })
        }).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }
      return res.status(400).json({ error: 'Invalid action' });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Email logs error:', err);
    res.status(500).json({ error: err.message });
  }
}
