const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res) {
    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        return res.redirect('/');
    } catch (err) {
        console.log('Error in creating a post:', err);
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
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in deleting post:', err);
        return res.status(500).send('Internal Server Error');
    }
};