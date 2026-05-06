import jwt from 'jsonwebtoken';

/**
 * @desc    Generate JWT Token
 */
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

/**
 * @desc    Verify JWT Token
 */
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
