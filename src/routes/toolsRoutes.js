import { Router } from 'express';
import {
  createTool,
  deleteTool,
  getAllTools,
  getToolById,
  updateTool,
} from '../controllers/toolsController.js';

const router = Router();

router.get('/', getAllTools);

router.get('/:toolId', getToolById);

router.post('/', createTool);

router.delete('/:toolId', deleteTool);

router.patch('/:toolId', updateTool);

export default router;
