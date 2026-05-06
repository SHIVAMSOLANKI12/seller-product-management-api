import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

export const validateSellerLogin = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation Error', 400, errors.array());
        }
        next();
    },
];
