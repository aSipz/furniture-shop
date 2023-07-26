const router = require('express').Router();

const orderManager = require('../managers/orderManager');
const { privateGuard } = require('../middlewares/authMiddleware');
const { removeVer, toJSON } = require('../utils');

const createOrder = async (req, res, next) => {

    const ownerId = req.user._id;
    const { firstName, lastName, email, phone, address, notes, products, amount } = req.body;

    try {
        await orderManager.create({ firstName, lastName, email, phone, address, notes, products, ownerId, amount });
        res.status(201)
            .end();
    } catch (error) {
        next(error);
        console.log(error);
    }
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

    try {
        const order = await orderManager.getById(orderId);
        if (order.ownerId.toString() !== userId && role != 'admin') {
            return res.status(401).end();
        }

        if (status === 'Canceled' && role != 'admin' && !['Received', 'Processing'].includes(order.status)) {
            return res.status(401).end();
        }

        await orderManager.edit(orderId, { status });
        res.status(204).end();
    } catch (error) {
        next(error);
        console.log(error);
    }

}

router.post('/', privateGuard, createOrder);
router.get('/', privateGuard, getAllOrders);
router.put('/:orderId', privateGuard, editOrder);

module.exports = router;