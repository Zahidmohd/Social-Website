const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// Tell passport to use a new strategy for Google login
passport.use(new googleStrategy({
        clientID: '953049878561-6n24jb370ng0rlflve3384hsd1ntilk2.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    },

    async function(accessToken, refreshToken, profile, done) {
        try {
            // Find a user with the given email
            let user = await User.findOne({ email: profile.emails[0].value });

            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user) {
                // If found, set this user as req.user
                return done(null, user);
            } else {
                // If not found, create the user and set it as req.user
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });

                return done(null, user);
            }
        } catch (err) {
            console.log('Error in Google strategy-passport:', err);
            return done(err, false);
        }
    }
));

module.exports = passport;
