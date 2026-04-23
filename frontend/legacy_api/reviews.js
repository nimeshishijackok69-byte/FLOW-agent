import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { submission_id, reviewer_id, status } = req.query;
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (submission_id) query = query.eq('submission_id', parseInt(submission_id));
      if (reviewer_id) query = query.eq('reviewer_id', parseInt(reviewer_id));
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase.from('reviews').insert({
        submission_id: body.submission_id,
        reviewer_id: body.reviewer_id,
        reviewer_name: body.reviewer_name,
        status: body.status || 'pending',
        level: body.level || 1,
        comments: body.comments || '',
        created_at: new Date().toISOString()
      }).select().single();
      if (error) throw error;
      if (body.status === 'approved' || body.status === 'rejected') {
        await supabase.from('submissions').update({ status: body.status === 'approved' ? 'approved' : 'rejected' }).eq('id', body.submission_id);
      }
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from('reviews').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Reviews error:', err);
    res.status(500).json({ error: err.message });
  }
}
