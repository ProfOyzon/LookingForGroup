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
    return res.json({ message: "Not Implemented Yet" });
}

const signup = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

const updateAccountByID = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

const getAccountByID = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
}

const addSkillsByAccountID = (req, res) => {
    return res.json({ message: "Not Implemented Yet" });
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