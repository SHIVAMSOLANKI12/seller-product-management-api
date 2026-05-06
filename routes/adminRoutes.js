import express from 'express';
import { adminLogin, createSeller, getSellers } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateAdminLogin, validateCreateSeller } from '../validations/adminValidation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@example.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiResponse' }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/login', validateAdminLogin, adminLogin);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/sellers:
 *   post:
 *     summary: Create a new Seller
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, mobileNo, country, state, skills, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               mobileNo: { type: string }
 *               country: { type: string }
 *               state: { type: string }
 *               skills: { type: array, items: { type: string } }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Seller created
 *       400:
 *         description: Validation error
 *   get:
 *     summary: List all Sellers with pagination
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Records per page
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/sellers', validateCreateSeller, createSeller);
router.get('/sellers', getSellers);

export default router;
