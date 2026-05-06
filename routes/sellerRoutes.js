import express from 'express';
import { sellerLogin, getSellerProfile } from '../controllers/sellerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateSellerLogin } from '../validations/sellerValidation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seller
 *   description: Seller specific operations
 */

/**
 * @swagger
 * /api/seller/login:
 *   post:
 *     summary: Seller Login
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: seller@example.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateSellerLogin, sellerLogin);

/**
 * @swagger
 * /api/seller/profile:
 *   get:
 *     summary: Get Seller Profile
 *     tags: [Seller]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', protect, authorize('seller'), getSellerProfile);

export default router;
