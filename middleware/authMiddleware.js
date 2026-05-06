import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return errorResponse(res, 'Not authorized to access this route', 401);
    }

    try {
        const decoded = verifyToken(token);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return errorResponse(res, 'User not found', 401);
        }

        next();
    } catch (err) {
        return errorResponse(res, 'Not authorized to access this route', 401);
    }
});

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                `User role ${req.user.role} is not authorized to access this route`,
                403
            );
        }
        next();
    };
};
