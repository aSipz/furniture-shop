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
    color: {
        type: String,
        required: true,
        minLength: [3, '{PATH} should be at least 3 characters long!']
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
    },
    discount: {
        type: Number,
        min: 0,
        max: 99,
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

productSchema.virtual('discountPrice').
    get(function () { return this.price * (100 - this.discount) / 100; });

const Product = model('Product', productSchema);

module.exports = Product;