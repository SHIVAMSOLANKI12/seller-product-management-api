import { errorResponse } from '../utils/apiResponse.js';
import ErrorResponse from '../utils/errorResponse.js';

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // Log to console for dev
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new ErrorResponse(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new ErrorResponse(message, 401);
    }

    // Handle SyntaxError (malformed JSON)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const message = 'Malformed JSON in request body';
        error = new ErrorResponse(message, 400);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    errorResponse(
        res, 
        message, 
        statusCode, 
        process.env.NODE_ENV === 'development' ? err.stack : null
    );
};

export default errorHandler;
