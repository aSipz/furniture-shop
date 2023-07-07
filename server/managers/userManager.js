const bcrypt = require('bcrypt');

const User = require('../models/User');
const { jwt, removePassword } = require('../utils');

exports.getUserByEmail = (email) => User.findOne({ email });

exports.checkIfExist = (email, username) => User.findOne({ $or: [{ email }, { username }] });

exports.register = async (email, username, firstName, lastName, password) => {

    const newUser = await User.create({ email, username, firstName, lastName, password });

    const token = await jwt.encodeToken({ id: newUser._id });

    const user = removePassword(newUser);

    return {
        token,
        user
    };
};

exports.login = async (email, password) => {
    const user = await this.getUserByEmail(email);

    if (!user) {
        const error = new Error('No such user or wrong password!');
        error.statusCode = 400;
        throw error;
    }

    const hash = user.password;

    const isCorrectPassword = await bcrypt.compare(password, hash);

    if (!isCorrectPassword) {
        const error = new Error('No such user or wrong password!');
        error.statusCode = 400;
        throw error;
    }

    const token = await jwt.encodeToken({ email, _id: user._id });

    return {
        accessToken: token,
        _id: user._id.toString(),
        email
    };
}