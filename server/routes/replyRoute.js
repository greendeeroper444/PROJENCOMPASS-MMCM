const express = require('express');
const { createReplyOnCommentPost, getReplyOnCommentsByPost, createReplyOnCommentPostAdmin, deleteReply, deleteReplyAdmin } = require('../controllers/replyController');
const router = express.Router();

//suer
router.post('/create-reply', createReplyOnCommentPost);
router.delete('/delete-reply/:replyId', deleteReply);

//admin
router.post('/create-reply-admin', createReplyOnCommentPostAdmin);
router.delete('/delete-reply-admin/:replyId', deleteReplyAdmin);


router.get('/get-reply/:postId/:commentId', getReplyOnCommentsByPost);

module.exports = router;