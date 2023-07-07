const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, '{PATH} is required'],
        match: [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/, '{PATH} should be valid!'],
    },
    username: {
        type: String,
        required: [true, '{PATH} is required'],
        match: [/^[A-Za-z0-9]{4,}$/, '{PATH} should be at least 4 characters and contain only latin letters and digits!'],
    },
    firstName: {
        type: String,
        required: [true, '{PATH} is required'],
        match: [/^[A-Z]+[a-z]{1,}$/, '{PATH} should contain only latin letters and starts with capital letter!'],
    },
    lastName: {
        type: String,
        required: [true, '{PATH} is required'],
        match: [/^[A-Z]+[a-z]{1,}$/, '{PATH} should contain only latin letters and starts with capital letter!'],
    },
    password: {
        type: String,
        required: [true, '{PATH} is required'],
        minLength: [4, '{PATH} should be at least 4 characters long!']
    },

},
    { timestamps: true });

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 4)
        .then(hash => {
            this.password = hash;
            next();
        });
});

const User = model('User', userSchema);

module.exports = User;