require('dotenv').load();
const DB_PROD = process.env.DB_PRODUCTION;
let DB_DEV = process.env.DB_DEVELOPMENT;
const secret = process.env.DB_SECRET;

module.exports = {
    DB_SECRET : secret,
    DB_PRODUCTION : DB_PROD,
    urls : {
        production : DB_PROD,
        development : DB_DEV || DB_PROD
    }

};
