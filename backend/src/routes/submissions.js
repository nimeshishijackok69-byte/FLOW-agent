import express from 'express';
import { submitForm, getSubmissions, getSubmissionById, updateSubmission } from '../controllers/submissions.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { submissionSchema } from '../utils/schemas.js';
const router = express.Router();
router.post('/', authenticate, validate(submissionSchema), submitForm);
router.put('/', authenticate, updateSubmission);
router.get('/', authenticate, getSubmissions);
router.get('/:id', authenticate, getSubmissionById);
export default router;
//# sourceMappingURL=submissions.js.map