const mongoose = require('mongoose');

let PostModel = {};

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    textContent: {
        type: String,
        required: false
    },
    imageContent: {
        name: {
            type: String,
            trim: true,
            required: false,
        },
        data: {
            type: Buffer,
            required: false,
        },
        mimeType: {
            type: String,
            trim: true,
            required: false,
        }
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Converts a doc to something we can store in redis later on.
PostSchema.statics.toAPI = (doc) => ({
    _id: doc._id,
});

PostModel = mongoose.model('Post', PostSchema);

module.exports = {
    Post: PostModel
};