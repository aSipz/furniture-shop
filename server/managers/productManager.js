const Product = require('../models/Product');

exports.getProductByName = (name, id) => {
    if (!id) {
        return Product.findOne({ name });
    }
    return Product.findOne({ name, _id: { '$ne': id } });
};

exports.getProductById = (id, include) => {

    const fieldsToPopulate = [];

    if (include) {
        const fields = include.split(',').map(e => e).map(e => e.trim());
        fields.forEach(f => {
            if (f === 'ratings') {
                fieldsToPopulate.push({ path: f, select: 'rating' });
            } else {
                fieldsToPopulate.push({ path: f });
            }

        });

    }

    return Product.findById(id, { __v: 0 }).populate(include && fieldsToPopulate);
};

exports.getAll = (search, limit, skip, sort, include) => {

    let searchCriteria = {};

    if (search) {
        searchCriteria = JSON.parse(search);
        // const searchArray = [];

        // const searchEntries = search.slice(1, -1).split(',').map(e => e);

        // searchEntries.forEach(s => {
        //     const current = s.split(':');
        //     searchArray.push({ [current[0].slice(1, -1)]: { $exists: true, $eq: current[1] } })
        // });

        // searchCriteria['$and'] = searchArray;
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
            fieldsToPopulate.push({ path: f });
        });

    }


    const projectionCriteria = { __v: 0 };

    return Promise.all([
        Product.find(searchCriteria, projectionCriteria)
            .limit(limit && +limit)
            .skip(skip && +skip)
            .sort(sortObj)
            .populate(include && fieldsToPopulate),
        Product.find(searchCriteria, projectionCriteria).count()
    ]);

};

exports.create = (productData) => Product.create(productData);

exports.edit = (productId, productData) => Product.findByIdAndUpdate(productId, productData, { runValidators: true, new: true });

exports.delete = (productId) => Product.findByIdAndDelete(productId);

exports.rate = (productId, ratingId) => Product.findByIdAndUpdate(productId, { $push: { ratings: ratingId } });