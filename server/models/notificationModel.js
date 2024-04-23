const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'recipientType'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderType',
        
    },
    recipientType: {
        type: String,
        enum: ['User', 'Admin'],
        
    },
    senderType: {
        type: String,
        enum: ['User', 'Admin'],
        
    },
    notificationType: {
        type: String,
        enum: ['react', 'comment', 'mention', 'reply'],
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NotificationModel = mongoose.model('Notification', NotificationSchema);
module.exports = NotificationModel;
