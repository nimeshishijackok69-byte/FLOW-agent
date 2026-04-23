import express from 'express';
import { getStats } from '../controllers/stats.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getStats);

export default router;
