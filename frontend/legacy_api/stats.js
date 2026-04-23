import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { form_id, school_code } = req.query;
    const [usersRes, formsRes, subsRes, reviewsRes, nomsRes, scoresRes] = await Promise.all([
      supabase.from('users').select('id, role, status, created_at, email, school_name, district'),
      supabase.from('forms').select('id, status, form_type, created_at, title'),
      supabase.from('submissions').select('id, status, form_id, submitted_at, score, user_name, user_email, form_title, is_draft'),
      supabase.from('reviews').select('id, status, created_at, reviewer_id, submission_id'),
      supabase.from('nominations').select('id, form_id, functionary_id, school_code, status, teacher_name'),
      supabase.from('review_scores').select('id, overall_score, grade, reviewer_id, level_id, is_draft')
    ]);
    const users = usersRes.data || [];
    const forms = formsRes.data || [];
    const subs = subsRes.data || [];
    const reviews = reviewsRes.data || [];
    const noms = nomsRes.data || [];
    const scores = scoresRes.data || [];

    let filteredSubs = subs;
    let filteredNoms = noms;
    if (form_id) {
      const fid = parseInt(form_id);
      filteredSubs = subs.filter(s => s.form_id === fid);
      filteredNoms = noms.filter(n => n.form_id === fid);
    }

    const stats = {
      totalUsers: users.length,
      usersByRole: { admin: users.filter(u => u.role === 'admin').length, reviewer: users.filter(u => u.role === 'reviewer').length, functionary: users.filter(u => u.role === 'functionary').length, teacher: users.filter(u => u.role === 'teacher').length },
      totalForms: forms.length,
      activeForms: forms.filter(f => f.status === 'active').length,
      draftForms: forms.filter(f => f.status === 'draft').length,
      expiredForms: forms.filter(f => f.status === 'expired').length,
      formsByType: {},
      totalSubmissions: filteredSubs.length,
      submissionsByStatus: {
        submitted: filteredSubs.filter(s => s.status === 'submitted').length,
        approved: filteredSubs.filter(s => s.status === 'approved').length,
        rejected: filteredSubs.filter(s => s.status === 'rejected').length,
        under_review: filteredSubs.filter(s => s.status === 'under_review').length,
        draft: filteredSubs.filter(s => s.is_draft).length
      },
      totalReviews: reviews.length,
      pendingReviews: reviews.filter(r => r.status === 'pending').length,
      completedReviews: reviews.filter(r => r.status === 'approved' || r.status === 'rejected').length,
      avgScore: filteredSubs.filter(s => s.score != null).length > 0 ? Math.round(filteredSubs.filter(s => s.score != null).reduce((a, s) => a + (s.score || 0), 0) / filteredSubs.filter(s => s.score != null).length) : 0,
      totalNominations: filteredNoms.length,
      nominationsByStatus: {
        invited: filteredNoms.filter(n => n.status === 'invited').length,
        in_progress: filteredNoms.filter(n => n.status === 'in_progress').length,
        completed: filteredNoms.filter(n => n.status === 'completed').length
      },
      schoolCodes: [...new Set(noms.map(n => n.school_code).filter(Boolean))],
      completionRate: filteredSubs.length > 0 ? Math.round((filteredSubs.filter(s => !s.is_draft).length / filteredSubs.length) * 100) : 0,
      submissionTimeline: filteredSubs.reduce((acc, s) => {
        if (s.submitted_at) {
          const d = s.submitted_at.split('T')[0];
          acc[d] = (acc[d] || 0) + 1;
        }
        return acc;
      }, {}),
      scoreDistribution: { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 },
      reviewScores: scores,
      forms: forms
    };
    forms.forEach(f => { stats.formsByType[f.form_type] = (stats.formsByType[f.form_type] || 0) + 1; });
    filteredSubs.filter(s => s.score != null).forEach(s => {
      const sc = s.score || 0;
      if (sc <= 20) stats.scoreDistribution['0-20']++;
      else if (sc <= 40) stats.scoreDistribution['21-40']++;
      else if (sc <= 60) stats.scoreDistribution['41-60']++;
      else if (sc <= 80) stats.scoreDistribution['61-80']++;
      else stats.scoreDistribution['81-100']++;
    });

    return res.status(200).json(stats);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: err.message });
  }
}
