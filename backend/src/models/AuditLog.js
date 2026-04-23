import mongoose from 'mongoose';
const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    targetType: { type: String },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: mongoose.Schema.Types.Mixed,
    metadata: {
        ip: String,
        userAgent: String
    },
    createdAt: { type: Date, default: Date.now }
});
// TTL Index: Auto-expire after 90 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
//# sourceMappingURL=AuditLog.js.map