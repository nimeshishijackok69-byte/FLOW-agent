import express from 'express';
import { getForms, getFormByLink, createForm, updateForm } from '../controllers/forms.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();
router.get('/', authenticate, getForms);
router.get('/public/:link', getFormByLink);
router.post('/', authenticate, authorize('admin'), createForm);
router.patch('/:id', authenticate, authorize('admin'), updateForm);
export default router;
//# sourceMappingURL=forms.js.map