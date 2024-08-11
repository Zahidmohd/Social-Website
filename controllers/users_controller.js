const User = require('../models/user');


// Render the profile page
module.exports.profile = async function(req, res) {
    if (req.cookies.user_id) {
        try {
            const user = await User.findById(req.cookies.user_id);
            if (user) {
                return res.render('user_profile', {
                    title: "User Profile",
                    user: user
                });
            } else {
                return res.redirect('/users/sign-in');
            }
        } catch (err) {
            console.error('Error in finding user:', err);
            return res.redirect('/users/sign-in');
        }
    } else {
        return res.redirect('/users/sign-in');
    }
};


// render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// Get the sign up data
module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            return res.redirect('back');
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error in creating user while signing up:', err);
        return res.redirect('back');
    }
};


// sign in and create a session for the user
module.exports.createSession = function(req, res){

    return res.redirect('/');

    // // steps to authenticate
    // // find the user
    // User.findOne({email: req.body.email}, function(err, user){
    //     if(err){console.log('error in finding user in signing in'); return}
    //     // handle user found
    //     if (user){

    //         // handle password which doesn't match
    //         if (user.password != req.body.password){
    //             return res.redirect('back');
    //         }

    //         // handle session creation
    //         res.cookie('user_id', user.id);
    //         return res.redirect('/users/profile');

    //     }else{
    //         // handle user not found

    //         return res.redirect('back');
    //     }


    // });
    
}