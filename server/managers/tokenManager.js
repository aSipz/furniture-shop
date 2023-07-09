const TokenBlacklist = require('../models/TokenBlacklist');

exports.createToken = (token) => TokenBlacklist.create({ token });

exports.checkIfExists = (token) => TokenBlacklist.findOne({ token });