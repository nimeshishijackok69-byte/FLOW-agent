import { Response } from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit);
    const mapped = logs.map(l => ({ ...l.toObject(), id: l._id, created_at: l.createdAt }));
    res.status(200).json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createAuditLog = async (req: AuthRequest, res: Response) => {
  try {
    const { action, details } = req.body;
    const log = await AuditLog.create({
      userId: req.user?._id || req.body.user_id,
      action,
      details,
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    });
    res.status(201).json(log);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
