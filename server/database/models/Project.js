const mongoose = require('mongoose');

let ProjectModel = {};

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Untitled Project',
    },
    description: {
        type: String,
        default: "",
    },
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        permissions: {
            type: String,
            required: true,
            default: "Member", // Manager, Member
        }
    }],
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