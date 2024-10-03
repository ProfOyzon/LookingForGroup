// OLD DATABASE

const path = require('path');
const database = require('../database');
const { Account, Project, Message, Post, Comment } = database;

const makeFakeAccount = async (req, res) => {
    const email = "fakeEmail@gmail.com";
    const username = "The Best Username";
    const password = "Password123!";
    const bio = "A Cool Bio!";

    try {
        const profilePicture = {
            name: "default-profile",
            data: null,
            mimeType: null,
        }
        const hash = await Account.generateHash(password);
        const newAccount = new Account({ email, username, password: hash, profilePicture, bio });
        await newAccount.save();
        return res.json({
            loggedIn: true,
            account: newAccount
        });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use' });
        }
        return res.status(400).json({ error: 'An error occurred' });
    }
}

const makeFakeProject = async (req, res) => {
    const name = "A Cool Projject";
    const bio = "A Cool Bio!";

    try {
        const newProject = new Project({ name, bio });
        await newProject.save();
        return res.json({
            project: newProject
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
    }
}

const makeFakeMessage = async (req, res) => {
    const senderID = "66688b1aee161307c3755037";
    const recipientID = "66688b1aee161307c3755037";
    const messageContent = "Hello self!";

    try {
        const newMessage = new Message({ senderID, recipientID, messageContent });
        await newMessage.save();
        return res.json({
            message: newMessage
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
    }
}

const makeFakePost = async (req, res) => {
    const author = "66688b1aee161307c3755037";
    const textContent = "Hello World!";
    const title = "My First Post";

    try {
        const newPost = new Post({ author, title, textContent });
        await newPost.save();
        return res.json({
            post: newPost
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
    }
}

const makeFakeComment = async (req, res) => {
    const author = "66688b1aee161307c3755037";
    const content = "Thats a good post!";

    try {
        const newComment = new Comment({ author, content });
        await newComment.save();
        return res.json({
            comment: newComment
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
    }
}

module.exports = {
    makeFakeAccount,
    makeFakeProject,
    makeFakeMessage,
    makeFakePost,
    makeFakeComment,
};