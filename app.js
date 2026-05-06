import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from './middleware/mongoSanitize.js';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';

import errorHandler from './middleware/errorMiddleware.js';

// Load env vars
dotenv.config();

const app = express();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for Swagger UI compatibility
}));

// CORS
app.use(cors());

// --- Security for /api routes ---
// Data sanitization against NoSQL query injection
app.use('/api', mongoSanitize);

// Prevent HTTP parameter pollution
app.use('/api', hpp());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// --- Routes ---
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import productRoutes from './routes/productRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the Express Backend API',
        documentation: '/api-docs'
    });
});

// Error handling middleware
app.use(errorHandler);

export default app;
