const jwt = require('../utils/jwt');

exports.authentication = async (req, res, next) => {
    const token = req.cookies['auth'];

    if (token) {
        try {
            const decodedToken = await jwt.verifyToken(token);
            req.user = decodedToken;
        } catch (error) {
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