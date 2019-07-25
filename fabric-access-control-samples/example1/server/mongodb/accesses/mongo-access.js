function MongoAccess() {
    this.users = require('./access-user');
    this.utils = require('./utils-accesses');
}

let mongo_access = module.exports = exports = new MongoAccess;
