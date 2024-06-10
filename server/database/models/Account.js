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
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
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
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
    username: doc.username,
    profilePicture: doc.profilePicture,
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