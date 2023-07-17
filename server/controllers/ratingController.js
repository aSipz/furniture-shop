const router = require('express').Router();

const productManager = require('../managers/productManager');
const ratingManager = require('../managers/ratingManager');
const { privateGuard } = require('../middlewares/authMiddleware');
const { removeVer, toJSON } = require('../utils');

const rateProduct = async (req, res, next) => {
    const ownerId = req.user._id;
    const { rating, productId } = req.body;

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

router.post('/', privateGuard, rateProduct);

module.exports = router;