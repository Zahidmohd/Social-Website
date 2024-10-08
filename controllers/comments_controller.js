const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function(req, res) {
 try {
       let post = await Post.findById(req.body.post);

       if (!post) {
            req.flash('error', 'Post not found');
            return res.redirect('back');
        }
        
    if(post){
        let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });

        post.comments.push(comment._id);
        await post.save();

        comment = await Comment.findById(comment._id).populate('user', 'name email').exec();
        // commentsMailer.newComment(comment);
        
        let job = queue.create('emails', comment).save(function(err){
            if (err){
                console.log('Error in sending to the queue', err);
                return;
            }
            console.log('job enqueued', job.id);

        })


        if (req.xhr) {
            // Populate the user field to include only the name of the user
            // comment = await Comment.findById(comment._id).populate('user', 'name');

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
        console.error('Error in creating comment:', err);
        req.flash('error', 'Could not create comment');
        return res.redirect('back');
    }
};

module.exports.destroy = async function(req, res) {
    try {
        let comment = await Comment.findById(req.params.id);

        if (!comment) {
            req.flash('error', 'Comment not found');
            return res.redirect('back');
        }

        if (comment.user.toString() !== req.user.id) {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }

        let postId = comment.post;
        await comment.remove();

        await Comment.findByIdAndDelete(req.params.id);

        // Pull the comment from the post's comments array
        await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
        
        await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
 
        
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
    } catch (err) {
        console.error('Error in deleting comment:', err);
        req.flash('error', 'Could not delete comment');
        return res.redirect('back');
    }
};