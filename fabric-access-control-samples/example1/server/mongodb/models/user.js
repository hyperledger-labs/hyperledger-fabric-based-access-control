const mongoose = require('mongoose');

// User Schema - Abstract

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);
