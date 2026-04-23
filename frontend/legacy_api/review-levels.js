import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { form_id } = req.query;
      let query = supabase.from('review_levels').select('*').order('level_number', { ascending: true });
      if (form_id) query = query.eq('form_id', parseInt(form_id));
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase.from('review_levels').insert({
        form_id: body.form_id, level_number: body.level_number || 1, name: body.name,
        filter_criteria: typeof body.filter_criteria === 'string' ? body.filter_criteria : JSON.stringify(body.filter_criteria || {}),
        scoring_type: body.scoring_type || 'form_level',
        grade_scale: typeof body.grade_scale === 'string' ? body.grade_scale : JSON.stringify(body.grade_scale || []),
        blind_review: body.blind_review || false, consensus_required: body.consensus_required || false,
        reviewer_ids: typeof body.reviewer_ids === 'string' ? body.reviewer_ids : JSON.stringify(body.reviewer_ids || []),
        created_at: new Date().toISOString()
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (updates.filter_criteria && typeof updates.filter_criteria !== 'string') updates.filter_criteria = JSON.stringify(updates.filter_criteria);
      if (updates.grade_scale && typeof updates.grade_scale !== 'string') updates.grade_scale = JSON.stringify(updates.grade_scale);
      if (updates.reviewer_ids && typeof updates.reviewer_ids !== 'string') updates.reviewer_ids = JSON.stringify(updates.reviewer_ids);
      const { data, error } = await supabase.from('review_levels').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('review_levels').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Review levels error:', err);
    res.status(500).json({ error: err.message });
  }
}
