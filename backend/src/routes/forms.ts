import express from 'express';
import { getForms, getFormByLink, createForm, updateForm, deleteForm } from '../controllers/forms.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getForms);
router.get('/public/:link', getFormByLink);
router.post('/', authenticate, authorize('admin'), createForm);
router.put('/', authenticate, authorize('admin'), updateForm);   // Frontend sends id in body
router.patch('/:id', authenticate, authorize('admin'), updateForm);
router.delete('/', authenticate, authorize('admin'), deleteForm);

export default router;
