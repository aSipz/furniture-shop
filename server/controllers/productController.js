const router = require('express').Router();

const productManager = require('../managers/productManager');
const ratingManager = require('../managers/ratingManager');
const { privateGuard, adminGuard } = require('../middlewares/authMiddleware');
const { removeVer, toJSON } = require('../utils');

const getAllProducts = async (req, res, next) => {
    const search = req.query.search;

    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const include = req.query.include;

    try {
        const [result, count] = await productManager.getAll(search, limit, skip, sort, include);
        res.status(200)
            .send({ result, count });
    } catch (error) {
        next(error);
        console.log(error);
    }

};

const createProduct = async (req, res, next) => {

    const ownerId = req.user._id;

    const { name, description, category, color, material, price, discount, quantity, images } = req.body;

    try {
        const sameProductExists = await productManager.getProductByName(name);

        if (sameProductExists) {
            const error = new Error('There is already a product with this name!');
            error.statusCode = 409;
            throw error;
        }

        const newProduct = await productManager.create({ name, description, category, color, material, price, discount, quantity, images, ownerId });

        res.status(201)
            .send(removeVer(toJSON(newProduct)));
    } catch (error) {
        next(error);
        console.log(error);
    }

};

const getOneProduct = async (req, res, next) => {
    const { productId } = req.params;
    const { include } = req.query;
    try {
        const result = await productManager.getProductById(productId, include);
        res.status(200)
            .send(result);
    } catch (error) {
        next(error);
        console.log(error);
    }
};

const editProduct = async (req, res, next) => {
    const { productId } = req.params;
    const { name, description, category, color, material, price, discount, quantity, images, deleted } = req.body;

    try {
        const sameProductExists = await productManager.getProductByName(name, productId);

        console.log(sameProductExists);

        if (sameProductExists) {
            const error = new Error('There is already a product with this name!');
            error.statusCode = 409;
            throw error;
        }

        const editedProduct = await productManager.edit(productId, { name, description, category, color, material, price, discount, quantity, images, deleted });
        res.status(200)
            .send(removeVer(toJSON(editedProduct)));
    } catch (error) {
        next(error);
        console.log(error);
    }

}

const deleteProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        await productManager.delete(productId);
        res.status(204).end();
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const rateProduct = async (req, res, next) => {
    const { productId } = req.params;
    const ownerId = req.user._id;
    const { rating } = req.body;

    try {
        const existingRating = await ratingManager.getByOwnerAndProduct(ownerId, productId);

        let newRating;

        if (existingRating) {
            newRating = await ratingManager.update(existingRating._id, rating);
        } else {
            newRating = await ratingManager.create(rating, ownerId, productId);
            await productManager.rate(productId, newRating._id);
        }
        res.status(200).send(removeVer(toJSON(newRating)));
    } catch (error) {
        next(error);
        console.log(error);
    }

}

router.get('/', getAllProducts);
router.post('/', adminGuard, createProduct);
router.get('/:productId', getOneProduct);
router.put('/:productId', adminGuard, editProduct);
router.delete('/:productId', adminGuard, deleteProduct);
router.post('/:productId/rate', privateGuard, rateProduct);

module.exports = router;