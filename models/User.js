const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    password: {
        type: String,
        trim: true,
        required: true,
    },

    roles: [{type: String, ref: 'Role'}]
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

module.exports = User;
