import { Router } from 'express';
import {
  createTool,
  deleteTool,
  getAllTools,
  getToolById,
  updateTool,
  updateToolImage,
} from '../controllers/toolsController.js';
import { celebrate } from 'celebrate';
import {
  createToolSchema,
  getAllToolsSchema,
  toolIdParamsSchema,
  updateToolSchema,
} from '../validations/toolsValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

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
router.patch(
  '/:toolId/image',
  authenticate,
  upload.single('images'),
  updateToolImage,
);

export default router;
