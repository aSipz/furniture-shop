const Product = require('../models/Product');

exports.getProductByName = (name) => Product.findOne({ name });

exports.getProductById = (id, { include }) => {

    const fieldsToPopulate = [];

    if (include) {
        const fields = include.split(',').map(e => e).map(e => e.trim());
        fields.forEach(f => {
            fieldsToPopulate.push({ path: f });
        });

    }

    return Product.findById(id, { __v: 0 }).populate(include && fieldsToPopulate);
};

exports.getAll = (search, limit, skip) => {

    const searchCriteria = {};

    if (search) {
        const searchArray = [];

        const entry = search.split('=');

        searchArray.push({ [entry[0]]: { $exists: true, $eq: entry[1].slice(1, -1) } });

        searchCriteria[$and] = searchArray;

    }

    const projectionCriteria = { __v: 0 };


    return Promise.all([
        Product.find(searchCriteria, projectionCriteria).limit(limit && +limit).skip(skip && +skip),
        Product.find(searchCriteria, projectionCriteria).count()
    ]);

};

exports.create = (productData) => Product.create(productData);

exports.edit = async (furnitureId, userId, furnitureData) => {
    const furniture = await this.getOne(furnitureId);

    if (userId != furniture._ownerId) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    return Product.findByIdAndUpdate(furnitureId, furnitureData, { runValidators: true });
}

exports.delete = async (furnitureId, userId) => {
    const furniture = await this.getOne(furnitureId);

    if (userId != furniture._ownerId) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    return Product.findByIdAndDelete(furnitureId);
}