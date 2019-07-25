require('dotenv').load();
// Modules =================================================
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require('morgan');
const logger = require('./server/log/logger');
const fs = require('fs');
const  helmet = require('helmet');
const Utils = require('./server/mongodb/accesses/utils-accesses');
const schedule = require('node-schedule');
const ba_logger = require('./server/log/ba_logger');

//MAIN Env. variables, needed to the project to run
const node_env = process.env.NODE_ENV;
const DB_SECRET = process.env.DB_SECRET;
const DB_PRODUCTION = process.env.DB_PRODUCTION;
const DB_BACKUP = process.env.DB_BACKUP;
const DB_BACKUP_PRODUCTION_URI = process.env.DB_BACKUP_PRODUCTION_URI;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Configuration ===========================================
let dbConfig = require('./config/db');
let appConfig = require('./config/app');
let port = process.env.PORT || appConfig.ports[node_env];

// Connect to mongoDB database ===========================================
/*
mongoose.connect(dbConfig.urls[node_env], { useNewUrlParser: true, keepAlive: 1, connectTimeoutMS: 30000,
    keepAlive: 1, connectTimeoutMS: 30000 });

mongoose.connection.on("connected", () => {
    logger.info("Connected to MongoDB on " + dbConfig.urls[node_env]);
});
mongoose.connection.on("error", (dbError) => {
    logger.error("Could not connect to database on: " + dbConfig.urls[node_env]);
    throw new Error(dbError);
});
mongoose.set('useCreateIndex', true);
*/

//Initialize app
const app = express();

//Summarized version, output goes to console
app.use(morgan('dev'));

//Full log to file
app.use((morgan)("common", {stream: logger.stream}));

// Security ===========================================
//Defaults:
helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
    }
});

app.use(helmet({
}));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Passport Middleware
/*
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
*/
// Routes
require('./server/routes')(app, __dirname);

process.on('uncaughtException', (err) => {
    switch(err.errno)   {
        case "EADDRINUSE":
            logger.error("Address in use. Port: being used:" + port);
            break;
        default:
            fs.writeSync(1, `Caught exception: ${err}\n`);
            logger.error("Process terminating: \n");
            logger.error(err);
    }
    process.exit();
});

//We use Heroku, so we delegate SSL implementation to Heroku's load balancer.

app.listen(port, () => {
        logger.info("Server running on port: " + port);
        logger.warn("Server running since: " + Utils.time);
});

