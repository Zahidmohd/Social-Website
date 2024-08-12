const User = require('../models/user');

// Render the user profile page
module.exports.profile = function(req, res) {
    return res.render('user_profile', {
        title: 'User Profile'
    });
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

// Handle user sign-up
module.exports.create = async function(req, res) {
    if (req.body.password !== req.body.confirm_password) {
        return res.redirect('back');
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in user creation:', err);
        return res.redirect('back');
    }
};

// Handle user sign-in and create a session
module.exports.createSession = function(req, res) {
    return res.redirect('/');
};

// Handle user logout and destroy session
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.log('Error during logout:', err);
            return res.redirect('/');
        }
        return res.redirect('/');
    });
};
