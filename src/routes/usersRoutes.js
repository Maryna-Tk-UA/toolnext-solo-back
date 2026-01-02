import { Router } from 'express';
import {
  getCurrentUser,
  getUserById,
  updateUser,
} from '../controllers/usersController.js';
import { getUserTools } from '../controllers/toolsController.js';
import { celebrate } from 'celebrate';
import {
  updateUserSchema,
  userIdParamsSchema,
  usersToolsSchema,
} from '../validations/usersValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/current', authenticate, getCurrentUser);
router.patch('/current', authenticate, celebrate(updateUserSchema), updateUser);

router.get('/:userId/tools', celebrate(usersToolsSchema), getUserTools);
router.get('/:userId', celebrate(userIdParamsSchema), getUserById);

export default router;
