'use strict'
function Utils() {

    // Quick Replies
    this.replySuccess = replySuccess;
    this.replyFailure = replyFailure;
    this.requireRole = requireRole;
    this.isFromAdministration = isFromAdministration;
    this.roleIs = roleIs;
    this.routeIsBlocked = false;
}

let utils = module.exports = exports = new Utils;

/*****************************
 Quick Replies
 *****************************/
function replyFailure(res, err, message) {
    let response = {};
    response.response_data = null;
    response.succeeded = false;
    response.message = message;
    response.error = err;
    res.send(response);
}

function replySuccess(res, data, message) {
    let response = {};
    response.response_data = data;
    response.succeeded = true;
    response.message = message;
    res.send(response);
}

function requireRole(req, res, role) {
    if (req.user.__t !== role) {
        replyFailure(res, 'Not a ' + role, '');
    }
}

// roleIs is meant to be called before the DB queries.
// It provides an extra layer of security and resources saving
function roleIs(req, role) {
    for (var userRole of req.user.roles){
        if(userRole === role){
            return (true)
        }
    }
    return (false);
}

//Disadvantage: hardcoded policies
function isFromAdministration(req) {
    return req.user.type === 'administrator';
}
