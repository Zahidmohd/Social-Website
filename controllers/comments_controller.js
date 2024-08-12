const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
    try {
        // Find the post by ID
        let post = await Post.findById(req.body.post);

        // If the post exists, create a comment
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            // Add the comment to the post's comments array
            post.comments.push(comment);
            await post.save();

            // You can also add a flash message here to notify the user of successful comment creation
            // req.flash('success', 'Comment added successfully!');

            return res.redirect('/');
        } else {
            // If the post doesn't exist, redirect back with an error message
            // req.flash('error', 'Post not found!');
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in creating comment:', err);
        // req.flash('error', 'Error in creating comment');
        return res.redirect('back');
    }
}
