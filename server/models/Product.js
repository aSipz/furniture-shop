const { Schema, model } = require('mongoose');

const { productCategories } = require('../utils');

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [4, '{PATH} should be at least 4 characters long!']
    },
    description: {
        type: String,
        required: true,
        minLength: [10, '{PATH} should be at least 10 characters long!']
    },
    category: {
        type: String,
        required: true,
        enum: { values: productCategories, message: `{PATH} should be one of the following ${productCategories.join(', ')}` }
    },
    material: {
        type: String,
        required: true,
        minLength: [4, '{PATH} should be at least 4 characters long!']
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        min: 0,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    deleted: {
        type: Boolean,
        default: false
    },
    images: {
        type: [{
            key: String,
            name: String,
            url: String
        }],
        required: true
    }
}, { timestamps: true });

const Product = model('Product', productSchema);

module.exports = Product;

// _id: string;
//     name: string;
//     description: string;
//     category: string;
//     color: string;
//     material: string;
//     price: number;
//     discount: number;
//     quantity: number;
//     images?: string[];
//     reviews?: IReview[];
//     ratings?: IRating[];
//     createdAt: string;
//     updatedAt: string;
//     ownerId?: string;