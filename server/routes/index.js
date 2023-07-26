const router = require('express').Router();

const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const ratingController = require('../controllers/ratingController');
const favoritesController = require('../controllers/favoritesController');
const reviewController = require('../controllers/reviewController');
const orderController = require('../controllers/orderController');

router.use('/users', userController);
router.use('/products', productController);
router.use('/rate', ratingController);
router.use('/favorites', favoritesController);
router.use('/reviews', reviewController);
router.use('/orders', orderController);

module.exports = router;