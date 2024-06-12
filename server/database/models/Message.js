const mongoose = require('mongoose');

let MessageModel = {};

const MessageSchema = new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    recipientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    messageContent: {
        type: String,
        required: true,
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
MessageSchema.statics.toAPI = (doc) => ({
    _id: doc._id,
});

MessageModel = mongoose.model('Message', MessageSchema);

module.exports = {
    Message: MessageModel
};