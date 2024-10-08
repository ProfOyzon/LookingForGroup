const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 13;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[A-Za-z0-9_\-.]{1,16}$/,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    profilePicture: {
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
    name: {
        type: String,
        required: true,
        trim: true,
    },
    pronouns: {
        type: [String],
        required: true,
        default: ["", ""]
    },
    bio: {
        type: String,
        required: true,
        default: ""
    },
    messages: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }],
        required: true,
        default: [],
    },
    skills: {
        type: [{
            skill: {
                type: String,
                required: true,
                default: ""
            },
            endorsed: {
                type: Boolean,
                required: true,
                default: false
            },
            highlighted: {
                type: Boolean,
                required: true,
                default: false
            }
        }],
        require: true,
        default: [],
    },
    projects: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }],
        required: true,
        default: [],
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
    email: doc.email,
    username: doc.username,
    profilePicture: doc.profilePicture,
    name: doc.name,
    pronouns: doc.pronouns,
    bio: doc.bio,
    skills: doc.skills,
    messages: doc.messages,
    projects: doc.projects,
    createdDate: doc.createdDate,
    _id: doc._id,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

AccountSchema.statics.authenticate = async (username, password, callback) => {
    try {
        let doc = await AccountModel.findOne({ username }).exec();
        console.log(doc);
        if (!doc) {
            doc = await AccountModel.findOne({ email: username }).exec();
            console.log(doc);
            if (!doc) {
                return callback();
            }
        }

        const match = await bcrypt.compare(password, doc.password);
        if (match) {
            return callback(null, doc);
        }
        return callback();
    } catch (err) {
        return callback(err);
    }
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports = {
    Account: AccountModel
};