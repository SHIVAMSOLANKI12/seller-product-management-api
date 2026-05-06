import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

export const validateAdminLogin = [
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

export const validateCreateSeller = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('mobileNo')
        .notEmpty()
        .withMessage('Mobile number is required')
        .isMobilePhone()
        .withMessage('Please provide a valid mobile number'),
    body('country').notEmpty().withMessage('Country is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('skills').isArray().withMessage('Skills must be an array'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation Error', 400, errors.array());
        }
        next();
    },
];
