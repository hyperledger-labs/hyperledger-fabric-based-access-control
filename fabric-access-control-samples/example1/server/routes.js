const path = require('path');
const resourceRoutes = require('./routes/resource-routes');

module.exports = (app) => {

    app.use('/resource', resourceRoutes);

    /***********************************************************************************************
     * MAIN
     */
    const staticRoot = path.resolve(__dirname, '../public');
    app.get('/*', function(req, res) {
        res.sendFile('index.html', { root: staticRoot });   // load the single view file (angular will handle the page changes on the front-end)
    });

};
