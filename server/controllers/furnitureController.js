const router = require('express').Router();

const furnitureManager = require('../managers/furnitureManager');
const { privateGuard } = require('../middlewares/authMiddleware');

const getAllFurniture = async (req, res, next) => {
    const search = req.query.where;

    try {
        const furniture = await furnitureManager.getAll(search);
        res.json(furniture);
    } catch (error) {
        next(error);
        console.log(error);
    }

};

const createFurniture = async (req, res, next) => {
    const _ownerId = req.user._id;
    try {
        const result = await furnitureManager.create({ ...req.body, _ownerId });
        res.json({ _id: result._id });
    } catch (error) {
        next(error);
        console.log(error);
    }
};

const getOneFurniture = async (req, res, next) => {
    const { furnitureId } = req.params;
    try {
        const result = await furnitureManager.getOne(furnitureId);
        res.json(result);
    } catch (error) {
        next(error);
        console.log(error);
    }
};

const editFurniture = async (req, res, next) => {
    const { furnitureId } = req.params;
    const userId = req.user._id;
    try {
        const result = await furnitureManager.edit(furnitureId, userId, req.body);
        res.json(result);
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const deleteFurniture = async (req, res, next) => {
    const { furnitureId } = req.params;
    const userId = req.user._id;
    try {
        await furnitureManager.delete(furnitureId, userId);
        res.json('ok');
    } catch (error) {
        next(error);
        console.log(error);
    }
}

router.get('/', getAllFurniture);
router.post('/', privateGuard, createFurniture);
router.get('/:furnitureId', getOneFurniture);
router.put('/:furnitureId', editFurniture);
router.delete('/:furnitureId', deleteFurniture);

module.exports = router;