import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Seller Login
// @route   POST /api/seller/login
// @access  Public
export const sellerLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'seller' }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        return next(new ErrorResponse('Invalid seller credentials', 401));
    }

    const token = generateToken(user._id);

    successResponse(res, 'Seller logged in successfully', {
        token,
        role: user.role,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

// @desc    Get Seller Profile
// @route   GET /api/seller/profile
// @access  Private/Seller
export const getSellerProfile = asyncHandler(async (req, res, next) => {
    const seller = await User.findById(req.user.id);
    if (!seller) {
        return next(new ErrorResponse('Seller not found', 404));
    }
    successResponse(res, 'Seller profile retrieved', seller);
});
