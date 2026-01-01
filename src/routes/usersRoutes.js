import { Router } from 'express';
import { getUserById, updateUser } from '../controllers/usersController.js';
import { getUserTools } from '../controllers/toolsController.js';
import { celebrate } from 'celebrate';
import {
  updateUserSchema,
  userIdParamsSchema,
} from '../validations/usersValidation.js';

const router = Router();

router.get('/:userId/tools', celebrate(userIdParamsSchema), getUserTools);

router.get('/:userId', celebrate(userIdParamsSchema), getUserById);

router.patch('/:userId', celebrate(updateUserSchema), updateUser);

export default router;
