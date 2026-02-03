import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import {
  authLoginLimiter,
  authRefreshLimiter,
  authRegisterLimiter,
} from '../middleware/rateLimiters.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and sessions
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Your name"
 *               email:
 *                 type: string
 *                 example: "email@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123!"
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
  '/register',
  authRegisterLimiter,
  celebrate(registerUserSchema),
  registerUser,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user and create session
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "email@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123!"
 *     responses:
 *       200:
 *         description: Logged in (cookies are set)
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authLoginLimiter, celebrate(loginUserSchema), loginUser);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user and clear session
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out (cookies cleared)
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', logoutUser);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh session (issue new access token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed (cookies updated)
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh', authRefreshLimiter, refreshUserSession);

export default router;
