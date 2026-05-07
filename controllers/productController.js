import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateProductPDF } from '../services/productPdfService.js';
import { getPagination } from '../utils/paginationUtils.js';
import ErrorResponse from '../utils/errorResponse.js';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// @desc    Add Product
// @route   POST /api/products
// @access  Private/Seller
export const addProduct = async (req, res, next) => {
    try {
        const { productName, productDescription } = req.body;
        
        let brands;
        try {
            brands = typeof req.body.brands === 'string' ? JSON.parse(req.body.brands) : req.body.brands;
        } catch (error) {
            return next(new ErrorResponse('Invalid format for brands. Please provide valid JSON.', 400));
        }

        if (!Array.isArray(brands)) {
            return next(new ErrorResponse('Brands must be an array.', 400));
        }

        if (req.files && req.files.length > 0) {
            brands = brands.map((brand, index) => {
                if (req.files[index]) {
                    return { ...brand, image: req.files[index].path };
                }
                return brand;
            });
        }

        const product = await Product.create({
            productName,
            productDescription,
            brands,
            seller: req.user.id,
        });

        successResponse(res, 'Product added successfully', product, 201);
    } catch (err) {
        next(err);
    }
};

// @desc    Get Seller Products (Listing)
// @route   GET /api/products
// @access  Private/Seller
export const getMyProducts = async (req, res, next) => {
    try {
        const total = await Product.countDocuments({ seller: req.user.id });
        const { startIndex, limit, metadata } = getPagination(req.query.page, req.query.limit, total);

        const products = await Product.find({ seller: req.user.id })
            .skip(startIndex)
            .limit(limit)
            .sort('-createdAt');

        successResponse(res, 'Products retrieved successfully', {
            products,
            ...metadata,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private/Seller
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        if (product.seller.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to delete this product', 401));
        }

        // Use Promise.all for parallel file deletions
        const deletionPromises = product.brands.map(async (brand) => {
            if (brand.image) {
                const imgPath = path.join(process.cwd(), brand.image);
                try {
                    if (existsSync(imgPath)) {
                        await fs.unlink(imgPath);
                    }
                } catch (err) {
                    console.error(`Failed to delete image: ${imgPath}`, err);
                    // We don't block the whole deletion if one image fails
                }
            }
        });

        await Promise.all(deletionPromises);
        await product.deleteOne();

        successResponse(res, 'Product deleted successfully', {});
    } catch (err) {
        next(err);
    }
};

// @desc    Generate Product PDF
// @route   GET /api/products/:id/pdf
// @access  Private/Seller
export const getProductPDF = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized', 401));
        }

        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filePath = path.join(uploadsDir, `product-${product._id}.pdf`);
        
        // Ensure uploads directory exists
        try {
            await fs.mkdir(uploadsDir, { recursive: true });
        } catch (err) {
            return next(new ErrorResponse('Failed to prepare uploads directory', 500));
        }

        try {
            await generateProductPDF(product, filePath);
            
            res.download(filePath, `${product.productName}-details.pdf`, async (err) => {
                if (err) {
                    // If headers not sent, we can still call next(err)
                    if (!res.headersSent) {
                        return next(new ErrorResponse('Error downloading the file', 500));
                    }
                }
                // Cleanup: delete file after download attempt
                try {
                    if (existsSync(filePath)) {
                        await fs.unlink(filePath);
                    }
                } catch (cleanupErr) {
                    console.error('Failed to cleanup PDF:', cleanupErr);
                }
            });
        } catch (pdfErr) {
            return next(new ErrorResponse(`Failed to generate PDF: ${pdfErr.message}`, 500));
        }
    } catch (err) {
        next(err);
    }
};
