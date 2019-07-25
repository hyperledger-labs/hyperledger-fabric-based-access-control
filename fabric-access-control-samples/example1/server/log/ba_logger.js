const winston = require('winston');
const path = require('path');
const fs = require('fs');
require('winston-daily-rotate-file');

const logName = 'ba_access.log';
const logDirectory = path.join(__dirname,'business_analytics');
const logFile = path.join(logDirectory, logName);

//If the app is in production (not in development), the level specified is 'info'

//Makes sure that log folder exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const myCustomLevels = {
    levels: {
        important: 0,
        ba: 1,
        admin: 2
    },
    colors: {
        blockchain: 'bgGreen',
        admin: 'green',
        other: 'blue'
    }
};

winston.addColors(myCustomLevels.colors);

winston.emitErrs = true;
let logger = new winston.Logger({
    levels: myCustomLevels.levels,
    transports: [
        new winston.transports.DailyRotateFile({
            level: "admin",
            timestamp: true,
            prettyPrint: false,
            filename: logFile,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            zippedArchive: true,
            prepend: true
        }),
        new winston.transports.Console({
            level: 'admin',
            silent: false,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message) {
        logger.info(message);
    }
};
