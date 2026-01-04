import { Router } from 'express';
import {
  getCurrentUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} from '../controllers/usersController.js';
import { getUserTools } from '../controllers/toolsController.js';
import { celebrate } from 'celebrate';
import {
  updateUserSchema,
  userIdParamsSchema,
  usersToolsSchema,
} from '../validations/usersValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.get('/current', authenticate, getCurrentUser);
router.patch('/current', authenticate, celebrate(updateUserSchema), updateUser);
router.patch(
  '/current/avatar',
  authenticate,
  upload.single('avatarUrl'),
  updateUserAvatar,
);

router.get('/:userId/tools', celebrate(usersToolsSchema), getUserTools);
router.get('/:userId', celebrate(userIdParamsSchema), getUserById);

export default router;
