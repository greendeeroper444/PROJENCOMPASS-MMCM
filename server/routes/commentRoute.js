const express = require('express');
const { createComment, getCommentsByPost, getCommentDetailsByPost, createCommentAdmin, deleteCommentAdmin, deleteComment } = require('../controllers/commentController');
const router = express.Router();


//user
router.post('/create-comment', createComment);
router.delete('/delete-comment/:commentId', deleteComment);

//admin
router.post('/create-comment-admin', createCommentAdmin);
router.delete('/delete-comment-admin/:commentId', deleteCommentAdmin);


router.get('/get-comment/:postId', getCommentsByPost);
router.get('/get-comment-detail/:postId/:commentId', getCommentDetailsByPost)


module.exports = router;