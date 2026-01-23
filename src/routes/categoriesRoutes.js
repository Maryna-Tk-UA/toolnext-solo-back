import { Router } from 'express';
import { getCategories } from '../controllers/categoriesController.js';

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get categories list
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', getCategories);

export default router;
