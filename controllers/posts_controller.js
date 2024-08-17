const Post = require('../models/post');
const Comment = require('../models/comment');
const { post } = require('../routes');

module.exports.create = async function(req, res) {
    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if (req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created successfully"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('/');
    } catch (err) {
        req.flash('error', err);
        return res.redirect('/');
    }
};

module.exports.destroy = async function(req, res){
    try {
        let post = await Post.findById(req.params.id);

        // .id means converting the object id into string
        if (post.user == req.user.id) {
            await Post.deleteOne({ _id: req.params.id });
            await Comment.deleteMany({ post: req.params.id });
            
            if (req.xhr){
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
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);

        return res.status(500).send('Internal Server Error');
    }
};