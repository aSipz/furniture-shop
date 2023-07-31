const router = require('express').Router();

const userManager = require('../managers/userManager');
const tokenManager = require('../managers/tokenManager');
const { normalizeObjectValues, removePassword, toJSON } = require('../utils');
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

        res.cookie('auth', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 172800000 });

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

        res.cookie('auth', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 172800000 });

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

        res.clearCookie('auth', { httpOnly: true, sameSite: 'none', secure: true })
            .status(204)
            .send({ message: 'Logged out!' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const deleteUser = async (req, res, next) => {

    const token = req.cookies['auth'];
    const userId = req.user._id.toString();

    try {

        await Promise.all([
            tokenManager.createToken(token),
            userManager.delete(userId)
        ]);

        res.clearCookie('auth')
            .status(204)
            .send({ message: 'User removed!' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getProfile = async (req, res, next) => {

    res.status(200)
        .send(removePassword(req.user));

};

const updateProfile = async (req, res, next) => {
    const { email, username, firstName, lastName, oldPassword, password } = req.body;

    const userId = req.user._id.toString();

    try {

        const sameUserExists = await userManager.checkIfExist(email, username);

        if (sameUserExists && sameUserExists._id.toString() != userId) {
            const error = new Error('Username or email is already taken!');
            error.statusCode = 409;
            throw error;
        }

        const updatedUser = await userManager.update(userId, email, username, firstName, lastName, password, oldPassword);

        res.status(200)
            .send(removePassword(toJSON(updatedUser)));

    } catch (error) {
        console.log(error);
        next(error);
    }
};

router.post('/register', guestGuard, register);
router.post('/login', guestGuard, login);
router.post('/logout', privateGuard, logout);
router.get('/profile', privateGuard, getProfile);
router.put('/profile', privateGuard, updateProfile);
router.delete('/delete', privateGuard, deleteUser);

module.exports = router;