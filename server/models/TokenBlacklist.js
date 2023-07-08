const { Schema, model } = require('mongoose');

const tokenBlacklistSchema = new Schema({
    token: String
}, { timestamps: true });

const TokenBlacklist = model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;