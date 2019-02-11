'use strict'

const express = require('express');
const router = express.Router();
const fs = require('fs');

let db = require('../db/db').connection_db
let sql = require('../db/requetes')
let signupFilter = require('../middlewares/signupFilter')
let {sendMailTo} = require('../tools/sendMailTo')

router.post('/', signupFilter, (req, res) => {
    let data = [
        req.body.lastname,
        req.body.firstname,
        req.body.username,
        req.body.password,
        req.body.email,
        "N/A"
    ]
    
    db.query(sql.insert_user, [data], (err, success) => {
        if (err) {
            return res.status(403).json({error: err.code + ': ' + err.sqlMessage})
        }
        const dir = __dirname + '/../public/'
        const userStorage =  success.insertId + '/'
        const filename = userStorage + 'profile' + Math.floor(Math.random() * 1001) + '.png'
        const file = "http://localhost:" + process.env.PORT_BACK + "/api/photo/" + filename
        db.query(sql.update_profile, [file, success.insertId], (err1, rows) => {
            if (err) {
                return res.status(403).json({error: err.code + ': ' + err.sqlMessage})
            }
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            if (!fs.existsSync(dir + userStorage)) {
                fs.mkdirSync(dir + userStorage)
            }
    
            fs.writeFileSync(dir + filename, req.body.photo, {encoding: 'base64'});
            
            sendMailTo(req.body.username, req.body.email, 1).then(success => {
                res.json(success)
            }).catch(err => {
                res.status(403).json({sendMail: err})
            })
        })
    });
});

module.exports = router;