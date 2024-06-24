const database = require('../database');
const { Account, Project, Message, Post, Comment } = database;

// makes sure that the user is logged in or redirects to the login page
const requiresLogin = (req, res, next) => {
    if (!req.session.account) {
        return res.redirect('/login').json({ message: "user is not logged in" });
    }
    return next();
};

// makes sure that the user is logged out or redirects to the default home page
const requiresLogout = (req, res, next) => {
    if (req.session.account) {
        return res.redirect('/').json({ message: "user is not logged out" });
    }
    return next();
};

// makes sure the user has admin or owner permissions for given projectID
const requiresProjectAdmin = async (req, res, next) => {
    // Make sure this project exists
    const project = await Project.findById(req.body.projectID);
    if (!project) {
        return res.status(400).json({ error: 'Invalid or Missing projectID' });
    }

    // make sure that the user has admin permissions
    if (project.members.filter(member => member.userID === req.session._id && (member.permissions === 'admin' || member.permissions === 'owner')).length <= 0) {
        return res.status(400).json({ error: 'Missing Admin Permissions' });
    }
    return next();
};

// makes sure the user has owner permissions for given projectID
const requiresProjectOwner = async (req, res, next) => {
    // Make sure this project exists
    const project = await Project.findById(req.body.projectID);
    if (!project) {
        return res.status(400).json({ error: 'Invalid or Missing projectID' });
    }

    // make sure that the user has admin permissions
    if (project.members.filter(member => member.userID === req.session._id && member.permissions === 'owner').length <= 0) {
        return res.status(400).json({ error: 'Missing Owner Permissions' });
    }
    return next();
};

// makes sure the user is the author of given post
const requiresPostAuthor = async (req, res, next) => {
    // Make sure this post exists
    const post = await Post.findById(req.body.postID);
    if (!post) {
        return res.status(400).json({ error: 'Invalid or Missing postID' });
    }

    // make sure that the user is author
    if (post.author !== req.session.account._id) {
        return res.status(400).json({ error: 'User is not author of post' });
    }
    return next();
};

// makes sure the user is author of given comment
const requiresCommentAuthor = async (req, res, next) => {
    // Make sure this comment exists
    const comment = await Comment.findById(req.body.commentID);
    if (!comment) {
        return res.status(400).json({ error: 'Invalid or Missing commentID' });
    }

    // make sure that the user is author
    if (comment.author !== req.session.account._id) {
        return res.status(400).json({ error: 'User is not author of comment' });
    }
    return next();
};

// makes sure the user is the sender of the given message
const requiresMessageSender = async (req, res, next) => {
    // Make sure this message exists
    const message = await Message.findById(req.body.messageID);
    if (!message) {
        return res.status(400).json({ error: 'Invalid or Missing messageID' });
    }

    // make sure that the user is the sender
    if (comment.author !== req.session.account._id) {
        return res.status(400).json({ error: 'User is not the sender of the message with ID: ' + req.body.messageID });
    }
    return next();
};

// makes sure the client has a secure connection
const requiresSecure = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
};

// bypasses the secure check (for development purposes)
const bypassSecure = (req, res, next) => {
    next();
};

if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
module.exports.requiresProjectAdmin = requiresProjectAdmin;
module.exports.requiresProjectOwner = requiresProjectOwner;
module.exports.requiresPostAuthor = requiresPostAuthor;
module.exports.requiresCommentAuthor = requiresCommentAuthor;
module.exports.requiresMessageSender = requiresMessageSender;