const Rating = require('../models/Rating');

exports.getByOwnerAndProduct = (ownerId, productId) => Rating.findOne({ ownerId, productId });

exports.create = (rating, ownerId, productId) => Rating.create({ rating, ownerId, productId });

exports.update = (ratingId, rating) => Rating.findByIdAndUpdate(ratingId, { rating }, { runValidators: true, new: true });