import { Router } from 'express';
import {
  getCurrentUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} from '../controllers/usersController.js';
import { getUserTools } from '../controllers/toolsController.js';
import { celebrate } from 'celebrate';
import {
  updateUserSchema,
  userIdParamsSchema,
  usersToolsSchema,
} from '../validations/usersValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

const router = Router();

/**
 * @openapi
 * /users/current:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/current', authenticate, getCurrentUser);

/**
 * @openapi
 * /users/current:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch('/current', authenticate, celebrate(updateUserSchema), updateUser);

/**
 * @openapi
 * /users/current/avatar:
 *   patch:
 *     summary: Update current user avatar
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatarUrl]
 *             properties:
 *               avatarUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  '/current/avatar',
  authenticate,
  upload.single('avatarUrl'),
  updateUserAvatar,
);

/**
 * @openapi
 * /users/{userId}/tools:
 *   get:
 *     summary: Get tools of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ToolsListResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:userId/tools', celebrate(usersToolsSchema), getUserTools);

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:userId', celebrate(userIdParamsSchema), getUserById);

export default router;
