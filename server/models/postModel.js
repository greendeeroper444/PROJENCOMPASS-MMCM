const mongoose = require('mongoose');
const CommentModel = require('./commentModel');
const ReplyModel = require('./replyModel');
const NotificationModel = require('./notificationModel');

const PostSchema = new mongoose.Schema({
    question: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    author: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    pdf: String,
    isSaved: {
        type: Boolean,
        default: false  
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }]
})


PostSchema.pre('remove', async function(next){
    const postId = this._id;
    try {
        await CommentModel.deleteMany({post: postId});
        await ReplyModel.deleteMany({post: postId});
        await NotificationModel.deleteMany({$or: [{ content: { $regex: postId } }, { 'content.postId': postId }]});
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
});
const PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;