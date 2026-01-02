import { Router } from 'express';
import {
  createTool,
  deleteTool,
  getAllTools,
  getToolById,
  updateTool,
} from '../controllers/toolsController.js';
import { celebrate } from 'celebrate';
import {
  createToolSchema,
  getAllToolsSchema,
  toolIdParamsSchema,
  updateToolSchema,
} from '../validations/toolsValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', celebrate(getAllToolsSchema), getAllTools);

router.get('/:toolId', celebrate(toolIdParamsSchema), getToolById);

router.post('/', authenticate, celebrate(createToolSchema), createTool);

router.delete(
  '/:toolId',
  authenticate,
  celebrate(toolIdParamsSchema),
  deleteTool,
);

router.patch('/:toolId', authenticate, celebrate(updateToolSchema), updateTool);

export default router;
