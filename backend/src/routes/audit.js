import express from 'express';
import { getAuditLogs } from '../controllers/audit.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();
router.get('/', authenticate, authorize('admin'), getAuditLogs);
export default router;
//# sourceMappingURL=audit.js.map