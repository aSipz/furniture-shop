const router = require('express').Router();

const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const ratingController = require('../controllers/ratingController');
const favoritesController = require('../controllers/favoritesController');

router.use('/users', userController);
router.use('/products', productController);
router.use('/rate', ratingController);
router.use('/favorites', favoritesController);

module.exports = router;