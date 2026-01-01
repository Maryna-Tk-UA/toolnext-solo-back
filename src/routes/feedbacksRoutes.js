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

const router = Router();

router.get('/', celebrate(getFeedbacksSchema), getFeedbacks);

router.post('/', celebrate(createFeedbackSchema), createFeedback);

export default router;
