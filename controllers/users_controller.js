const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// User profile
module.exports.profile = async function(req, res) {
    try {
        let user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    } catch (err) {
        console.error('Error in loading profile:', err);
        req.flash('error', 'Error in loading profile');
        return res.redirect('back');
    }
};

// Update user profile
module.exports.update = async function(req, res) {
    if (req.user.id === req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            
            User.uploadedAvatar(req, res, function(err) {
                if (err) {
                    console.log('****** Multer Error: ', err);
                    req.flash('error', 'Multer Error: ' + err.message);
                    return res.redirect('back');
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {

                //    if(user.avatar){
                //     fs.unlinkSync(path.join(__dirname, '..', 'public', user.avatar));
                //    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();

                req.flash('success', 'Profile updated successfully!');
                return res.redirect('back');
            });

        } catch (err) {
            console.error('Error in updating profile:', err);
            req.flash('error', 'Error in updating profile');
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
};

// Render the sign-up page
module.exports.signUp = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
};

// Render the sign-in page
module.exports.signIn = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
};

// Get the sign-up data
module.exports.create = async function(req, res) {
    if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            await User.create(req.body);
            req.flash('success', 'You have signed up successfully! Please log in.');
            return res.redirect('/users/sign-in');
        } else {
            req.flash('error', 'Email already registered. Please log in.');
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error in signing up:', err);
        req.flash('error', 'Error in signing up');
        return res.redirect('back');
    }
};

// Sign in and create a session for the user
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
};

// Sign out and destroy the session
module.exports.destroySession = function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            console.error('Error in logging out:', err);
            req.flash('error', 'Error in logging out');
            return next(err); // Pass the error to the next middleware (error handler)
        }
        req.flash('success', 'You have logged out successfully!');
        return res.redirect('/');
    });
};
