const { Schema, model } = require('mongoose');

const { orderStatus } = require('../utils');

const childSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    count: {
        type: Number,
        required: true,
        min: 0
    }
})

const orderSchema = new Schema({
    email: {
        type: String,
        required: [true, '{PATH} is required'],
        match: [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/, '{PATH} should be valid!'],
    },
    firstName: {
        type: String,
        required: [true, '{PATH} is required'],
        match: [/^[A-Z]+[a-z]{1,}$/, '{PATH} should contain only latin letters and starts with capital letter!'],
    },
    lastName: {
        type: String,
        required: [true, '{PATH} is required'],
        match: [/^[A-Z]+[a-z]{1,}$/, '{PATH} should contain only latin letters and starts with capital letter!'],
    },
    address: {
        type: String,
        required: true,
        minLength: [10, '{PATH} should be at least 10 characters long!']
    },
    phone: {
        type: String,
        required: [true, '{PATH} is required'],
        match: [/^08[0-9]{8}$/, 'Invalid {PATH}'],
    },
    notes: {
        type: String
    },
    amount: {
        type: Number,
        min: 0,
        required: true
    },
    status: {
        type: String,
        required: [true, '{PATH} is required'],
        enum: { values: orderStatus, message: `{PATH} should be one of the following ${orderStatus.join(', ')}` },
        default: 'Received'
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [childSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const Order = model('Order', orderSchema);

module.exports = Order;