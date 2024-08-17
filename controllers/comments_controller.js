const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();

            if (req.xhr) {
                // Populate the user field to include only the name of the user
                comment = await comment.populate('user', 'name');
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            req.flash('success', 'Comment published!');
            return res.redirect('/');
        }
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res) {
    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            let postId = comment.post;

            await Comment.findByIdAndDelete(req.params.id);

            // Pull the comment from the post's comments array
            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            // Send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
    }
}
