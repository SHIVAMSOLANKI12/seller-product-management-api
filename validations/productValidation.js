import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

export const validateProduct = [
    body('productName').notEmpty().withMessage('Product name is required'),
    body('productDescription').notEmpty().withMessage('Product description is required'),
    body('brands').custom((value) => {
        // If brands comes as a string (common with FormData), parse it
        const brands = typeof value === 'string' ? JSON.parse(value) : value;
        if (!Array.isArray(brands) || brands.length === 0) {
            throw new Error('At least one brand is required');
        }
        brands.forEach((brand, index) => {
            if (!brand.brandName) throw new Error(`Brand name is missing at index ${index}`);
            if (!brand.price) throw new Error(`Brand price is missing at index ${index}`);
        });
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation Error', 400, errors.array());
        }
        next();
    },
];
