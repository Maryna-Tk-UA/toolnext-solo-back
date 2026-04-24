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
 *         description: Categories list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   keywords:
 *                     type: string
 */
router.get('/', getCategories);

export default router;
