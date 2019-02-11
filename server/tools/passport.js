const passport = require('passport');
var FortyTwoStrategy = require('passport-42').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const userQuery = require('../models/userModel');

require('dotenv').config();

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
};

var jwtOptions = {};
jwtOptions.jwtFromRequest = cookieExtractor;
jwtOptions.secretOrKey = process.env.JWT_KEY;
passport.use(new JWTStrategy(jwtOptions, (jwt_payload, done) => {
    userQuery.findOne({id: jwt_payload.id}).then((user) => {
        if (user) {
            if (Date.parse(user.reset_pass_time) > (jwt_payload.iat * 1000)) {
                return done(null, false);
            }
            var info = {
                id: user.id,
                username: user.username,
                email: user.email
            };
            return done(null, info);
        }
        return done(null, false);
    });
}));

passport.use(new FortyTwoStrategy({
    clientID: process.env.PASSPORT_42_CLIENT_ID,
    clientSecret: process.env.PASSPORT_42_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/42/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        let id42 = profile.id;
        let lastname = profile.name.familyName;
        let firstname = profile.name.givenName;
        let username = profile.username;
        let email = profile.emails[0].value;
        let photo = profile.photos[0].value;
        userQuery.findOne({id42: id42}).then(userId => {
            if (!userId) {
                userQuery.findOne({email: email}).then(async userEmail => {
                    if (userEmail) {
                        cb(null, {err: "Email already exists"});
                    } else {
                        while (1) {
                            let response = await userQuery.findOne({username: username});
                            if (!response)
                                break ;
                            username += Math.floor(Math.random() * 1001);
                        }
                        userQuery.createOne({lastname: lastname, firstname: firstname, username: username, email: email, profile: photo, id42: id42}).then(data => {
                            userQuery.findOne({id42: id42}).then(userInfo => {
                                return cb(null, userInfo);
                            });
                        });
                    }
                })
            }
            else {
                return cb(null, userId);
            }
        });
    }
));

passport.use(new GitHubStrategy({
        clientID: process.env.PASSPORT_GITHUB_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        let githubid = profile._json.id;
        let lastname = "Doe";
        let firstname = profile.displayName ? profile.displayName : profile.username;
        let username = profile.username;
        let email = profile._json.email;
        let photo = profile._json.avatar_url;
        userQuery.findOne({githubid: githubid}).then(userId => {
            if (!userId) {
                userQuery.findOne({email: email}).then(async userEmail => {
                    if (userEmail) {
                        cb(null, {err: "Email already exists"});
                    } else {
                        while (1) {
                            let response = await userQuery.findOne({username: username});
                            if (!response)
                                break ;
                            username += Math.floor(Math.random() * 1001);
                        }
                        userQuery.createOne({lastname: lastname, firstname: firstname, username: username, email: email, profile: photo, githubid: githubid}).then(data => {
                            userQuery.findOne({githubid: githubid}).then(userInfo => {
                                return cb(null, userInfo);
                            });
                        });
                    }
                })
            }
            else {
                return cb(null, userId);
            }
        });
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        let googleid = profile._json.id;
        let lastname = profile._json.name.familyName ? profile._json.name.familyName : "Doe";
        let firstname = profile._json.name.givenName ? profile._json.name.givenName : "Doe";
        let username = lastname ? lastname.toLowerCase() : firstname.toLowerCase();
        let email = profile._json.emails[0].value;
        let photo = profile._json.image.url.slice(0, -2) + "200";
        userQuery.findOne({googleid: googleid}).then(userId => {
            if (!userId) {
                userQuery.findOne({email: email}).then(async userEmail => {
                    if (userEmail) {
                        cb(null, {err: "Email already exists"});
                    } else {
                        while (1) {
                            let response = await userQuery.findOne({username: username});
                            if (!response)
                                break ;
                            username += Math.floor(Math.random() * 1001);
                        }
                        userQuery.createOne({lastname: lastname, firstname: firstname, username: username, email: email, profile: photo, googleid: googleid}).then(data => {
                            userQuery.findOne({googleid: googleid}).then(userInfo => {
                                return cb(null, userInfo);
                            });
                        });
                    }
                })
            }
            else {
                return cb(null, userId);
            }
        });
    }
));

module.exports = passport;