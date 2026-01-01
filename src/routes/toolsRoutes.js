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

const router = Router();

router.get('/', celebrate(getAllToolsSchema), getAllTools);

router.get('/:toolId', celebrate(toolIdParamsSchema), getToolById);

router.post('/', celebrate(createToolSchema), createTool);

router.delete('/:toolId', celebrate(toolIdParamsSchema), deleteTool);

router.patch('/:toolId', celebrate(updateToolSchema), updateTool);

export default router;
