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

/**
 * @openapi
 * /tools:
 *   get:
 *     summary: Get list of tools
 *     tags: [Tools]
 *     parameters:
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
 *               $ref: '#/components/schemas/ToolsListResponse'
 */

router.get('/', celebrate(getAllToolsSchema), getAllTools);

/**
 * @openapi
 * /tools/{toolId}:
 *   get:
 *     summary: Get tool by id
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema: { $ref: '#/components/schemas/ObjectId' }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:toolId', celebrate(toolIdParamsSchema), getToolById);

/**
 * @openapi
 * /tools:
 *   post:
 *     summary: Create tool
 *     tags: [Tools]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToolCreateInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/', authenticate, celebrate(createToolSchema), createTool);

/**
 * @openapi
 * /tools/{toolId}:
 *   delete:
 *     summary: Delete tool
 *     tags: [Tools]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema: { $ref: '#/components/schemas/ObjectId' }
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:toolId',
  authenticate,
  celebrate(toolIdParamsSchema),
  deleteTool,
);

/**
 * @openapi
 * /tools/{toolId}:
 *   patch:
 *     summary: Update tool
 *     tags: [Tools]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema: { $ref: '#/components/schemas/ObjectId' }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToolUpdateInput'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:toolId', authenticate, celebrate(updateToolSchema), updateTool);

/**
 * @openapi
 * /tools/{toolId}/image:
 *   patch:
 *     summary: Update tool image
 *     tags: [Tools]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema: { $ref: '#/components/schemas/ObjectId' }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [images]
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  '/:toolId/image',
  authenticate,
  upload.single('images'),
  updateToolImage,
);

export default router;
