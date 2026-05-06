import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: [true, 'Brand name is required'],
    },
    detail: {
        type: String,
    },
    image: {
        type: String, // Path to image
    },
    price: {
        type: Number,
        required: [true, 'Brand price is required'],
    },
});

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
    },
    productDescription: {
        type: String,
        required: [true, 'Product description is required'],
    },
    brands: [brandSchema],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Product', productSchema);
