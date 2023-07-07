const router = require('express').Router();

const userManager = require('../managers/userManager');
const { normalizeObjectValues } = require('../utils');


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

        const result = await userManager.login(email, password);

        res.json(result);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const logout = (req, res) => {
    res.json({ ok: true });
};

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;