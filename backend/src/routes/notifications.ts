import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Mock notifications route since frontend expects it
router.get('/', authenticate, (req, res) => {
  res.json([]);
});

router.put('/', authenticate, (req, res) => {
  res.json({ success: true });
});

export default router;
