import { Router } from 'express';
import {
  createTool,
  deleteTool,
  getAllTools,
  getToolById,
  updateTool,
} from '../controllers/toolsController.js';

const router = Router();

router.get('/tools', getAllTools);

router.get('/tools/:toolId', getToolById);

router.post('/tools', createTool);

router.delete('/tools/:toolId', deleteTool);

router.patch('/tools/:toolId', updateTool);

export default router;
