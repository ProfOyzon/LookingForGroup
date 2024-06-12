const mongoose = require('mongoose');

let ProjectModel = {};

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Untitled Project',
    },
    description: {
        type: String,
        default: "",
    },
    members: {
        type: [{
            userID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Account'
            },
            admin: {
                type: Boolean,
                required: true,
                default: false
            },
            owner: {
                type: Boolean,
                required: true,
                default: false
            },
            role: {
                type: String,
                required: true,
                default: ""
            }
        }],
        required: true,
        default: [],
    },
    tags: {
        type: [String],
        required: true,
        default: []
    },
    neededRoles: {
        type: [{
            role: {
                type: String,
                required: true,
                default: ""
            },
            amount: {
                type: Number,
                required: true,
                default: 0
            },
            description: {
                type: String,
                required: true,
                default: ""
            }
        }],
        required: true,
        default: []
    },
    posts: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        required: true,
        default: []
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Converts a doc to something we can store in redis later on.
ProjectSchema.statics.toAPI = (doc) => ({
    _id: doc._id,
});

ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = {
    Project: ProjectModel
};