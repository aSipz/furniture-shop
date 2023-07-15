const router = require('express').Router();

const productManager = require('../managers/productManager');
const { privateGuard, adminGuard } = require('../middlewares/authMiddleware');
const { removeVer } = require('../utils');

const getAllProducts = async (req, res, next) => {
    const search = req.query.where;

    const limit = req.query.limit;
    const skip = req.query.skip;

    try {
        const [result, count] = await productManager.getAll(search, limit, skip);
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
            .send(removeVer(newProduct));
    } catch (error) {
        next(error);
        console.log(error);
    }

};

const getOneProduct = async (req, res, next) => {
    const { productId } = req.params;
    const { include } = req.query;
    try {
        const result = await productManager.getProductById(productId, { include });
        res.status(200)
            .send(result);
    } catch (error) {
        next(error);
        console.log(error);
    }
};

const editProduct = async (req, res, next) => {
    const { productId } = req.params;
    const { name, description, category, color, material, price, discount, quantity, images } = req.body;

    try {
        const sameProductExists = await productManager.getProductByName(name);

        if (sameProductExists) {
            const error = new Error('There is already a product with this name!');
            error.statusCode = 409;
            throw error;
        }

        const editedProduct = await productManager.edit(productId, { name, description, category, color, material, price, discount, quantity, images });
        res.status(200)
            .send(removeVer(editedProduct));
    } catch (error) {
        next(error);
        console.log(error);
    }

}

const deleteProduct = async (req, res, next) => {
    const { furnitureId } = req.params;
    const userId = req.user._id;
    try {
        await productManager.delete(furnitureId, userId);
        res.json('ok');
    } catch (error) {
        next(error);
        console.log(error);
    }
}

router.get('/', getAllProducts);
router.post('/', adminGuard, createProduct);
router.get('/:productId', getOneProduct);
router.put('/:productId', adminGuard, editProduct);
router.delete('/:productId', privateGuard, deleteProduct);

module.exports = router;