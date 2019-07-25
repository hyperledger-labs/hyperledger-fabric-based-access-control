const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const DBAccess = require('../server/mongodb/accesses/mongo-access');
const dbConfig = require('../config/db');

// This is a configuration file.

module.exports = exports = function passportUser (passport){
        let opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = dbConfig.DB_SECRET;
        passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
            DBAccess.users.getUserById(jwt_payload._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                else return done(null, false);
            });
        }));
};