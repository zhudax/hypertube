'use strict'

const express = require('express');
const router = express.Router();
const {sendMailTo} = require('../tools/sendMailTo');

let db = require('../db/db').connection_db;
let sql = require('../db/requetes');
let {RPFilterEmail, RPFilterPass} = require('../middlewares/resetpasswordFilter')

/**
 * When user type his email to send a resetting password email
 * @email
 */
router.post('/', RPFilterEmail, (req,res) => {
    sendMailTo(req.body.username, req.body.email, 3).then(success => {
        res.json(success)
    }).catch(err => {
        res.status(403).json({sendMail: err})
    })
});

/**
 * When user click on link to reset his password
 */
router.get('/:username/:token', (req,res) => {
    let username = decodeURIComponent(req.params.username)
    db.query(sql.get_user, [null, username, null], (err,user) => {
        if (err) {
            res.status(403).json({error: err.code + ': ' + err.sqlMessage})
        }
        if (user.length && user[0].token === req.params.token) {
            res.json("We can help you "+ username +" to reset your password !")
        } else {
            res.status(403).json("Invalid token")
        }
    });
});


/**
 * When user type his new password
 * @param npassword
 * @param cpassword
 */
router.post('/:username/:token', RPFilterPass, (req,res) => {
    db.query("UPDATE users SET ? WHERE ?", [{password: req.body.npassword, token: null}, {username: req.body.username}], (err, success) => {
        if (err) {
            res.status(403).json("ERR_QUERY_MDLW")
        } else {
            db.query(sql.update_reset_pass_time, [req.body.username], (err1, rows) => {})
            res.json("Password changed :) !")
        }
    })
});

module.exports = router;