import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { submission_id } = req.query;
      // Get full profile for a submission: all levels, all scores, all reviewers
      if (submission_id) {
        const sid = parseInt(submission_id);
        const [subRes, scoresRes, reviewsRes, commentsRes, levelsRes] = await Promise.all([
          supabase.from('submissions').select('*').eq('id', sid).single(),
          supabase.from('review_scores').select('*').eq('submission_id', sid).order('created_at', { ascending: true }),
          supabase.from('reviews').select('*').eq('submission_id', sid).order('created_at', { ascending: true }),
          supabase.from('comments').select('*').eq('submission_id', sid).order('created_at', { ascending: true }),
          supabase.from('review_levels').select('*').order('level_number', { ascending: true })
        ]);
        const sub = subRes.data;
        const scores = scoresRes.data || [];
        const reviews = reviewsRes.data || [];
        const comments = commentsRes.data || [];
        const allLevels = levelsRes.data || [];

        // Group scores by level
        const levelMap = {};
        for (const s of scores) {
          const lvl = s.level_id || 0;
          if (!levelMap[lvl]) levelMap[lvl] = [];
          levelMap[lvl].push(s);
        }

        // Calculate average per level
        const levelSummaries = [];
        const formLevels = allLevels.filter(l => l.form_id === sub?.form_id);
        for (const level of formLevels) {
          const levelScores = levelMap[level.id] || [];
          const completed = levelScores.filter(s => !s.is_draft);
          const avg = completed.length > 0 ? Math.round(completed.reduce((a, s) => a + (parseFloat(s.overall_score) || 0), 0) / completed.length) : null;
          const grades = completed.map(s => s.grade).filter(Boolean);
          levelSummaries.push({
            level_id: level.id,
            level_number: level.level_number,
            level_name: level.name,
            scoring_type: level.scoring_type,
            blind_review: level.blind_review,
            total_reviewers: completed.length,
            average_score: avg,
            grades,
            scores: completed.map(s => ({
              reviewer_id: s.reviewer_id,
              overall_score: parseFloat(s.overall_score),
              grade: s.grade,
              comments: s.comments,
              recommendation: s.recommendation,
              question_scores: s.question_scores,
              created_at: s.created_at
            }))
          });
        }

        // Highest level reached
        const highestLevel = levelSummaries.filter(l => l.total_reviewers > 0).length;

        return res.status(200).json({
          submission: sub,
          levels: levelSummaries,
          reviews,
          comments,
          highest_level: highestLevel,
          total_levels: formLevels.length
        });
      }

      // List mode: get all submissions for a form with their level progress
      const { form_id } = req.query;
      if (!form_id) return res.status(400).json({ error: 'form_id required' });

      const [subsRes, scoresRes, levelsRes] = await Promise.all([
        supabase.from('submissions').select('*').eq('form_id', parseInt(form_id)).eq('is_draft', false).order('submitted_at', { ascending: false }),
        supabase.from('review_scores').select('*').eq('is_draft', false),
        supabase.from('review_levels').select('*').eq('form_id', parseInt(form_id)).order('level_number', { ascending: true })
      ]);
      const subs = subsRes.data || [];
      const allScores = scoresRes.data || [];
      const levels = levelsRes.data || [];

      // For each submission, compute level-wise averages
      const enriched = subs.map(sub => {
        const subScores = allScores.filter(s => s.submission_id === sub.id);
        const levelAvgs = {};
        let highestLevel = 0;
        for (const level of levels) {
          const ls = subScores.filter(s => s.level_id === level.id);
          if (ls.length > 0) {
            levelAvgs[`level_${level.level_number}`] = Math.round(ls.reduce((a, s) => a + (parseFloat(s.overall_score) || 0), 0) / ls.length);
            highestLevel = Math.max(highestLevel, level.level_number);
          }
        }
        return {
          ...sub,
          level_averages: levelAvgs,
          highest_level: highestLevel,
          total_reviews: subScores.length
        };
      });

      return res.status(200).json({ submissions: enriched, levels });
    }

    if (req.method === 'POST') {
      const { action } = req.body;

      // Create shortlist: filter submissions and assign to a new level
      if (action === 'create-shortlist') {
        const { form_id, level_id, filter_type, filter_value, reviewer_ids } = req.body;
        // Get all submissions for this form
        const { data: subs } = await supabase.from('submissions').select('*').eq('form_id', form_id).eq('is_draft', false);
        const { data: allScores } = await supabase.from('review_scores').select('*').eq('is_draft', false);

        let filtered = subs || [];

        if (filter_type === 'form_score_gte') {
          // Filter by form's auto-calculated score
          filtered = filtered.filter(s => (s.score || 0) >= parseInt(filter_value));
        } else if (filter_type === 'review_avg_gte') {
          // Filter by reviewer average score at a specific level
          const { source_level_id } = req.body;
          filtered = filtered.filter(s => {
            const ls = (allScores || []).filter(sc => sc.submission_id === s.id && sc.level_id === source_level_id);
            if (ls.length === 0) return false;
            const avg = ls.reduce((a, sc) => a + (parseFloat(sc.overall_score) || 0), 0) / ls.length;
            return avg >= parseInt(filter_value);
          });
        } else if (filter_type === 'field_value') {
          // Filter by a specific field value in responses
          const { field_id, field_value } = req.body;
          filtered = filtered.filter(s => {
            try {
              const resp = typeof s.responses === 'string' ? JSON.parse(s.responses) : (s.responses || {});
              const val = resp[field_id];
              if (Array.isArray(val)) return val.includes(field_value);
              return String(val || '').toLowerCase() === String(field_value || '').toLowerCase();
            } catch { return false; }
          });
        } else if (filter_type === 'all') {
          // All submissions
        }

        // Create review entries for each filtered submission assigned to each reviewer
        const reviewRows = [];
        const rids = Array.isArray(reviewer_ids) ? reviewer_ids : [];
        const { data: users } = await supabase.from('users').select('id, name').in('id', rids);
        const userMap = {};
        (users || []).forEach(u => { userMap[u.id] = u.name; });

        const { data: levelData } = await supabase.from('review_levels').select('*').eq('id', level_id).single();

        for (const sub of filtered) {
          for (const rid of rids) {
            reviewRows.push({
              submission_id: sub.id,
              reviewer_id: rid,
              reviewer_name: userMap[rid] || `Reviewer ${rid}`,
              status: 'pending',
              level: levelData?.level_number || 1,
              comments: '',
              created_at: new Date().toISOString()
            });
          }
          // Update submission status
          await supabase.from('submissions').update({ status: 'under_review' }).eq('id', sub.id);
        }

        if (reviewRows.length > 0) {
          const { error } = await supabase.from('reviews').insert(reviewRows);
          if (error) throw error;
        }

        return res.status(200).json({
          shortlisted: filtered.length,
          reviews_created: reviewRows.length,
          reviewers: rids.length
        });
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Shortlist error:', err);
    res.status(500).json({ error: err.message });
  }
}
