import { Response } from 'express';
import { User } from '../models/User.js';
import { Form } from '../models/Form.js';
import { Submission } from '../models/Submission.js';
import { AuthRequest } from '../middleware/auth.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeForms = await Form.countDocuments({ status: 'active' });
    const draftForms = await Form.countDocuments({ status: 'draft' });
    const expiredForms = await Form.countDocuments({ status: 'expired' });
    const totalSubmissions = await Submission.countDocuments();
    
    // Submissions by status
    const submissionsByStatus = {
      submitted: await Submission.countDocuments({ status: 'submitted' }),
      under_review: await Submission.countDocuments({ status: 'under_review' }),
      approved: await Submission.countDocuments({ status: 'approved' }),
      rejected: await Submission.countDocuments({ status: 'rejected' }),
    };

    // Users by role
    const usersByRole = {
      admin: await User.countDocuments({ role: 'admin' }),
      reviewer: await User.countDocuments({ role: 'reviewer' }),
      functionary: await User.countDocuments({ role: 'functionary' }),
      teacher: await User.countDocuments({ role: 'teacher' }),
    };

    res.status(200).json({
      totalUsers,
      activeForms,
      draftForms,
      expiredForms,
      totalSubmissions,
      submissionsByStatus,
      usersByRole
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
