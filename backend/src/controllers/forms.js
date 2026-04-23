import { Form } from '../models/Form.js';
export const getForms = async (req, res) => {
    try {
        const { status, id } = req.query;
        const query = {};
        if (id) {
            const form = await Form.findById(id);
            return res.status(200).json(form ? { ...form.toObject(), id: form._id } : { error: 'Not found' });
        }
        if (status)
            query.status = status;
        // Admins see all, reviewers see active
        if (req.user.role === 'reviewer')
            query.status = 'active';
        const forms = await Form.find(query).sort({ createdAt: -1 });
        const mapped = forms.map(f => ({
            ...f.toObject(),
            id: f._id,
            form_type: f.formType,
            shareable_link: f.shareableLink,
            expires_at: f.expiresAt
        }));
        res.status(200).json(mapped);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getFormByLink = async (req, res) => {
    try {
        const { link } = req.params;
        const form = await Form.findOne({ shareableLink: link });
        if (!form)
            return res.status(404).json({ error: 'Form not found' });
        if (form.status === 'draft')
            return res.status(403).json({ error: 'Form is not yet published' });
        // Check expiration
        const isExpired = form.expiresAt && new Date() > form.expiresAt;
        res.status(200).json({
            ...form.toObject(),
            id: form._id,
            form_type: form.formType,
            shareable_link: form.shareableLink,
            expires_at: form.expiresAt,
            isExpired
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createForm = async (req, res) => {
    try {
        const form = await Form.create({
            ...req.body,
            adminId: req.user._id,
            shareableLink: Math.random().toString(36).substring(2, 10)
        });
        res.status(201).json({ success: true, data: form });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateForm = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await Form.findByIdAndUpdate(id, req.body, { new: true });
        if (!form)
            return res.status(404).json({ error: 'Form not found' });
        res.status(200).json({ success: true, data: form });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//# sourceMappingURL=forms.js.map