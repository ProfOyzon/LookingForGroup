import { hardSkills, proficiencies, softSkills } from "./skills";

// No comments - GL!

export const projects = [
    {
        _id: 0,
        name: "A Cool Project!",
        members: [
            {
                userID: 0,
                admin: true,
                owner: true,
                role: "Project Lead"
            },
            {
                userID: 1,
                admin: true,
                owner: false,
                role: "Team Lead"
            },
            {
                userID: 2,
                admin: false,
                owner: false,
                role: "Developer"
            },
        ],
        description: "The bestest project yet!  I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! I LOVE BEES! ",
        tags: ["Game Development", "Rouguelike", "FPS", "So Retro"],
        neededRoles: [
            {
                Role: "Game Developer",
                amount: 2,
                description: "We are looking for game developers familiar with Unreal Engine 5",
            },
            {
                Role: "Artist",
                amount: 3,
                description: "We are looking for artists who know how to draw bees",
            }
        ],
        posts: [0, 1, 2]
    },
]

export const profiles = [
    {
        _id: 0,
        name: "Jared Smith",
        username: "The Great Old One",
        pronouns: ["He", "Him"],
        bio: "A Super cool coder!",
        preferences: {
            projectPreference: "Anything creative and hardcore",
            rolePreference: "Something that challenges my skills",
            availability: "I'm a night owl!"
        },
        messages: [0, 1],
        skills: [
            {
                skill: softSkills[0],
                type: "softSkill",
                endorsed: false,
                higlighted: true
            },
            {
                skill: softSkills[1],
                type: "softSkill",
                endorsed: true,
                higlighted: true,
                endorsement: "hes really good at it",
                endorser: "Wario Wario",
                endorseProject:"Cool Project"
            },
            {
                skill: softSkills[2],
                type: "softSkill",
                endorsed: false,
                higlighted: false
            },
            {
                skill: softSkills[3],
                type: "softSkill",
                endorsed: false,
                higlighted: false,
            },
            {
                skill: hardSkills[0],
                type: "hardSkill",
                endorsed: false,
                higlighted: true
            },
            {
                skill: hardSkills[1],
                type: "hardSkill",
                endorsed: false,
                higlighted: false
            },
            {
                skill: hardSkills[2],
                type: "hardSkill",
                endorsed: false,
                higlighted: false
            },
            {
                skill: proficiencies[0],
                type: "proficiency",
                endorsed: true,
                higlighted: false,
                endorsement: "he saved our project",
                endorser: "Bob the Builder",
                endorseProject:"Cool Project #2"
            },
            {
                skill: proficiencies[1],
                type: "proficiency",
                endorsed: false,
                higlighted: false
            },
        ],
        profilePicture: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        projects: [0, 1, 2],
        links: [
            {text: "discord", url: "https://www.discord.com/"},
            {text: "twitter", url: "https://www.twitter.com/"},
            {text: "itch.io", url: "https://www.itch.io.com/"}
        ],
    },
    {
        _id: 1,
        name: "Wario Wario",
        username: "Wario",
        pronouns: ["they", "them", "she", "her"],
        bio: "The best Wario to grace this land!",
        preferences: {
            projectPreference: "WarioWare fangames",
            rolePreference: "Wario King",
            availability: "Wah"
        },
        messages: [0, 1],
        skills: [
            {
                skill: softSkills[5],
                type: "softSkill",
                endorsed: false,
                higlighted: true
            },
            {
                skill: softSkills[1],
                type: "softSkill",
                endorsed: false,
                higlighted: true
            },
            {
                skill: softSkills[3],
                type: "softSkill",
                endorsed: false,
                higlighted: true
            },
            {
                skill: softSkills[0],
                type: "softSkill",
                endorsed: true,
                higlighted: false
            },
        ],
        profilePicture: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        projects: [3, 4, 5],
        links: [
            {text: "discord", url: "https://www.discord.com/"},
            {text: "twitter", url: "https://www.twitter.com/"},
            {text: "itch.io", url: "https://www.itch.io.com/"}
        ],
    },
    {
        _id: 2,
        name: "Jane Doe",
        username: "Princess",
        pronouns: ["She", "Her"],
        bio: "I dont need to be saved!",
        preferences: {
            projectPreference: "Artistic and fun games",
            rolePreference: "Art and animation",
            availability: "Tuesday and Thursday evenings"
        },
        messages: [],
        skills: [
            {
                skill: softSkills[0],
                type: "softSkill",
                endorsed: false,
                higlighted: true
            },
            {
                skill: softSkills[1],
                type: "softSkill",
                endorsed: false,
                higlighted: true
            },
            {
                skill: softSkills[2],
                type: "softSkill",
                endorsed: false,
                higlighted: true
            },
            {
                skill: softSkills[3],
                type: "softSkill",
                endorsed: true,
                higlighted: false
            },
        ],
        profilePicture: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        projects: [0, 1, 2],
        links: [
            {text: "discord", url: "https://www.discord.com/"},
            {text: "twitter", url: "https://www.twitter.com/"},
            {text: "itch.io", url: "https://www.itch.io.com/"}
        ],
    },
]

export const messages = [
    {
        _id: 0,
        senderID: 0,
        recipientID: 1,
        sentDate: "",
        messageConent: "hello",
    },
    {
        _id: 1,
        senderID: 1,
        recipientID: 0,
        sentDate: "",
        messageConent: "howdy",
    },
]

export const posts = [
    {
        _id: 0,
        author: 0,
        createdDate: "sample date",
        title: "A great post",
        postText: "hello",
        postImage: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        comments: [0, 3], // unique
    },
    {
        _id: 1,
        author: 0,
        createdDate: "sample date",
        title: "The bestest post",
        postText: "Wassup",
        postImage: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        comments: [4],
    },
    {
        _id: 2,
        author: 1,
        createdDate: "sample date",
        title: "A prettttty cooool project!",
        postText: "Yoooo!",
        postImage: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        comments: [],
    },
]

export const comments = [
    {
        _id: 0,
        author: 0,
        replies: [1], // unique
        createdDate: "",
        content: "",
    },
    {
        _id: 1,
        author: 0,
        replies: [2, 3],
        createdDate: "",
        content: "",
    },
    {
        _id: 2,
        author: 0,
        replies: [],
        createdDate: "",
        content: "",
    },
    {
        _id: 3,
        author: 0,
        replies: [],
        createdDate: "",
        content: "",
    },
    {
        _id: 4,
        author: 0,
        replies: [],
        createdDate: "",
        content: "",
    },
]