const express = require('express');
const router = express.Router();
const passport = require('../tools/passport');
const jwt = require('jsonwebtoken');

let port_front = process.env.NODE_ENV == 'dev' ? 3001 : 5000;
// Router pour passport 42
router.get('/42', passport.authenticate('42'));
router.get('/42/callback',
    passport.authenticate('42', {
        failureRedirect: 'http://localhost:' + port_front
    }),
    function(req, res) {
        const user = req.session.passport.user;
        if (user.err) {
            res.cookie('err', "Email already use!", { maxAge: 1 * 1000, httpOnly: false});
            res.redirect('http://localhost:' + port_front);
        }
        else {
            const payload = {id: user.id, username: user.username, email: user.email};
            const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: 86400 * 1000});
            res.cookie('token', token, { maxAge: 86400 * 1000, httpOnly: false });
            res.redirect('http://localhost:' + port_front + '/home');
        }
    }
);

// Router pour passport github
router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: 'http://localhost:' + port_front
    }),
    function(req, res) {
        const user = req.session.passport.user;
        if (user.err) {
            res.cookie('err', "Email already use!", { maxAge: 1 * 1000, httpOnly: false});
            res.redirect('http://localhost:' + port_front);
        }
        else {
            const payload = {id: user.id, username: user.username, email: user.email};
            const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: 86400 * 1000});
            res.cookie('token', token, { maxAge: 86400 * 1000, httpOnly: false });
            res.redirect('http://localhost:' + port_front + '/home');
        }
    }
);

// Router pour passport google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:' + port_front
    }),
    function(req, res) {
        const user = req.session.passport.user;
        if (user.err) {
            res.cookie('err', "Email already use!", { maxAge: 1 * 1000, httpOnly: false});
            res.redirect('http://localhost:' + port_front);
        }
        else {
            const payload = {id: user.id, username: user.username, email: user.email};
            const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: 86400 * 1000});
            res.cookie('token', token, { maxAge: 86400 * 1000, httpOnly: false });
            res.redirect('http://localhost:' + port_front + '/home');
        }
    }
);

module.exports = router;