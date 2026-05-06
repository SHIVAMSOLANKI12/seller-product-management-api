import express from 'express';
import {
    addProduct,
    getMyProducts,
    deleteProduct,
    getProductPDF,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateProduct } from '../validations/productValidation.js';
import upload from '../utils/multer.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management for sellers
 */

router.use(protect);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new Product with multiple brands and images
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName: { type: string }
 *               productDescription: { type: string }
 *               brands: { type: string, description: 'JSON string of brands array' }
 *               brandImages:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Product added
 *       400:
 *         description: Validation error
 *   get:
 *     summary: List my Products (Seller only)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Success
 */
router.post(
    '/',
    authorize('seller'),
    upload.array('brandImages', 10),
    validateProduct,
    addProduct
);

router.get('/', authorize('seller'), getMyProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Not authorized
 */
router.delete('/:id', authorize('seller'), deleteProduct);

/**
 * @swagger
 * /api/products/{id}/pdf:
 *   get:
 *     summary: Generate and download Product PDF
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema: { type: string, format: binary }
 */
router.get('/:id/pdf', authorize('seller', 'admin'), getProductPDF);

export default router;
