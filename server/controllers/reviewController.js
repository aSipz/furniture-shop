const router = require('express').Router();

const productManager = require('../managers/productManager');
const reviewManager = require('../managers/reviewManager');
const { privateGuard } = require('../middlewares/authMiddleware');
const { removeVer, toJSON } = require('../utils');

const createReview = async (req, res, next) => {
    const ownerId = req.user._id;
    const { text, productId } = req.body;

    try {
        const review = await reviewManager.create(text, ownerId, productId);
        await productManager.addReview(productId, review._id);
        res.status(200).send(removeVer(toJSON(review)));
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const editReview = async (req, res, next) => {
    const ownerId = req.user._id;
    const { reviewId } = req.params;
    const { text } = req.body;
    try {
        const existingReview = await reviewManager.getById(reviewId);
        if (!existingReview) {
            const error = new Error('There is no such review');
            error.statusCode = 404;
            throw error;
        }
        if (existingReview.ownerId !== ownerId) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        const editedReview = await reviewManager.update(reviewId, text);
        res.status(200).send(removeVer(toJSON(editedReview)));
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const deleteReview = async (req, res, next) => {
    const ownerId = req.user._id;
    const { reviewId } = req.params;

    try {
        const existingReview = await reviewManager.getById(reviewId);
        if (!existingReview) {
            const error = new Error('There is no such review');
            error.statusCode = 404;
            throw error;
        }
        if (existingReview.ownerId !== ownerId) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        await Promise.all([
            reviewManager.deleteById(reviewId),
            productManager.removeReview(existingReview.productId, reviewId)
        ]);
        res.status(204).end();
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const getReviews = async (req, res, next) => {
    const search = req.query.search;
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const include = req.query.include;

    try {
        const [result, count] = await reviewManager.getAll(search, limit, skip, sort, include);
        res.status(200)
            .send({ result, count });
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const like = async (req, res, next) => {
    const userId = req.user._id;
    const { reviewId } = req.params;

    try {
        const existingReview = await reviewManager.getById(reviewId);
        if (!existingReview) {
            const error = new Error('There is no such review');
            error.statusCode = 404;
            throw error;
        }
        if (existingReview.ownerId === userId || existingReview.likes.map(id => id.toString()).includes(userId)) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        await reviewManager.like(reviewId, userId);
        res.status(204).end();
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const dislike = async (req, res, next) => {
    const userId = req.user._id;
    const { reviewId } = req.params;

    try {
        const existingReview = await reviewManager.getById(reviewId);
        if (!existingReview) {
            const error = new Error('There is no such review');
            error.statusCode = 404;
            throw error;
        }
        if (existingReview.ownerId === userId || !existingReview.likes.map(id => id.toString()).includes(userId)) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        await reviewManager.dislike(reviewId, userId);
        res.status(204).end();
    } catch (error) {
        next(error);
        console.log(error);
    }
}

router.get('/', getReviews);
router.post('/', privateGuard, createReview);
router.put('/:reviewId', privateGuard, editReview);
router.delete('/:reviewId', privateGuard, deleteReview);
router.post('/:reviewId/like', privateGuard, like);
router.put('/:reviewId/like', privateGuard, dislike);

module.exports = router;