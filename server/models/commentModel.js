const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', 
    },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }]
})

const CommentModel = mongoose.model('Comment', CommentSchema);
module.exports = CommentModel;