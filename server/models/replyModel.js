const mongoose = require('mongoose');


const ReplySchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    reply: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const ReplyModel = mongoose.model('Reply', ReplySchema);
module.exports = ReplyModel;