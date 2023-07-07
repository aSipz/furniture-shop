const jwtCallback = require('jsonwebtoken');
const util = require('util');

const config = require('../config');

const jwt = {
    sign: util.promisify(jwtCallback.sign),
    decode: util.promisify(jwtCallback.decode),
    verify: util.promisify(jwtCallback.verify),
};

const secretKey = config.SECRET;
const options = { expiresIn: '1d' };

exports.encodeToken = (payload) => {
    return jwt.sign(payload, secretKey, options);
};

exports.decodeToken = (token) => {
    return jwt.decode(token, secretKey)
};

exports.verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};