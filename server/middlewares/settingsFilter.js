'use strict'

const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userQuery = require('../models/userModel');
const db = require('../db/db').connection_db;
const sql = require('../db/requetes');
const {purifyString, isValidString, isValidEmail, isValidPassword, isValidPhoto, isValidLang} = require('../tools/utils');

const fields = [
    {name: 'email', maxCount:1},
    {name: 'username', maxCount:1},
    {name: 'firstname', maxCount:1},
    {name: 'lastname', maxCount:1},
    {name: 'language', maxCount: 1},
    {name: 'password', maxCount:1},
    {name: 'npassword', maxCount:1},
    {name: 'cpassword', maxCount:1},
    {name: 'photo', maxCount:1},
];
const upload = multer({limits: { fieldSize: 2 * 1024 * 1024}}).array(fields);
const settingsFilter = (req, res, next) => {

    upload(req, res, (err) => {
        req.body.error = {} 
        let id = jwt.decode(req.cookies.token).id;

        if (err) {
            req.body.error[err.field] = err.field === "photo" ? "Photo too large, 2MB max !" : err.message
            return res.status(403).json(req.body.error);
        }
        userQuery.findOne({id: id}).then(async user => {
            let oauth = user.id42 || user.googleid || user.githubid;
            
            if (!oauth) {
                let password = req.body.password;
                
                if (!bcrypt.compareSync(password, user.password)) {
                    req.body.error.password = "Password incorrect";
                    return res.status(403).json(req.body.error);
                }
            }

            db.query(sql.get_user, [null, req.body.username, null], (_err, usernameExist) => {
                db.query(sql.get_user, [null, null, req.body.email], async (err_, emailExist) => {
                    if (_err || err_) {
                        res.status(403).json("ERR_MIDDLW_SIGNUP")
                    } else {
                        
                        let photo = req.body.photo;
                        let lastname = req.body.lastname;
                        let firstname = req.body.firstname;
                        let npassword = req.body.npassword;
                        let cpassword = req.body.cpassword;
                        let language = req.body.language;

                        req.body.photo_change = 0;
                        if (!isValidPhoto(photo)) {
                            if (photo.match(/^data:image/)) {
                                req.body.error.photo = "Image must be jpg/jpeg/png format";
                            }
                        } else {
                            let content = req.body.photo.split(/^data:image\/(?:jpeg|jpg|png)(?:;charset=utf-8)?;base64,/)
                            if (!content) {
                                req.body.error.photo = "Image invalid"
                            } else {
                                req.body.photo = content[1]
                                req.body.photo_change = 1;
                            }
                        }
                        
                        if (usernameExist[0] && usernameExist[0].username && usernameExist[0].username !== user.username) {
                            req.body.error.username = "Username unavailable"
                        } else {
                            if (!isValidString(req.body.username, true)) {
                                req.body.error.username = "Username can contains letters, digits, dot, dash and underscore, 2-30 characters"
                            } else {
                                req.body.username = purifyString(req.body.username)
                            }
                        }

                        if (!oauth) {
                            if (emailExist[0] && emailExist[0].email && emailExist[0].email !== user.email) {
                                req.body.error.email = "Email unavailable"    
                            } else {
                                if (!isValidEmail(req.body.email)) {
                                    req.body.error.email = "Not a valid email, example: stream@hypertube.com"
                                } else {
                                    req.body.email = purifyString(req.body.email);
                                }
                            }
                        }

                        if (!lastname || !isValidString(lastname)) {
                            req.body.error.lastname = "Lastname must contains only letters, 2-20 characters"
                        } else {
                            req.body.lastname = purifyString(lastname)
                        }
        
                        if (!firstname || !isValidString(firstname)) {
                            req.body.error.firstname = "Firstname must contains only letters, 2-20 characters"
                        } else {
                            req.body.firstname = purifyString(firstname)
                        }

                        if (!oauth && (npassword || cpassword)) {
                            if (npassword && cpassword && req.body.npassword === req.body.cpassword) {
                                if (!isValidPassword(npassword)) {
                                    req.body.error.npassword = "Password must contains at least 6 characters, one uppercase and lowercase letter and one digit, only letters and digits are allowed"
                                } else {
                                    req.body.npassword = purifyString(npassword, false)
                                    req.body.npassword = await bcrypt.hash(npassword, 10)
                                    delete req.body.cpassword
                                }
                            } else {
                                req.body.error.npassword = "New password does not match with password confirmation"
                            }
                        } else {
                            req.body.npassword = user.password;
                        }

                        if (!language || !isValidLang(purifyString(language))) {
                            req.body.error.language = "Language value must be 'english' or 'french'"
                        } else {
                            req.body.language = purifyString(language)
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
    });    
};

module.exports = settingsFilter;