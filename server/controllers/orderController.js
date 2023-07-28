const router = require('express').Router();

const orderManager = require('../managers/orderManager');
const productManager = require('../managers/productManager');
const { conn } = require('../database/dbConnect')
const { privateGuard } = require('../middlewares/authMiddleware');
const { removeVer, toJSON } = require('../utils');

const createOrder = async (req, res, next) => {

    const ownerId = req.user._id;
    const { firstName, lastName, email, phone, address, notes, products, amount } = req.body;

    const session = await conn.startSession();
    try {
        session.startTransaction();
        const dbProducts = await Promise.all(products.map(p => productManager.getProductById(p.productId, null, { session })));
        await Promise.all(dbProducts.map(p => {
            p.quantity -= products.find(e => e.productId == p._id.toString()).count;
            return p.save({ session });
        }));
        await orderManager.create({ firstName, lastName, email, phone, address, notes, products, ownerId, amount }, { session });
        await session.commitTransaction();
        res.status(201)
            .end();
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        if (error._message == 'Product validation failed') {
            error.statusCode = 409;
        }
        next(error);
    }
    session.endSession();
};

const getAllOrders = async (req, res, next) => {
    const search = req.query.search;
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const include = req.query.include;

    const userId = req.user._id.toString();
    const role = req.user.userRights;


    if (search && JSON.parse(search).ownerId) {
        const ownerId = JSON.parse(search).ownerId;
        if (ownerId !== userId && role != 'admin') {
            return res.status(401).end();
        }
    }

    try {
        const [result, count] = await orderManager.getAll(search, limit, skip, sort, include);
        res.status(200)
            .send({ result, count });
    } catch (error) {
        next(error);
        console.log(error);
    }
};

const editOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user._id.toString();
    const role = req.user.userRights;

    if (status !== 'Canceled' && role != 'admin') {
        return res.status(401).end();
    }

    const session = await conn.startSession();
    try {
        session.startTransaction();
        const order = await orderManager.getById(orderId, { session });
        if (order.ownerId.toString() !== userId && role != 'admin') {
            return res.status(401).end();
        }

        if (status === 'Canceled' && role != 'admin' && !['Received', 'Processing'].includes(order.status)) {
            return res.status(401).end();
        }

        await orderManager.edit(orderId, { status }, { session });

        if (status === 'Canceled') {
            const dbProducts = await Promise.all(order.products.map(p => productManager.getProductById(p.productId, null, { session })));
            await Promise.all(dbProducts.map(p => {
                if (p) {
                    p.quantity += order.products.find(e => e.productId == p._id.toString()).count;
                    return p.save({ session });
                }
            }));
        }

        await session.commitTransaction();
        res.status(204).end();
    } catch (error) {
        await session.abortTransaction();
        next(error);
        console.log(error);
    }
    session.endSession();

}

router.post('/', privateGuard, createOrder);
router.get('/', privateGuard, getAllOrders);
router.put('/:orderId', privateGuard, editOrder);

module.exports = router;