const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if (req.xhr) {
            // Populate just the user's name to avoid sending sensitive data
            post = await post.populate('user', 'name');

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    } catch (err) {
        req.flash('error', err.message);
        console.error(err); // Log error to console for debugging
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {
            // Use deleteOne instead of remove
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});  

            await post.deleteOne();

            // Delete all comments associated with the post
            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err.message);
        console.error(err); // Log error to console for debugging
        return res.redirect('back');
    }
}
