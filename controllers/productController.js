import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateProductPDF } from '../services/productPdfService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPagination } from '../utils/paginationUtils.js';
import path from 'path';
import fs from 'fs';

// @desc    Add Product
// @route   POST /api/products
// @access  Private/Seller
export const addProduct = asyncHandler(async (req, res, next) => {
    const { productName, productDescription } = req.body;
    
    let brands = typeof req.body.brands === 'string' ? JSON.parse(req.body.brands) : req.body.brands;

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
});

// @desc    Get Seller Products (Listing)
// @route   GET /api/products
// @access  Private/Seller
export const getMyProducts = asyncHandler(async (req, res, next) => {
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
});

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private/Seller
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return errorResponse(res, 'Product not found', 404);
    }

    if (product.seller.toString() !== req.user.id) {
        return errorResponse(res, 'Not authorized to delete this product', 401);
    }

    product.brands.forEach((brand) => {
        if (brand.image) {
            const imgPath = path.join(process.cwd(), brand.image);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        }
    });

    await product.deleteOne();

    successResponse(res, 'Product deleted successfully', {});
});

// @desc    Generate Product PDF
// @route   GET /api/products/:id/pdf
// @access  Private/Seller
export const getProductPDF = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return errorResponse(res, 'Product not found', 404);
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 'Not authorized', 401);
    }

    const filePath = path.join(process.cwd(), 'uploads', `product-${product._id}.pdf`);
    
    await generateProductPDF(product, filePath);

    res.download(filePath, `${product.productName}-details.pdf`);
});
