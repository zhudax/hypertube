var db = require('../db/db');
var sql = require('../db/requetes');
const express = require('express');
const router = express.Router();
const passport = require('../tools/passport');
const jwt = require('jsonwebtoken');

router.get('/all_genre', passport.authenticate('jwt', {session: false}), (req, res) => {
    db.connection_db.query(sql.get_all_genre, (err, rows) => {
        if (err)
            res.status(403).json({msg: "Error get all genre"});
        res.json({genres: rows});
    });
});

router.get('/all_movies', passport.authenticate('jwt', {session: false}), (req, res) => {
    db.connection_db.query(sql.get_all_movies_by_rating, (err, rows) => {
        if (err) {
            res.status(403).json({msg: "Error get movies"});
        } else {
            let uid = jwt.decode(req.cookies.token).id;
            for (let i = 0; i < rows.length; i++) {
                db.connection_db.query(sql.get_movie_view, [uid, rows[i].movie_id], (err1, rows1) => {
                    if (err) {
                        res.status(403).json({msg: "Error get movies"});
                    } else {
                        rows[i].viewed = (rows1.length);
                        if (i == rows.length - 1) {
                            res.json({movies: rows});
                        }
                    }
                })
            }
        }
    });
});

/*
requete need:
min_rating, max_rating, min_year, max_year, genres, order, nb
*/

router.post('/all_movies/:nb', passport.authenticate('jwt', {session: false}), (req, res) => {
    // cast convertit le nombre en decimal avec 2 chiffre max avant la virgule et 1 chiffre apres
    var where = "cast(ifNULL(movies.rating, 0) as decimal(2, 1)) >= " + req.body.min_rating + " AND cast(ifNULL(movies.rating, 0) as decimal(2, 1)) <= " + req.body.max_rating;
    where += " AND movies.year >= " + req.body.min_year + " AND movies.year <= " + req.body.max_year;
    if (req.body.name)
        where += " AND movies.title LIKE '%" + req.body.name + "%'";
    if (req.body.genres)
        where += " AND b.genres LIKE '%" + req.body.genres + "%'";
    var order = req.body.order
    if (order !== "title")
        order += " DESC"
    var get_all_movies_by_filtre_with_genre = "SELECT movies.*, b.genres FROM movies INNER JOIN (SELECT movie_id, group_concat(genre) AS genres FROM genre GROUP BY movie_id) b ON movies.movie_id = b.movie_id WHERE " + where + " ORDER BY " + order + " LIMIT 20 OFFSET " + req.params.nb * 20;
    var get_all_movies_by_filtre_without_genre = "SELECT movies.* FROM movies WHERE " + where + " ORDER BY " + order + " LIMIT 20 OFFSET " + req.params.nb * 20;
    var get_all_movies_by_filtre = (req.body.genres) ? get_all_movies_by_filtre_with_genre : get_all_movies_by_filtre_without_genre;
    db.connection_db.query(get_all_movies_by_filtre, (err, rows) => {
        if (err) {
            res.status(403).json({msg: "Error get movies"});
        } else if (rows.length > 0) {
            let uid = jwt.decode(req.cookies.token).id;
            for (let i = 0; i < rows.length; i++) {
                db.connection_db.query(sql.get_movie_view, [uid, rows[i].movie_id], (err1, rows1) => {
                    if (err) {
                        res.status(403).json({msg: "Error get movies"});
                    } else {
                        rows[i].viewed = (rows1.length);
                        if (i == rows.length - 1) {
                            res.json({movies: rows});
                        }
                    }
                })
            }
        } else {
            res.json({movies: rows});
        }
    });
});

router.get('/movie/:movie_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    var movie_id = req.params.movie_id;
    db.connection_db.query(sql.get_movie, [movie_id], (err, rows) => {
        if (err) {
            res.status(403).json({msg: "Error get info"});
        } else if (rows.length < 1) {
            res.status(403).json({msg: "Error no film"});
        } else {
            db.connection_db.query(sql.get_movie_genre, [movie_id], (err1, rows1) => {
                if (err1) {
                    res.status(403).json({msg: "Error get info"});
                } else {
                    let genres = rows1.length ? rows1 : ["Unspecified"];
                    db.connection_db.query(sql.get_movie_torrent_info, [movie_id], (err2, rows2) => {
                        if (err2) {
                            res.status(403).json({msg: "Error get info"});
                        } else {
                            let torrents = [];
                            for (let i = 0; i < rows2.length; i++) {
                                if (torrents.includes(rows2[i].quality)) {
                                    delete rows2[i];
                                } else {
                                    torrents.push(rows2[i].quality);
                                }
                            }
                            rows2 = rows2.filter(function(e) {return e});
                            res.json({info: rows, genres: genres, torrents: rows2});
                        }
                    });
                }
            });
        }
    })
});

router.post('/movie/:movie_id/viewed', passport.authenticate('jwt', {session: false}), (req, res) => {
    let uid = jwt.decode(req.cookies.token).id;
    var movie_id = req.params.movie_id;
    db.connection_db.query(sql.get_movie_view, [uid, movie_id], (err, rows) => {
        if (err) {
            res.status(403).json({msg: "Error add view"});
        } else if (rows.length < 1) {
            db.connection_db.query(sql.add_movie_view, [[uid, movie_id]], (err1, rows1) => {
                if (err1) {
                    res.status(403).json({msg: "Error add view"});
                } else {
                    res.json({msg: "OK"});
                }
            });
        } else {
            res.json({msg: "OK"});
        }
    });
});

module.exports = router;