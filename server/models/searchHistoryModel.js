const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
    query: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['Admin', 'User'],
        required: true
    },
    authId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SearchHistoryModel = mongoose.model('SearchHistory', SearchHistorySchema);

module.exports = SearchHistoryModel;