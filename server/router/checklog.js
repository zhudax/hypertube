const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userQuery = require('../models/userModel');
const passport = require('../tools/passport');

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    let id = jwt.decode(req.cookies.token).id;
    userQuery.findOne({id: id}).then(user => {
        let oauth = 0;
        if (user.id42 || user.githubid || user.googleid)
            oauth = 1;
        let data = {
            id: user.id,
            username: user.username,
            email: user.email,
            lastname: user.lastname,
            firstname: user.firstname,
            language: user.language,
            profile: user.profile,
            isVerified: user.isVerified,
            oauth: oauth
        }
        res.json({user: data});
    });
});

module.exports = router;