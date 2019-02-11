const express = require('express');
const router = express.Router();
const userQuery = require('../models/userModel');
const passport = require('../tools/passport');

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    userQuery.findOne({id: req.params.id}).then(user => {
        if (!user) {
            res.status(403).json({msg: "No user"});
        } else {
            let data = {
                username: user.username,
                lastname: user.lastname,
                firstname: user.firstname,
                language: user.language,
                profile: user.profile
            }
            res.json({user: data});
        }
    });
});

module.exports = router;