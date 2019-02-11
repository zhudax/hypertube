'use strict'

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userQuery = require('../models/userModel');
const passport = require('../tools/passport');
const settingsFilter = require('../middlewares/settingsFilter');
const fs = require('fs');
let db = require('../db/db').connection_db;
let sql = require('../db/requetes');
let {sendMailTo} = require('../tools/sendMailTo');

router.get('/settings', passport.authenticate('jwt', {session: false}), (req, res) => {
    let id = jwt.decode(req.cookies.token).id;

    userQuery.findOne({id: id}).then(user => {
        if (!user) {
            res.status(403).json({msg: "No user"});
        } else {
            let data = {
                id: user.id,
                username: user.username,
                email: user.email,
                lastname: user.lastname,
                firstname: user.firstname,
                language: user.language,
                profile: user.profile,
                isVerified: user.isVerified
            }
            res.json({user: data});
        }
    });
});

router.post('/settings', passport.authenticate('jwt', {session: false}), settingsFilter, (req, res) => {
    let id = jwt.decode(req.cookies.token).id;

    userQuery.findOne({id: id}).then(user => {
        if (req.body.photo_change) {
            const dir = __dirname + '/../public/'
            const userStorage =  id + '/'
            let filename = userStorage + 'profile' + Math.floor(Math.random() * 1001) + '.png'
            let file = "http://localhost:" + process.env.PORT_BACK + "/api/photo/" + filename
            while (1) {
                if (file == user.profile) {
                    filename = userStorage + 'profile' + Math.floor(Math.random() * 1001) + '.png'
                    file = "http://localhost:" + process.env.PORT_BACK + "/api/photo/" + filename
                } else {
                    break ;
                }
            }
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            if (!fs.existsSync(dir + userStorage)) {
                fs.mkdirSync(dir + userStorage)
            }
            fs.writeFileSync(dir + filename, req.body.photo, {encoding: 'base64'});
            let temp = user.profile.split('/');
            if (fs.existsSync(dir + userStorage + temp[temp.length - 1])) {
                fs.unlinkSync(dir + userStorage + temp[temp.length - 1]);
            }
            req.body.photo = file;
        }

        let requete = sql.update_oauth_settings;
        let data = [
            req.body.lastname,
            req.body.firstname,
            req.body.username,
            req.body.language,
            req.body.photo
        ];
        let oauth = 0;
        if (user.id42 || user.githubid || user.googleid)
            oauth = 1;
        if (!oauth) {
            requete = sql.update_user_settings;
            data.push(req.body.npassword);
            data.push(req.body.email);
        }
        data.push(id);
        db.query(requete, data, (err, rows) => {
            if (err) {
                res.status(403).json({msg: "Error update settings"});
            } else {
                let info = {
                    id: user.id,
                    profile: req.body.photo,
                    username: req.body.username,
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    language: req.body.language,
                    isVerified: user.isVerified,
                    oauth: oauth
                }
                res.json({msg: "Update settings", user: info});
            }
        });
    });
});

module.exports = router;