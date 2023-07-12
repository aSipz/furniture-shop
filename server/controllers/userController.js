const router = require('express').Router();

const userManager = require('../managers/userManager');
const tokenManager = require('../managers/tokenManager');
const { normalizeObjectValues, removePassword } = require('../utils');
const { privateGuard, guestGuard } = require('../middlewares/authMiddleware');


const register = async (req, res, next) => {
    const { username, email, password, firstName, lastName } = normalizeObjectValues(req.body);


    try {
        const sameUserExists = await userManager.checkIfExist(email, username);

        if (sameUserExists) {
            const error = new Error('Username or email is already taken!');
            error.statusCode = 409;
            throw error;
        }

        const { token, user } = await userManager.register(email, username, firstName, lastName, password);

        res.cookie('auth', token, { httpOnly: true });

        res.status(200)
            .send(user);

    } catch (error) {
        console.log(error);
        next(error);
    }

};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {

        const { token, user } = await userManager.login(email, password);

        res.cookie('auth', token, { httpOnly: true });

        res.status(200)
            .send(user);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const logout = async (req, res, next) => {

    const token = req.cookies['auth'];

    try {
        await tokenManager.createToken(token);

        res.clearCookie('auth')
            .status(204)
            .send({ message: 'Logged out!' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getProfile = async (req, res, next) => {

    console.log(req.user);

    res.status(200)
        .send(removePassword(req.user));

};

router.post('/register', guestGuard, register);
router.post('/login', guestGuard, login);
router.post('/logout', privateGuard, logout);
router.get('/profile', privateGuard, getProfile);

module.exports = router;