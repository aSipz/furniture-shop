const mongoose = require('mongoose');

const config = require('../config');

exports.connectDB = async () => {
    await mongoose.connect(config.DB_URI);
}

exports.conn = mongoose.connection;