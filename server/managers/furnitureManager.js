const Furniture = require('../models/Furniture');

exports.getAll = (search) => {
    if (!search) {
        return Furniture.find()
    }

    const searchArray = [];

    const entry = search.split('=');

    searchArray.push({ [entry[0]]: { $exists: true, $eq: entry[1].slice(1, -1) } });

    return Furniture.find({ $and: searchArray })

};

exports.getOne = (furnitureId) => Furniture.findById(furnitureId);

exports.create = (furnitureData) => Furniture.create(furnitureData);

exports.edit = async (furnitureId, userId, furnitureData) => {
    const furniture = await this.getOne(furnitureId);

    if (userId != furniture._ownerId) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    return Furniture.findByIdAndUpdate(furnitureId, furnitureData, { runValidators: true });
}

exports.delete = async (furnitureId, userId) => {
    const furniture = await this.getOne(furnitureId);

    if (userId != furniture._ownerId) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    return Furniture.findByIdAndDelete(furnitureId);
}