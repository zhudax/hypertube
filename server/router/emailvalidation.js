'use strict'

const express = require('express');
const router = express.Router();
let db = require('../db/db').connection_db
let sql = require('../db/requetes')
let {sendMailTo} = require('../tools/sendMailTo')

router.get('/:username/:token', (req, res) => {
    let username = decodeURIComponent(req.params.username)
    db.query(sql.get_user, [null, username, null], (err, user) => {
        if (err) {
            res.status(403).json({error: err.code + ': ' + err.sqlMessage})
        }
        if (user.length && user[0].token === req.params.token) {
            db.query("UPDATE users SET ? WHERE username=?", [{token: null, isVerified: 1}, username], (err, success) => {
                if (err) {
                    res.status(403).json("ERR_VALIDATION_TOKEN")
                } else {
                    res.json("Congrats "+ username + " ! your account is validated")
                }
            })
        } else {
            res.status(403).json("Invalid token")
        }
    })
});

router.post('/', (req, res) => {
    let email = req.body.email;
    db.query(sql.get_user, [null, null, email], (err, user) => {
        if (err) {
            res.status(403).json({error: err.code + ': ' + err.sqlMessage})
        }
        if (!user || !user.length) {
            res.status(403).json({error: "Email not found"})
        } else {
            sendMailTo(user[0].username, email, 2).then(success => {
                res.json(success)
            }).catch(err => {
                res.status(403).json({sendMail: err})
            })
        }
    })
});

module.exports = router