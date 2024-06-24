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

    // make sure that email is in the correct format
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return res.status(400).json({ error: 'Email does not match pattern' });
    }

    // make sure that the username is in the correct format
    if (!/^[A-Za-z0-9_\-.]{1,16}$/.test(username)) {
        return res.status(400).json({ error: 'Username does not match pattern' });
    }

    // makes sure that the password is in the correct format
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password1)) {
        return res.status(400).json({ error: 'Password does not match pattern' });
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
        return res.status(400).json({ error: 'An error occurred' });
    }
}

const logout = (req, res) => {
    // destroys the current session
    req.session.destroy();

    // redirects to the default home page
    return res.json({
        loggedIn: false,
        redirect: '/'
    });
};

const updateAccountByID = async (req, res) => {
    try {
        // This data object represents any changes we are making to the Account
        data = {
            email: req.body.data.email ? req.body.data.email : null,
            username: req.body.data.username ? req.body.data.username : null,
            profilePicture: req.body.data.profilePicture ? req.body.data.profilePicture : null,
            name: req.body.data.name ? req.body.data.name : null,
            pronouns: req.body.data.pronouns ? req.body.data.pronouns : null,
            bio: req.body.data.bio ? req.body.data.bio : null,
            skills: req.body.data.skills ? req.body.data.skills : null,
        }

        // find and update the doc
        const result = await Project.findOneAndUpdate({ _id: req.body.data._id }, data, { new: true, runValidators: true });
        // push the change to the database
        result.save();
        return res.json({ account: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
    }
}

const getAccountByID = async (req, res) => {
    try {
        const result = await Project.findById(req.body._id);
        return res.json({ account: result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
    }
}


// Projects

const createProject = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

const updateProjectByID = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

// Posts

const createPost = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

const updatePostByID = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

// Comments

const createComment = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

const updateCommentByID = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

// Messages

const createMessage = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

const updateMessageByID = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}


module.exports = {
    api,
    notFound,
    login,
    signup,
    logout,
    updateAccountByID,
    getAccountByID,
    addSkillsByAccountID,
    createProject,
    updateProjectByID,
    createPost,
    updatePostByID,
    createComment,
    updateCommentByID,
    createMessage,
    updateMessageByID,
};