const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
    try {
        // Fetch posts with their associated users and comments
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            })
            .exec();

        // Fetch all users
        let users = await User.find({});

        // Render the home page with posts and users
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.log('Error in loading home page:', err);
        return res.status(500).send('Internal Server Error');
    }
};
