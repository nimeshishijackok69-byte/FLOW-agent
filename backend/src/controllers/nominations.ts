import { Request, Response } from 'express';
import { Nomination } from '../models/Nomination.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

const ensureTeacherUser = async (teacherData: any) => {
  const email = teacherData.teacher_email?.toLowerCase().trim();
  if (!email) return;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    await User.create({
      email,
      role: 'teacher',
      profile: {
        fullName: teacherData.teacher_name || 'Teacher',
        phone: teacherData.teacher_phone || '',
        schoolCode: teacherData.school_code || ''
      }
    });
  }
};

export const getNominations = async (req: AuthRequest, res: Response) => {
  try {
    const { functionary_id, form_id } = req.query;
    const query: any = {};
    if (functionary_id) query.functionary_id = functionary_id;
    if (form_id) query.form_id = form_id;
    
    // Admins can see all, functionaries see theirs
    if (req.user.role === 'functionary') {
      query.functionary_id = req.user._id;
    }

    const nominations = await Nomination.find(query).sort({ createdAt: -1 });
    const mapped = nominations.map(n => ({ ...n.toObject(), id: n._id }));
    res.status(200).json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createNomination = async (req: AuthRequest, res: Response) => {
  try {
    const { action, nominations } = req.body;

    if (action === 'bulk-nominate' && Array.isArray(nominations)) {
      const created = await Nomination.insertMany(nominations);
      // Create user accounts for each nominated teacher
      for (const nom of nominations) {
        await ensureTeacherUser(nom);
      }
      return res.status(201).json({ success: true, count: created.length });
    }

    const nomination = await Nomination.create({
      ...req.body,
      functionary_id: req.user._id, // Ensure functionary_id is set to the current user
    });

    // Create user account for the nominated teacher
    await ensureTeacherUser(req.body);

    res.status(201).json({ success: true, data: { ...nomination.toObject(), id: nomination._id } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNomination = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.status(400).json({ error: 'Nomination ID required' });
    
    const updates = { ...req.body };
    delete updates.id;
    
    const nomination = await Nomination.findByIdAndUpdate(id, updates, { new: true });
    if (!nomination) return res.status(404).json({ error: 'Nomination not found' });
    res.status(200).json({ success: true, data: { ...nomination.toObject(), id: nomination._id } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNomination = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Nomination ID required' });
    const nomination = await Nomination.findByIdAndDelete(id);
    if (!nomination) return res.status(404).json({ error: 'Nomination not found' });
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
