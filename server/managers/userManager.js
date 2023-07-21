const bcrypt = require('bcrypt');

const User = require('../models/User');
const { jwt, removePassword, toJSON } = require('../utils');

exports.getUserByEmail = (email) => User.findOne({ email });

exports.getUserById = (userId) => User.findById(userId);

exports.checkIfExist = (email, username) => User.findOne({ $or: [{ email }, { username }] });

exports.register = async (email, username, firstName, lastName, password) => {

    const newUser = await User.create({ email, username, firstName, lastName, password });

    const token = await jwt.encodeToken({ id: newUser._id });

    const user = removePassword(toJSON(newUser));

    return {
        token,
        user
    };
};

exports.login = async (email, password) => {
    let user = await this.getUserByEmail(email);

    if (!user) {
        const error = new Error('Wrong email or password!');
        error.statusCode = 401;
        throw error;
    }

    const isCorrectPassword = await user.matchPassword(password);

    if (!isCorrectPassword) {
        const error = new Error('Wrong email or password!');
        error.statusCode = 401;
        throw error;
    }

    const token = await jwt.encodeToken({ id: user._id });

    user = removePassword(toJSON(user));

    return {
        token,
        user
    };
};

exports.update = async (userId, email, username, firstName, lastName, password, oldPassword) => {

    if (!password) {
        return User.findByIdAndUpdate(userId, { email, username, firstName, lastName }, { new: true });
    }

    const user = await this.getUserById(userId);

    const isCorrectPassword = await user.matchPassword(oldPassword);

    if (!isCorrectPassword) {
        const error = new Error('Wrong password!');
        error.statusCode = 409;
        throw error;
    }

    const hash = await bcrypt.hash(password, 4)

    return User.findByIdAndUpdate(userId, { email, username, firstName, lastName, password: hash }, { new: true });
}

exports.delete = (userId) => User.findByIdAndDelete(userId);