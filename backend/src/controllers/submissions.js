import { Submission } from '../models/Submission.js';
import { Form } from '../models/Form.js';
export const submitForm = async (req, res) => {
    try {
        let { form_id, formId, responses } = req.body;
        const actualFormId = form_id || formId;
        // Convert object responses to array if needed
        if (responses && !Array.isArray(responses)) {
            responses = Object.entries(responses).map(([fieldId, value]) => ({ fieldId, value }));
        }
        if (!responses)
            responses = [];
        const form = await Form.findById(actualFormId);
        if (!form)
            return res.status(404).json({ error: 'Form not found' });
        // Expiration check
        if (form.expiresAt && new Date() > form.expiresAt) {
            return res.status(403).json({ error: 'This form has expired' });
        }
        // Scoring for Quizzes
        let score = null;
        const quizFields = form.fields.filter(f => f.type === 'mcq' && f.correct);
        if (quizFields.length > 0) {
            let earnedPoints = 0;
            let totalPoints = 0;
            responses.forEach((resp) => {
                const field = form.fields.find(f => f.id === resp.fieldId);
                if (field && field.type === 'mcq') {
                    totalPoints += field.points || 0;
                    if (resp.value === field.correct) {
                        earnedPoints += field.points || 0;
                    }
                }
            });
            const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
            score = {
                earnedPoints,
                totalPoints,
                percentage,
                passed: percentage >= (form.settings?.passing_score || 0)
            };
        }
        const submission = await Submission.create({
            formId: actualFormId,
            userId: req.user?._id || null,
            userName: req.body.user_name || req.user?.profile?.fullName,
            userEmail: req.body.user_email || req.user?.email,
            formTitle: req.body.form_title || form.title,
            responses,
            score,
            status: req.body.status || 'pending',
            isDraft: req.body.is_draft || false,
            metadata: {
                ip: req.ip,
                userAgent: req.headers['user-agent']
            }
        });
        res.status(201).json({ ...submission.toObject(), id: submission._id, is_draft: submission.isDraft });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateSubmission = async (req, res) => {
    try {
        let { id, is_draft, responses } = req.body;
        if (responses && !Array.isArray(responses)) {
            responses = Object.entries(responses).map(([fieldId, value]) => ({ fieldId, value }));
        }
        const submission = await Submission.findByIdAndUpdate(id, {
            ...req.body,
            responses: responses || req.body.responses,
            isDraft: is_draft !== undefined ? is_draft : req.body.isDraft
        }, { new: true });
        if (!submission)
            return res.status(404).json({ error: 'Submission not found' });
        res.status(200).json({ ...submission.toObject(), id: submission._id, is_draft: submission.isDraft });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getSubmissions = async (req, res) => {
    try {
        const { formId, form_id, user_id } = req.query;
        const actualFormId = formId || form_id;
        const query = {};
        if (actualFormId)
            query.formId = actualFormId;
        if (user_id)
            query.userId = user_id;
        if (req.user.role === 'teacher') {
            query.userId = req.user._id;
        }
        const submissions = await Submission.find(query)
            .sort({ createdAt: -1 });
        const mapped = submissions.map(s => ({
            ...s.toObject(),
            id: s._id,
            form_id: s.formId,
            user_id: s.userId,
            user_name: s.userName,
            user_email: s.userEmail,
            form_title: s.formTitle,
            submitted_at: s.createdAt,
            is_draft: s.isDraft
        }));
        res.status(200).json(mapped);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await Submission.findById(id).populate('formId');
        if (!submission)
            return res.status(404).json({ error: 'Submission not found' });
        // Privacy: Teachers only see own
        if (req.user.role === 'teacher' && submission.userId?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.status(200).json({ success: true, data: submission });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//# sourceMappingURL=submissions.js.map