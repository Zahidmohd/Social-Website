const Post = require('../models/post');

module.exports.home = async function(req, res) {
    try {
        // Fetch all posts
        let posts = await Post.find({}).populate('user').exec();
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    } catch (err) {
        console.log('Error in fetching posts:', err);
        return res.redirect('back');
    }
    // populate the user of each post
    // Post.find({}).populate('user').exec(function(err, posts){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // })
};

// module.exports.actionName = function(req, res){}