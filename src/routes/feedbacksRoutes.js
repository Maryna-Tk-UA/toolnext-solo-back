import { Router } from 'express';
import {
  createFeedback,
  getFeedbacks,
} from '../controllers/feedbacksController.js';
import { celebrate } from 'celebrate';
import {
  createFeedbackSchema,
  getFeedbacksSchema,
} from '../validations/feedbacksValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', celebrate(getFeedbacksSchema), getFeedbacks);

router.post('/', authenticate, celebrate(createFeedbackSchema), createFeedback);

export default router;
