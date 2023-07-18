const router = require('express').Router();

const favoriteManager = require('../managers/favoriteManager');
const productManager = require('../managers/productManager');
const { privateGuard } = require('../middlewares/authMiddleware');
const { removeVer, toJSON } = require('../utils');

const getFavorites = async (req, res, next) => {
    const { productId } = req.params;

    if (!req.user) {
        return res.status(204).end();
    }

    const ownerId = req.user._id;

    try {
        const existingFavorite = await favoriteManager.getByOwnerAndProduct(ownerId, productId);
        if (existingFavorite) {
            return res.status(200).send(removeVer(toJSON(existingFavorite)));
        }

        return res.status(204).end();

    } catch (error) {
        next(error);
        console.log(error);
    }
}

const addToFavorites = async (req, res, next) => {
    const { productId } = req.body;
    const ownerId = req.user._id;

    try {
        const existingFavorite = await favoriteManager.getByOwnerAndProduct(ownerId, productId);
        if (existingFavorite) {
            const error = new Error('Already added to favorites!');
            error.statusCode = 409;
            throw error;
        }
        const favorite = await favoriteManager.create(ownerId, productId);
        res.status(200).send(removeVer(toJSON(favorite)));
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const deleteFavorite = async (req, res, next) => {
    const { productId } = req.params;
    const ownerId = req.user._id;

    try {
        await favoriteManager.delete(ownerId, productId);
        res.status(204).end();
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const getAllFavorites = async (req, res, next) => {
    const ownerId = req.user._id;
    const search = req.query.search ? JSON.parse(JSON.parse(req.query.search)) : {};

    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const include = req.query.include;

    try {
        const productIds = (await favoriteManager.getProductsIdByUser(ownerId)).map(e => toJSON(e).product);
    
        search._id = { $in: productIds };

        const [result, count] = await productManager.getAll(JSON.stringify(search), limit, skip, sort, include);

        res.status(200)
            .send({ result, count });
    } catch (error) {
        next(error);
        console.log(error);
    }

};

router.get('/',privateGuard, getAllFavorites);
router.post('/', privateGuard, addToFavorites);
router.get('/:productId', getFavorites);
router.delete('/:productId', privateGuard, deleteFavorite);

module.exports = router;