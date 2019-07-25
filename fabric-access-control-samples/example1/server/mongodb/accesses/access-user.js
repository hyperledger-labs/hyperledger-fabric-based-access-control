const User = require('../models/user');
const Utils = require('./utils-accesses');

// Abstract

let TYPE = 'User';

class AccessUser {
    constructor() {
        this.getUserById = getUserById;
        this.getUserByUsername = getUserByUsername;
        this.getUserByEmail = getUserByEmail;
        this.getUsers = getUsers;
    }
}

let access_user = module.exports = exports = new AccessUser();


/********************************
 *  C.R.U.D. FUNCTIONS
 *******************************/

function getUserById(id, callback) {
    User.findById(id)
        .exec(function (err, item) {
            Utils.findByIDCallback(err, item, callback, TYPE);
        });
}

function getUserByUsername(username, callback) {
    const query = {username: username};
    User.findOne(query, callback);
}

function getUserByEmail(email, callback) {
    const query = {email: email};
    User.findOne(query, callback);
}

async function getUsers() {
    return await User.find().exec();
}