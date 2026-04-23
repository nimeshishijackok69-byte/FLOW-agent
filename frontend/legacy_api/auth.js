import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { action, email, password, otp, phone } = req.body;

      if (action === 'login-password') {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('password_hash', password)
          .single();
        if (error || !data) return res.status(401).json({ error: 'Invalid credentials' });
        if (data.role !== 'admin' && data.role !== 'reviewer') {
          return res.status(403).json({ error: 'Access denied. Only Admin/Reviewer can use password login.' });
        }
        const token = Buffer.from(JSON.stringify({ id: data.id, role: data.role, ts: Date.now(), exp: Date.now() + 24*60*60*1000 })).toString('base64');
        await supabase.from('audit_logs').insert({ user_id: data.id, action: 'login', details: JSON.stringify({ method: 'password', ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'localhost', user_agent: req.headers['user-agent']?.substring(0, 200) || '' }), created_at: new Date().toISOString() });
        const { password_hash, ...safeUser } = data;
        return res.status(200).json({ user: safeUser, token });
      }

      if (action === 'request-otp') {
        // Validate functionary email format: head.{code}@cbss.school.org
        const emailVal = email || '';
        const phoneVal = phone || '';
        let user = null;
        if (emailVal) {
          const { data } = await supabase.from('users').select('*').eq('email', emailVal).single();
          user = data;
        } else if (phoneVal) {
          const { data } = await supabase.from('users').select('*').eq('phone', phoneVal).single();
          user = data;
        }
        if (!user) return res.status(404).json({ error: 'User not found. Please contact admin.' });
        
        // Extract school code from functionary email
        let schoolCode = null;
        const funcMatch = emailVal.match(/^head\.([a-z0-9]+)@cbss\.school\.org$/i);
        if (funcMatch) schoolCode = funcMatch[1].toUpperCase();
        
        await supabase.from('audit_logs').insert({ user_id: user.id, action: 'otp_requested', details: JSON.stringify({ method: emailVal ? 'email' : 'phone', school_code: schoolCode, ip: req.headers['x-forwarded-for'] || 'localhost' }), created_at: new Date().toISOString() });
        return res.status(200).json({ message: 'OTP sent successfully. Use 123456 for localhost testing.', school_code: schoolCode, user_role: user.role });
      }

      if (action === 'verify-otp') {
        if (otp !== '123456') return res.status(401).json({ error: 'Invalid OTP. Please try again.' });
        const emailVal = email || '';
        const phoneVal = phone || '';
        let user = null;
        if (emailVal) {
          const { data } = await supabase.from('users').select('*').eq('email', emailVal).single();
          user = data;
        } else if (phoneVal) {
          const { data } = await supabase.from('users').select('*').eq('phone', phoneVal).single();
          user = data;
        }
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        let schoolCode = null;
        const funcMatch = (emailVal || '').match(/^head\.([a-z0-9]+)@cbss\.school\.org$/i);
        if (funcMatch) schoolCode = funcMatch[1].toUpperCase();
        
        const sessionDuration = user.role === 'functionary' ? 30*60*1000 : 24*60*60*1000;
        const token = Buffer.from(JSON.stringify({ id: user.id, role: user.role, school_code: schoolCode, ts: Date.now(), exp: Date.now() + sessionDuration })).toString('base64');
        await supabase.from('audit_logs').insert({ user_id: user.id, action: 'login', details: JSON.stringify({ method: 'otp', school_code: schoolCode, ip: req.headers['x-forwarded-for'] || 'localhost' }), created_at: new Date().toISOString() });
        const { password_hash, ...safeUser } = user;
        return res.status(200).json({ user: { ...safeUser, school_code: schoolCode }, token });
      }

      if (action === 'verify-token') {
        const { token } = req.body;
        try {
          const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
          if (decoded.exp && Date.now() > decoded.exp) return res.status(401).json({ error: 'Session expired. Please log in again.' });
          const { data } = await supabase.from('users').select('*').eq('id', decoded.id).single();
          if (!data) return res.status(401).json({ error: 'User not found' });
          const { password_hash, ...safeUser } = data;
          return res.status(200).json({ user: { ...safeUser, school_code: decoded.school_code }, session_expires: decoded.exp });
        } catch { return res.status(401).json({ error: 'Invalid token' }); }
      }

      if (action === 'verify-teacher-link') {
        const { token: linkToken, school_code: sc } = req.body;
        const { data: nom } = await supabase.from('nominations').select('*').eq('unique_token', linkToken).single();
        if (!nom) return res.status(404).json({ error: 'Invalid or expired link' });
        if (sc && nom.school_code !== sc) return res.status(403).json({ error: 'School code mismatch' });
        
        if (nom.link_type === 'direct') {
          let user = null;
          if (nom.teacher_id) {
            const { data } = await supabase.from('users').select('*').eq('id', nom.teacher_id).single();
            user = data;
          }
          const sessionToken = Buffer.from(JSON.stringify({ id: user?.id || 0, role: 'teacher', school_code: nom.school_code, nomination_id: nom.id, ts: Date.now(), exp: Date.now() + 2*60*60*1000 })).toString('base64');
          return res.status(200).json({ user: user || { id: 0, name: nom.teacher_name, email: nom.teacher_email, role: 'teacher' }, token: sessionToken, requires_otp: false });
        }
        return res.status(200).json({ nomination: { id: nom.id, teacher_name: nom.teacher_name, teacher_email: nom.teacher_email, school_code: nom.school_code }, requires_otp: true });
      }

      return res.status(400).json({ error: 'Invalid action' });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: err.message });
  }
}
