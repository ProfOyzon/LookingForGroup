const mongoose = require('mongoose');

let CommentModel = {};

const CommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    replies: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        required: true,
        default: []
    },
    content: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Converts a doc to something we can store in redis later on.
CommentSchema.statics.toAPI = (doc) => ({
    _id: doc._id,
});

CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = {
    Comment: CommentModel
};