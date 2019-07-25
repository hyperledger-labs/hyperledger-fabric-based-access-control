const express = require('express');
const router = express.Router();
const ba_logger = require('../log/ba_logger');
const passport = require('passport');
const UtilsRoutes = require('./utils-routes');

//Protected route with passport: when there is a request, the payload of the user is verified (UtilsRoutes.isFromAdministration)
router.get('/exampleProtectedRoute', passport.authenticate('jwt', {session: false}), (req, res, next) =>{
    //Checking if the user type is administrator. Rules have to be hardcoded
    if(!UtilsRoutes.isFromAdministration(req))    {
        UtilsRoutes.replyFailure(res,"","Não permitido");
        return;
    }

    let email = req.user.email;
    //the PEP can check the user's e-mail and other attributes. Once again, information has to be hardcoded.
    if (email.endsWith('@tecnico.ulisboa.pt'))  {
        //do something
    }

    //returning response to the user
    try {
        UtilsRoutes.replySuccess(res,"Some data","A message");
        ba_logger.ba("exampleRoute");
    } catch (e) {
        ba_logger.ba("Error at exampleRoute");
        UtilsRoutes.replyFailure(res,e,"Internal error");
        throw new Error(e);
    }
});


router.get('/exampleProtectedRoute2', passport.authenticate('jwt', {session: false}), async (req, res) => {
    if(!UtilsRoutes.requireRole("NetworkAdmin"))    {
        UtilsRoutes.replyFailure(res,"","Not allowed");
        return;
    }
    try {
        UtilsRoutes.replySuccess(res,"Some data","A message");
        ba_logger.ba("Logging" + req.user.email);
    } catch (e) {
        ba_logger.ba("Error at /exampleRoute" + req.user.email);
        UtilsRoutes.replyFailure(res,e,"Error at latestId");
        throw new Error(e);
    }
});

//Unprotected route. Anyone can access the route (authenticated or not)
router.get('/exampleRoute', async (req, res) => {
    try {
        UtilsRoutes.replySuccess(res,"Some data","A message");
        ba_logger.ba("exampleRoute");
    } catch (e) {
        ba_logger.ba("Error at exampleRoute");
        UtilsRoutes.replyFailure(res,e,"Internal error");
        throw new Error(e);
    }
});

router.get('/requireAccessToResource/:resourceKey', passport.authenticate('jwt', {session: false}), async (req, res) => {
    //get the resource key from the frontend
    const resourceKey = req.params.resourceKey;

    //since the user is authenticated using jwt, we can get the subject key
    const subjectKey = req.user.id;

    //we need to map the subjects to policies and rules

    try {
        //call blockchain with resourceKey, subjectKey and relevant rules.
        UtilsRoutes.replySuccess(res,"Some data","A message");
        ba_logger.ba("exampleRoute");
    } catch (e) {
        ba_logger.ba("Error at exampleRoute");
        UtilsRoutes.replyFailure(res,e,"Internal error");
        throw new Error(e);
    }
});

module.exports = router;
