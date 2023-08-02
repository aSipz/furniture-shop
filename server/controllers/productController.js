const router = require('express').Router();

const productManager = require('../managers/productManager');
const ratingManager = require('../managers/ratingManager');
const favoriteManager = require('../managers/favoriteManager');
const orderManager = require('../managers/orderManager');
const { conn } = require('../database/dbConnect');
const { adminGuard } = require('../middlewares/authMiddleware');
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

    const session = await conn.startSession();

    try {
        session.startTransaction();
        const [orders, count] = await orderManager.getAll(JSON.stringify({ 'products.productId': productId }), { session });

        const ordersForCancel = orders.filter(o => o.status !== 'Completed');

        await Promise.all([
            ...ordersForCancel.map(o => orderManager.edit(o._id, { status: 'Completed' }, { session })),
            productManager.delete(productId, { session }),
            favoriteManager.deleteByProduct(productId, { session }),
            ratingManager.deleteByProduct(productId, { session })
        ]);

        await session.commitTransaction();
        res.status(204).end();
    } catch (error) {
        await session.abortTransaction();
        next(error);
        console.log(error);
    }

    session.endSession();
}

router.get('/', getAllProducts);
router.post('/', adminGuard, createProduct);
router.get('/:productId', getOneProduct);
router.put('/:productId', adminGuard, editProduct);
router.delete('/:productId', adminGuard, deleteProduct);

module.exports = router;