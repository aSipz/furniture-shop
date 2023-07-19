const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    text: {
        type: String,
        required: true,
        minLength: [10, '{PATH} should be at least 10 characters long!']
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true });

const Review = model('Review', reviewSchema);

module.exports = Review;