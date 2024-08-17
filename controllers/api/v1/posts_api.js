const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });

        return res.status(200).json({
            message: "List of posts",
            posts: posts
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports.destroy = async function(req, res){
    try {
        let post = await Post.findById(req.params.id);

        if (post) {
            // Uncomment and modify the following if you want to check user authorization
            // if (post.user == req.user.id) {

            await post.remove();
            await Comment.deleteMany({ post: req.params.id });

            return res.status(200).json({
                message: "Post and associated comments deleted successfully!"
            });

            // } else {
            //     return res.status(403).json({
            //         message: "You are not authorized to delete this post."
            //     });
            // }
        } else {
            return res.status(404).json({
                message: "Post not found."
            });
        }

    } catch (err) {
        console.error('Error deleting post:', err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
