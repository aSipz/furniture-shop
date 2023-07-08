const jwt = require('../utils/jwt');
const tokenManager = require('../managers/tokenManager');
const userManager = require('../managers/userManager');

exports.authentication = async (req, res, next) => {
    const token = req.cookies['auth'];

    if (token) {
        try {
            const [data, blacklistedToken] = await Promise.all([jwt.verifyToken(token), tokenManager.checkIfExists(token)]);

            console.log(data);

            if (blacklistedToken) {
                throw new Error('blacklisted token');
            }

            const user = await userManager.getUserById(data.id);
            req.user = user;
        } catch (error) {
            if (error.message === 'blacklisted token') {
                console.log(error);
                res
                    .status(401)
                    .send({ message: "Invalid token!" });
                return;
            }

            return res.status(401).end();
        }

    }

    next();

};

exports.privateGuard = (req, res, next) => {

    if (!req.user) {
        return res.status(401).end();
    }

    next();
};

exports.guestGuard = (req, res, next) => {

    if (req.user) {
        return res.status(401).end();
    }

    next();
};