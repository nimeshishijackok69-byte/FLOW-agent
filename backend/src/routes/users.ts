import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/users.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin')); // Only admins can manage users

router.get('/', getUsers);
router.post('/', createUser);
router.put('/', updateUser);
router.delete('/', deleteUser);

export default router;
