const Review = require('../models/Review');

exports.create = (text, ownerId, productId) => Review.create({ text, ownerId, productId });

exports.update = (reviewId, text) => Review.findByIdAndUpdate(reviewId, { text }, { runValidators: true, new: true });

exports.deleteById = (reviewId) => Review.findByIdAndDelete(reviewId);

exports.getById = (id) => Review.findById(id);

exports.like = (id, userId) => Review.findByIdAndUpdate(id, { $push: { likes: userId } });

exports.dislike = (id, userId) => Review.findByIdAndUpdate(id, { $pull: { likes: userId } });

exports.getAll = (search, limit, skip, sort, include) => {

    let searchCriteria = {};

    if (search) {
        searchCriteria = JSON.parse(search);
    }

    const sortObj = sort
        ? sort.split(',')
            .map(e => e)
            .reduce((acc, curr) => {
                const key = curr.startsWith('-') ? curr.slice(1) : curr;
                acc[key] = curr.startsWith('-') ? -1 : 1;
                return acc;
            }, {})
        : {};

    const fieldsToPopulate = [];

    if (include) {
        const fields = include.split(',').map(e => e).map(e => e.trim());
        fields.forEach(f => {

            if (f === 'ownerId') {
                fieldsToPopulate.push({ path: f, select: ['firstName', 'lastName'] });
            } else {
                fieldsToPopulate.push({ path: f });
            }
        });

    }

    const projectionCriteria = { __v: 0 };

    return Promise.all([
        Review.find(searchCriteria, projectionCriteria)
            .limit(limit && +limit)
            .skip(skip && +skip)
            .sort(sortObj)
            .populate(include && fieldsToPopulate),
        Review.find(searchCriteria, projectionCriteria).count()
    ]);

};