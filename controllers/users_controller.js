const User = require('../models/user');

// Render the user profile page
module.exports.profile = async function(req, res) {
    try {
        let user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user // Passing the user data to the template
        });
    } catch (err) {
        console.log('Error in finding user:', err);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports.update = async function(req, res) {
    // Check if the logged-in user's ID matches the ID in the request params
    if (req.user.id == req.params.id) {
        try {
            // Find the user by ID and update with the request body data
            await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('back');
        } catch (err) {
            console.log('Error in updating user:', err);
            return res.status(500).send('Internal Server Error');
        }
    } else {
        // If the user is not authorized, return a 401 Unauthorized response
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

// Handle user sign-up
module.exports.create = async function(req, res) {
    if (req.body.password !== req.body.confirm_password) {
        return res.redirect('back');
    }

    try {
        let user = await User.findOne({ email: req.body.email });

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
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
};

// Handle user logout and destroy session
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.log('Error during logout:', err);
            return res.redirect('/');
        }
        req.flash('success', 'Logged out Successfully');
        return res.redirect('/');
    });
};
