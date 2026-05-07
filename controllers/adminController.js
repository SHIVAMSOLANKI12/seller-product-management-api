import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import { getPagination } from '../utils/paginationUtils.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        return next(new ErrorResponse('Invalid admin credentials', 401));
    }

    const token = generateToken(user._id);

    successResponse(res, 'Admin logged in successfully', {
        token,
        role: user.role,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

// @desc    Create Seller
// @route   POST /api/admin/sellers
// @access  Private/Admin
export const createSeller = asyncHandler(async (req, res, next) => {
    const { name, email, mobileNo, country, state, skills, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse('User with this email already exists', 400));
    }

    const seller = await User.create({
        name,
        email,
        mobileNo,
        country,
        state,
        skills,
        password,
        role: 'seller',
    });

    const sellerData = seller.toObject();
    delete sellerData.password;

    successResponse(res, 'Seller created successfully', sellerData, 201);
});

// @desc    Get All Sellers with Pagination
// @route   GET /api/admin/sellers
// @access  Private/Admin
export const getSellers = asyncHandler(async (req, res, next) => {
    const total = await User.countDocuments({ role: 'seller' });
    const { startIndex, limit, metadata } = getPagination(req.query.page, req.query.limit, total);

    const sellers = await User.find({ role: 'seller' })
        .skip(startIndex)
        .limit(limit);

    successResponse(res, 'Sellers retrieved successfully', {
        sellers,
        ...metadata,
    });
});
