const path = require('path');
const database = require('../database');
const { Account, Project, Message, Post, Comment } = database;

const api = (req, res) => {
    return res.json({ message: "You Reached The Looking For Group API" });
}

const notFound = (req, res) => {
    return res.json({ message: "Not Found" });
}

// Accounts

const login = (req, res) => {
    // middleware makes sure user is logged out

    const username = `${req.body.username}`;
    const password = `${req.body.password}`;

    // make sure that we recieved credentials
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing Credentials' });
    }

    // use the authenticate function in the Account model to login to an account
    return Account.authenticate(username, password, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Login Failed' });
        }

        // update the current session to use this account (and convert it to usable json)
        req.session.account = Account.toAPI(account);


        return res.json({
            loggedIn: true,
            account: req.session.account,
            redirect: '/'
        });
    });
}

const signup = async (req, res) => {
    // middleware makes sure user is logged out

    const email = `${req.body.email}`;
    const username = `${req.body.username}`;
    const password1 = `${req.body.password}`;
    const password2 = `${req.body.password2}`;

    // make sure that we recieved credentials
    if (!username || !password1 || !password2 || !email) {
        return res.status(400).json({ error: 'Missing Credentials' });
    }

    // make sure that passwords match
    if (password1 !== password2) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    // makes sure that the password is in the correct format
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password1)) {
        return res.status(400).json({ error: 'Password does not match pattern' });
    }

    // make sure that email is in the correct format
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return res.status(400).json({ error: 'Email does not match pattern' });
    }

    // make sure that the username is in the correct format
    if (!/^[A-Za-z0-9_\-.]{1,16}$/.test(username)) {
        return res.status(400).json({ error: 'Username does not match pattern' });
    }

    try {
        // create a placeholder profile picture
        const profilePicture = {
            name: "default-profile",
            data: null,
            mimeType: null,
        }

        // use the generateHash function in the Account model to encrypt the password
        const hash = await Account.generateHash(password1);

        // create a new account
        const newAccount = new Account({ email, username, password: hash, profilePicture });
        // push the new account to the database
        await newAccount.save();

        // update the current session to use this account (and convert it to usable json)
        req.session.account = Account.toAPI(newAccount);

        return res.json({
            loggedIn: true,
            account: req.session.account
        });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) { // this error code means that a unique value already exists
            return res.status(400).json({ error: 'Username already in use' });
        }
        return res.status(400).json({ error: 'An error occurred while signing up for a new account' });
    }
}

const logout = (req, res) => {
    // middleware makes sure user is logged in

    // destroys the current session
    req.session.destroy();

    // redirects to the default home page
    return res.json({
        loggedIn: false,
        redirect: '/'
    });
};

const updateAccount = async (req, res) => {
    // middleware makes sure user is logged in

    try {
        // This data object represents any changes we are making to the Account
        data = {
            email: req.body.email ? req.body.email : null,
            username: req.body.username ? req.body.username : null,
            profilePicture: req.body.profilePicture ? req.body.profilePicture : null,
            name: req.body.name ? req.body.name : null,
            pronouns: req.body.pronouns ? req.body.pronouns : null,
            bio: req.body.bio ? req.body.bio : null,
            skills: req.body.skills ? req.body.skills : null,
        }

        // find and update the doc
        const result = await Account.findOneAndUpdate({ _id: req.session.account._id }, data, { new: true, runValidators: true });
        // push the change to the database
        result.save();
        return res.json({ account: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while updating account with ID: ' + req.session.account._id });
    }
}

const getAccountByID = async (req, res) => {
    try {
        // search for an account doc with the given _id value
        const result = await Account.findById(req.body.accountID);
        return res.json({ account: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while getting account with ID: ' + req.body.accountID });
    }
}


// Projects


const createProject = async (req, res) => {
    // middleware makes sure user is logged in

    // makes sure that a title was given
    if (!req.body.title) {
        return res.status(400).json({ error: 'Missing Title' });
    }

    // this data represents what will be in the new project to start
    projectData = {
        title: req.body.title,
        description: req.body.description ? req.body.description : "",
        tags: req.body.tags ? req.body.tags : [],
        members: [{
            userID: req.session.account._id,
            permissions: 'owner',
            role: "",
        }]
    }

    try {
        // create a new project
        const newProject = new Project({ projectData });
        // push the new project to the database
        await newProject.save();

        return res.json({
            project: newProject
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while creating project from accountID: ' + req.session.account._id });
    }
}

const updateProjectByID = async (req, res) => {
    // middleware makes sure user is logged in and has admin rights to project

    try {
        // This data object represents any changes we are making to the Project
        projectData = {
            title: req.body.title ? req.body.title : null,
            description: req.body.description ? req.body.description : null,
            members: req.body.members ? req.body.members : null,
            tags: req.body.tags ? req.body.tags : null,
            neededRoles: req.body.neededRoles ? req.body.neededRoles : null,
            posts: req.body.posts ? req.body.posts : null,
        }

        // make sure that the added members have a valid permissions value
        if (projectData.members) {
            filteredMembers = projectData.members.filter((member) => member.permissions === 'owner' || member.permissions === 'admin' || member.permissions === 'member');
            if (filteredMembers.length !== projectData.members.length) {
                return res.status(400).json({ error: 'Invalid Member Permissions' });
            }
        }

        // find and update the doc
        const result = await Project.findOneAndUpdate({ _id: req.body.projectID }, projectData, { new: true, runValidators: true });
        // push the change to the database
        result.save();

        return res.json({ project: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while updating a project with ID: ' + req.body.projectID });
    }
}

const getProjectByID = async (req, res) => {
    // makes sure that a projectID was given
    if (!req.body.projectID) {
        return res.status(400).json({ error: 'Missing projectID' });
    }

    try {
        // search for a project doc with the given _id value
        const result = await Project.findById(req.body.projectID);
        return res.json({ project: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while getting a project by ID: ' + req.body.projectID });
    }
}

// Posts

const createPost = async (req, res) => {
    // middleware makes sure user is logged in and has admin rights to project

    // makes sure that a title was given
    if (!req.body.title) {
        return res.status(400).json({ error: 'Missing Title' });
    }

    // makes sure that some sort of content was given
    if (!req.body.textContent && !req.body.imageContent) {
        return res.status(400).json({ error: 'Missing Content' });
    }

    // this data represents what will be in the new project to start
    postData = {
        projectID: req.body.projectID,
        author: req.session.account._id,
        title: req.body.title,
        textContent: req.body.textContent ? req.body.textContent : null,
        imageContent: req.body.imageContent ? req.body.imageContent : null,
        replies: []
    }

    try {
        // create a new post
        const newPost = new Post({ postData });
        // push the new post to the database
        await newPost.save();

        // update the project doc
        newProject = await Project.findById(req.body.projectID);;
        newProject.posts.push(newPost._id);
        // push the project changes to the doc
        await newProject.save();

        return res.json({
            post: newPost,
            project: newProject
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while creating a new post from project with ID: ' + req.body.projectID });
    }
}

const updatePostByID = async (req, res) => {
    // middleware makes sure user is logged in, has project admin rights, and is the author of the post

    try {
        // This data object represents any changes we are making to the Post
        postData = {
            title: req.body.title ? req.body.title : null,
            textContent: req.body.textContent ? req.body.textContent : null,
            imageContent: req.body.imageContent ? req.body.imageContent : null,
        }

        // find and update the doc
        const result = await Post.findOneAndUpdate({ _id: req.body.postID }, postData, { new: true, runValidators: true });
        // push the change to the database
        result.save();

        return res.json({ post: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while updating a post with ID: ' + req.body.postID });
    }
}

const getPostByID = async (req, res) => {
    // make sure that a postID was given
    if (!req.body.postID) {
        return res.status(400).json({ error: 'Missing postID' });
    }

    try {
        // search for a post doc with the given _id value
        const result = await Post.findById(req.body.postID);
        return res.json({ post: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while getting post with ID: ' + req.body.postID });
    }
}

// Comments

const createComment = async (req, res) => {
    // middleware makes sure user is logged in

    // makes sure that the post or comment you are replying to was given
    if (!req.body.postID && !req.body.commentID) {
        return res.status(400).json({ error: 'Missing postID or commentID to reply to' });
    }

    // makes sure that content was given
    if (!req.body.content) {
        return res.status(400).json({ error: 'Missing Content' });
    }

    // this data represents what will be in the new project to start
    commentData = {
        author: req.session.account._id,
        replies: [],
        content: req.body.content
    }

    try {
        // create a new comment
        const newComment = new Comment({ commentData });
        // push the new comment to the database
        await newComment.save();

        // update the post or comment doc you are replying to
        replyingTo;
        if (req.body.postID) {
            replyingTo = await Post.findById(req.body.postID);
        } else {
            replyingTo = await Comment.findById(req.body.commentID);
        }
        // add this reply to the doc of what you are replying to
        replyingTo.replies.push(newComment._id);
        // push the updated doc to the database
        await replyingTo.save();

        return res.json({
            comment: newComment,
            replyingTo: replyingTo,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while creating a new comment from account with ID: ' + req.session.account._id });
    }
}

const updateCommentByID = async (req, res) => {
    // middleware makes sure user is author of comment 

    if (!req.body.content) {
        return res.status(400).json({ error: 'Missing Content' });
    }

    // This data object represents any changes we are making to the Post
    commentData = {
        content: req.body.content ? req.body.content : null,
    }

    try {
        // find and update the doc
        const result = await Comment.findOneAndUpdate({ _id: req.body.commentID }, commentData, { new: true, runValidators: true });
        // push the change to the database
        result.save();

        return res.json({ comment: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while updating a comment with ID: ' + req.body.commentID });
    }
}

const getCommentByID = async (req, res) => {
    // makes sure that a commentID was given
    if (!req.body.commentID) {
        return res.status(400).json({ error: 'Missing commentID' });
    }

    try {
        // search for a comment doc with the given _id value
        const result = await Comment.findById(req.body.commentID);
        return res.json({ comment: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while getting comment with ID: ' + req.body.commentID });
    }
}

// Messages

const createMessage = async (req, res) => {
    // middleware makes sure user is logged in

    // makes sure that recipient was given & exists
    if (!req.body.recipientID) {
        return res.status(400).json({ error: 'Missing recipientID' });
    }

    const recipient = await Account.findById(req.body.recipientID);
    if (!recipient) {
        return res.status(400).json({ error: 'Invalid recipientID' });
    }

    // makes sure that content was given
    if (!req.body.messageContent && !req.body.imageContent) {
        return res.status(400).json({ error: 'Missing Content' });
    }

    // this data represents what will be in the new message
    messageData = {
        senderID: req.session.account._id,
        recipientID: req.body.recipientID,
        messageContent: req.body.messageContent ? req.body.messageContent : null,
        imageContent: req.body.imageContent ? req.body.imageContent : null,
    }

    try {
        // create a new message
        const newMessage = new Message({ messageData });
        // push the new message to the database
        await newMessage.save();

        // update the senderID and recipientID accounts
        recipientAccount = await Account.findById(req.body.recipientID);
        recipientAccount.messages.push(newMessage._id);
        await recipientAccount.save();

        senderAccount = await Account.findById(req.body.senderID);
        senderAccount.messages.push(newMessage._id);
        await senderAccount.save();

        return res.json({
            message: newMessage,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while creating a new comment from account with ID: ' + req.session.account._id });
    }
}

const updateMessageByID = async (req, res) => {
    // middleware makes sure user is logged in and that they are the sender of the message

    // makes sure that content was given
    if (!req.body.messageContent && !req.body.imageContent) {
        return res.status(400).json({ error: 'Missing Content' });
    }

    // This data object represents any changes we are making to the Message
    messageData = {
        messageContent: req.body.messageContent ? req.body.messageContent : null,
        imageContent: req.body.imageContent ? req.body.imageContent : null,
    }

    try {
        // find and update the doc
        const result = await Message.findOneAndUpdate({ _id: req.body.messageID }, messageData, { new: true, runValidators: true });
        // push the change to the database
        result.save();

        return res.json({ message: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while updating a message with ID: ' + req.body.messageID });
    }
}

const getMessageByID = async (req, res) => {
    // makes sure that a messageID was given
    if (!req.body.messageID) {
        return res.status(400).json({ error: 'Missing messageID' });
    }

    try {
        // search for a message doc with the given _id value
        const result = await Message.findById(req.body.messageID);
        return res.json({ message: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred while getting meassage with ID: ' + req.body.messageID });
    }
}


module.exports = {
    api,
    notFound,
    login,
    signup,
    logout,
    updateAccount,
    getAccountByID,
    createProject,
    updateProjectByID,
    getProjectByID,
    createPost,
    updatePostByID,
    getPostByID,
    createComment,
    updateCommentByID,
    getCommentByID,
    createMessage,
    updateMessageByID,
    getMessageByID,
};