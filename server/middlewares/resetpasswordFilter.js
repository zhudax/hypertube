'use strict'

const bcrypt = require('bcryptjs');
const {isValidEmail, isValidPassword, purifyString} = require('../tools/utils');
let db = require('../db/db').connection_db;
let sql = require('../db/requetes');

const RPFilterEmail = (req, res, next) => {
    if (!isValidEmail(req.body.email)) {
        res.status(403).json("Not a valid email, example: stream@hypertube.com")
    } else {
        req.body.email = purifyString(req.body.email)
        db.query(sql.get_user, [null, null, req.body.email], (err,user) => {
            if (err) {
                res.status(403).json({error: err.code + ': ' + err.sqlMessage})
            } else {
                if (user.length && user[0].username && user[0].email) {
                    if (user[0].id42 || user[0].googleid || user[0].githubid) {
                        res.status(403).json("User connect with Omniauth can't reset pass")
                    } else {
                        req.body.username = user[0].username
                        req.body.email = user[0].email
                        next()
                    }
                } else {
                    res.status(403).json("Email unavailable")
                }
            }
        });
    }
};

const RPFilterPass = async (req, res, next) => {
    if (req.body.npassword === req.body.cpassword) {
        if (isValidPassword(req.body.npassword)) {
            let username = decodeURIComponent(req.params.username) 
            req.body.npassword = await bcrypt.hash(req.body.npassword, 10)
            db.query(sql.get_user, [null,username,null], (err,user) => {
                if (err) {
                    res.status(403).json({error: err.code + ': ' + err.sqlMessage})
                } else {
                    if (user[0].token === req.params.token && req.body.npassword) {
                        req.body.username = user[0].username
                        delete req.body.cpassword
                        next()
                    } else {
                        res.status(403).json("Invalid Token")
                    }
                }
            });
        } else {
            res.status(403).json({npassword: "Password must contains at least 6 characters, one uppercase and lowercase letter and one digit, only letters and digits are allowed"})
        }
    } else {
        res.status(403).json({npassword: "New password does not match with password confirmation"})
    }
};

module.exports =  {
    RPFilterEmail,
    RPFilterPass
}