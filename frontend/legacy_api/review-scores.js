import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { submission_id, reviewer_id, level_id, is_draft } = req.query;
      let query = supabase.from('review_scores').select('*').order('created_at', { ascending: false });
      if (submission_id) query = query.eq('submission_id', parseInt(submission_id));
      if (reviewer_id) query = query.eq('reviewer_id', parseInt(reviewer_id));
      if (level_id) query = query.eq('level_id', parseInt(level_id));
      if (is_draft !== undefined) query = query.eq('is_draft', is_draft === 'true');
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase.from('review_scores').insert({
        review_id: body.review_id, submission_id: body.submission_id, reviewer_id: body.reviewer_id,
        level_id: body.level_id,
        question_scores: typeof body.question_scores === 'string' ? body.question_scores : JSON.stringify(body.question_scores || {}),
        overall_score: body.overall_score, grade: body.grade, comments: body.comments,
        recommendation: body.recommendation, is_draft: body.is_draft !== false,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (updates.question_scores && typeof updates.question_scores !== 'string') updates.question_scores = JSON.stringify(updates.question_scores);
      updates.updated_at = new Date().toISOString();
      const { data, error } = await supabase.from('review_scores').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Review scores error:', err);
    res.status(500).json({ error: err.message });
  }
}
