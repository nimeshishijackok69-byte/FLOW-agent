import express from 'express';
import { getAuditLogs, createAuditLog } from '../controllers/audit.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), getAuditLogs);
router.post('/', authenticate, createAuditLog);

export default router;
