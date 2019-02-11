const express = require('express');
const router = express.Router();
const passport = require('../tools/passport');
const userQuery = require('../models/userModel');
const jwt = require('jsonwebtoken');
var db = require('../db/db');
var sql = require('../db/requetes');

function get_comment(movie_id) {
    return new Promise((resolve, reject) => {
        db.connection_db.query(sql.get_comment_user_id, [movie_id], (err, rows) => {
            if (err) {
                reject("Error");
            } else if (rows.length > 0) {
                var data = [];
                for (let i = 0; i < rows.length; i++) {
                    userQuery.findOne({id: rows[i].user_id}).then(user => {
                        db.connection_db.query(sql.get_comment, [rows[i].comment_id], (err1, rows1) => {
                            if (err1) {
                                reject("Error");
                            } else {
                                let date = rows1[0].date.toString().split(' ');
                                let info = {
                                    uid: user.id,
                                    username: user.username,
                                    lastname: user.lastname,
                                    firstname: user.firstname,
                                    profile: user.profile,
                                    comment: rows1[0].comment,
                                    date: (date[0] + " " + date[1] + " " + date[2] + " " + date[3] + " " + date[4])
                                }
                                data.push(info);
                                if (i == rows.length - 1) {
                                    resolve(data);
                                }
                            }
                        });
                    });
                }
            } else {
                resolve([]);
            }
        });
    });
}

router.get('/:movie_id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    get_comment(req.params.movie_id).then((data) => {
        res.json({comments: data});
    }).catch(err => {
        res.status(403).json({msg: "Error get comments"});
    });
});

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    var user_id = jwt.decode(req.cookies.token).id;
    if (req.body.comment.length < 5) {
        res.status(403).json({msg: "Error comment to short"});
    } else if (req.body.comment.length > 1000) {
        res.status(403).json({msg: "Error comment to large"});
    } else {
        db.connection_db.query(sql.add_comment, [req.body.comment], (err, rows) => {
            if (err) {
                res.status(403).json({msg: "Error add comment"});
            } else {
                db.connection_db.query(sql.add_comment_movie_user, [[req.body.movie_id, rows.insertId, user_id]], (err1, rows1) => {
                    if (err1) {
                        res.status(403).json({msg: "Error add comment"});
                    } else {
                        get_comment(req.body.movie_id).then((data) => {
                            res.json({comments: data});
                        }).catch(err => {
                            res.status(403).json({msg: "Error get comments"});
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;