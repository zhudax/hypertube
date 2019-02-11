'use strict'

const bcrypt = require('bcryptjs');
const db = require('../db/db').connection_db;
const sql = require('../db/requetes');

const multer = require('multer');
const fields = [
    {name: 'username', maxCount:1},
    {name: 'email', maxCount:1},
    {name: 'firstname', maxCount:1},
    {name: 'lastname', maxCount:1},
    {name: 'password', maxCount:1},
    {name: 'cpassword', maxCount:1},
    {name: 'photo', maxCount:1},
];
const upload = multer({limits: { fieldSize: 2 * 1024 * 1024}}).array(fields);
const {purifyString, isValidString, isValidEmail, isValidPassword, isValidPhoto} = require('../tools/utils');

const signupFilter = (req, res, next) => {
    
    upload(req, res, (err) => {
        req.body.error = {} 

        if (err) {
            req.body.error[err.field] = err.field === "photo" ? "Photo too large, 2MB max !" : err.message
            return res.status(403).json(req.body.error)
        }
        
        db.query(sql.get_user, [null, req.body.username, null], (_err, usernameExist) => {
            db.query(sql.get_user, [null, null, req.body.email], async (err_, emailExist) => {
                if (_err || err_) {
                    res.status(403).json("ERR_MIDDLW_SIGNUP")
                } else {
                    if (!isValidPhoto(req.body.photo)) {
                        req.body.error.photo = "Image must be jpg/jpeg/png format"
                    } else {
                        let content = req.body.photo.split(/^data:image\/(?:jpeg|jpg|png)(?:;charset=utf-8)?;base64,/)
                        if (!content) {
                            req.body.error.photo = "Image invalid"
                        } else {
                            req.body.photo = content[1]
                        }
                    }

                    if (!isValidString(req.body.lastname)) {
                        req.body.error.lastname = "Lastname must contains only letters, 2-20 characters"
                    } else {
                        req.body.lastname = purifyString(req.body.lastname)
                    }

                    if (!isValidString(req.body.firstname)) {
                        req.body.error.firstname = "Firstname must contains only letters, 2-20 characters"
                    } else {
                        req.body.firstname = purifyString(req.body.firstname)
                    }

                    if (usernameExist[0] && usernameExist[0].username) {
                        req.body.error.username = "Username unavailable"
                    } else {
                        if (!isValidString(req.body.username, true)) {
                            req.body.error.username = "Username can contains letters, digits, dot, dash and underscore, 2-30 characters"
                        } else {
                            req.body.username = purifyString(req.body.username)
                        }
                    }

                    if (req.body.password === req.body.cpassword) {
                        if (!isValidPassword(req.body.password)) {
                            req.body.error.password = "Password must contains at least 6 characters, one uppercase and lowercase letter and one digit, only letters and digits are allowed"
                        } else {
                            req.body.password = purifyString(req.body.password, false)
                            req.body.password = await bcrypt.hash(req.body.password, 10)
                            delete req.body.cpassword
                        }
                    } else {
                        req.body.error.password = "Password does not match with password confirmation"
                    }

                    if (emailExist[0] && emailExist[0].email) {
                        req.body.error.email = "Email unavailable"    
                    } else {
                        if (!isValidEmail(req.body.email)) {
                            req.body.error.email = "Not a valid email, example: stream@hypertube.com"
                        } else {
                            req.body.email = purifyString(req.body.email)
                        }
                    }

                    if (Object.values(req.body.error).length) {
                        res.status(403).json(req.body.error)
                    } else {
                        delete req.body.error
                        next()
                    }
                }
            });    
        });
    });
    
};

module.exports = signupFilter;