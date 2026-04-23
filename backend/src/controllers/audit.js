import { AuditLog } from '../models/AuditLog.js';
export const getAuditLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit);
        const mapped = logs.map(l => ({ ...l.toObject(), id: l._id, created_at: l.createdAt }));
        res.status(200).json(mapped);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//# sourceMappingURL=audit.js.map