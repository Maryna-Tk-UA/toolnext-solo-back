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

/**
 * @openapi
 * /feedbacks:
 *   get:
 *     summary: Get feedbacks (optionally filtered by toolId)
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: query
 *         name: toolId
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *         description: Filter feedbacks by tool id
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1 }
 *         description: If provided, returns limited list without pagination fields
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: perPage
 *         schema: { type: integer, minimum: 5, maximum: 20, default: 10 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/FeedbacksListResponsePaginated'
 *                 - $ref: '#/components/schemas/FeedbacksListResponseLimited'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/', celebrate(getFeedbacksSchema), getFeedbacks);

/**
 * @openapi
 * /feedbacks:
 *   post:
 *     summary: Create feedback
 *     tags: [Feedbacks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeedbackCreateInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/', authenticate, celebrate(createFeedbackSchema), createFeedback);

export default router;
