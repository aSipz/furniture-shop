const { Schema, model } = require('mongoose');

const { httpVal, positiveVal } = require('./validators');

const furnitureSchema = new Schema({
    make: {
        type: String,
        required: true,
        minLength: [4, '{PATH} should be at least 4 characters long!']
    },
    model: {
        type: String,
        required: true,
        minLength: [4, '{PATH} should be at least 4 characters long!']
    },
    description: {
        type: String,
        required: true,
        minLength: [10, '{PATH} should be at least 10 characters long!']
    },
    material: {
        type: String,
        minLength: [3, '{PATH} should be at least 3 characters long!']
    },
    year: {
        type: Number,
        required: true,
        min: 1950,
        max: 2050,
    },
    price: {
        type: Number,
        required: true,
        validate: positiveVal
    },
    img: {
        type: String,
        required: true,
        validate: httpVal
    },
    _ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Furniture = model('Furniture', furnitureSchema);

module.exports = Furniture;