const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: { type: String, index: 1 },
    contact: { type: String, index: 1 },
    dob: Date,
    password: { type: String }
}, {
    timestamps: true
})

userSchema.methods.validatePassword = function (password) {
    return this.password === crypto.createHmac('sha256', process.env.PASSWORD_HASH_STRING).update(password).digest('hex');
};

module.exports = mongoose.model('User', userSchema);