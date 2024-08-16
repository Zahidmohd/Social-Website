const express = require('express');
const router = express.Router();
const passport = require('passport');
const commentsController = require('../controllers/comments_controller');

// Route for creating a comment
router.post('/create', passport.checkAuthentication, commentsController.create);

// Route for deleting a comment, using the DELETE method and including the comment ID
router.delete('/destroy/:id', passport.checkAuthentication, commentsController.destroy);

module.exports = router;
