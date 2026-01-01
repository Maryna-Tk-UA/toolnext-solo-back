import { Router } from 'express';
import { getUserById } from '../controllers/usersController.js';
import { getUserTools } from '../controllers/toolsController.js';

const router = Router();

router.get('/:userId', getUserById);

router.get('/:userId/tools', getUserTools);

export default router;
