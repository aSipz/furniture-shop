const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true });

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;