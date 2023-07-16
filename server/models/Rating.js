const { Schema, model } = require('mongoose');

const ratingSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
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

const Rating = model('Rating', ratingSchema);

module.exports = Rating;