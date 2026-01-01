import { Router } from 'express';
import {
  createFeedback,
  getFeedbacks,
} from '../controllers/feedbacksController.js';

const router = Router();

router.get('/', getFeedbacks);

router.post('/', createFeedback);

export default router;
