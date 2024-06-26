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
            {
                userID: 3,
                admin: true,
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
    {
        _id: 1,
        name: "Rock Eater 9000",
        members: [
            {
                userID: 3,
                admin: true,
                owner: true,
                role: "Project Lead"
            },
            {
                userID: 1,
                admin: false,
                owner: false,
                role: "Developer"
            },
        ],
        description: "Shoveling rocks in my mouth like its Christmas morning. Yum!",
        tags: ["Rock", "Cooking", "Birthday", "Dirt"],
        neededRoles: [
            {
                Role: "Rock Enthusiast",
                amount: 2,
                description: "Must love rocks",
            },
            {
                Role: "Artist",
                amount: 3,
                description: "We are looking for artists who know how to draw rocks",
            }
        ],
        posts: [0, 1, 2]
    },
    {
        _id: 2,
        name: "Minerraria",
        members: [
            {
                userID: 0,
                admin: true,
                owner: true,
                role: "Project Lead"
            },
            {
                userID: 2,
                admin: true,
                owner: false,
                role: "Team Lead"
            },
            {
                userID: 3,
                admin: false,
                owner: false,
                role: "Developer"
            },
        ],
        description: "An epic combination of Minecraft and Terraria. Better than both combined. Please dont sue me.",
        tags: ["2.5D", "Sandbox", "Adventure", "So Retro"],
        neededRoles: [
            {
                Role: "Project Manager",
                amount: 2,
                description: "We are very disorganized",
            },
            {
                Role: "3D Artist",
                amount: 3,
                description: "We are looking for artists who know how to model creepers",
            }
        ],
        posts: [0, 1, 2]
    },
    {
        _id: 3,
        name: "Wario Game",
        members: [
            {
                userID: 1,
                admin: true,
                owner: true,
                role: "Project Lead"
            }
        ],
        description: "WAAAAAAAAAAAAAAH! Suck on that, Mario",
        tags: ["Wah", "Waah", "Waaah", "Waaaah"],
        neededRoles: [
            {
                Role: "Wario Lover",
                amount: 2,
                description: "wah",
            },
            {
                Role: "Garlic Farmer",
                amount: 3,
                description: "We need more garlic",
            }
        ],
        posts: [0, 1, 2]
    },
    {
        _id: 4,
        name: "Boring Project",
        members: [
            {
                userID: 2,
                admin: true,
                owner: true,
                role: "Project Lead"
            }
        ],
        description: "Blah Blah Blah",
        tags: ["Wah", "Waah", "Waaah", "Waaaah"],
        neededRoles: [
            {
                Role: "Data Analyst",
                amount: 2,
                description: "Blah Blah Blah",
            },
            {
                Role: "Productivity Specialist",
                amount: 3,
                description: "Blah Blah Blah",
            },
            {
                Role: "Buisnessperson",
                amount: 3,
                description: "Blah Blah Blah",
            }
        ],
        posts: [0, 1, 2]
    },
    {
        _id: 5,
        name: "Class Project",
        members: [
            {
                userID: 0,
                admin: true,
                owner: true,
                role: "Project Lead"
            }
        ],
        description: "Hey guys I need help on my class project I want an A",
        tags: ["Class Project"],
        neededRoles: [
            {
                Role: "Game Developer",
                amount: 2,
                description: "We are looking for game developers familiar with Unreal Engine 5",
            },
            {
                Role: "Artist",
                amount: 3,
                description: "We are looking for artists who know how to draw my classmates",
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
                higlighted: true,
                endorsements: []
            },
            {
                skill: softSkills[1],
                type: "softSkill",
                endorsed: true,
                higlighted: true,
                endorsements: [ 
                    {   endorsement: "hes really good at it",
                        endorser: "Wario Wario",
                        endorseProject:"Cool Project"
                    },
                    {   endorsement: "his greatest skill",
                        endorser: "Jane Doe",
                        endorseProject:"Boring Project"
                    }
                ]
            },
            {
                skill: softSkills[2],
                type: "softSkill",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
            {
                skill: softSkills[3],
                type: "softSkill",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
            {
                skill: hardSkills[0],
                type: "hardSkill",
                endorsed: false,
                higlighted: true,
                endorsements: []
            },
            {
                skill: hardSkills[1],
                type: "hardSkill",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
            {
                skill: hardSkills[2],
                type: "hardSkill",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
            {
                skill: proficiencies[0],
                type: "proficiency",
                endorsed: true,
                higlighted: false,
                endorsements: [ 
                    {
                        endorsement: "he saved our project",
                        endorser: "Bob the Builder",
                        endorseProject:"Cool Project #2"
                    }
                ]
            },
            {
                skill: proficiencies[1],
                type: "proficiency",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
        ],
        profilePicture: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        projects: [0, 2, 5],
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
                skill: softSkills[0],
                type: "softSkill",
                endorsed: false,
                higlighted: true,
                endorsements: []
            },
            {
                skill: softSkills[1],
                type: "softSkill",
                endorsed: true,
                higlighted: true,
                endorsements: [ 
                    {   endorsement: "The best WAAH-er around",
                        endorser: "Waluigi",
                        endorseProject:"Cool Project"
                    }
                ]
            },
            {
                skill: softSkills[7],
                type: "softSkill",
                endorsed: false,
                higlighted: false,
                endorsements: [
                    {   endorsement: "smells like garlic",
                        endorser: "Mario",
                        endorseProject:"Boring Project"
                    }
                ]
            },
            {
                skill: softSkills[18],
                type: "softSkill",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
            {
                skill: hardSkills[6],
                type: "hardSkill",
                endorsed: false,
                higlighted: true,
                endorsements: [
                    {   endorsement: "blblblblblblblblblb",
                        endorser: "Yoshi",
                        endorseProject:"Mushroom Project"
                    }
                ]
            },
            {
                skill: hardSkills[4],
                type: "hardSkill",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
            {
                skill: proficiencies[8],
                type: "proficiency",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
            {
                skill: proficiencies[6],
                type: "proficiency",
                endorsed: true,
                higlighted: false,
                endorsements: [ 
                    {
                        endorsement: "killed my brother",
                        endorser: "luigi",
                        endorseProject:"Cool Project #2"
                    }
                ]
            },
            {
                skill: proficiencies[15],
                type: "proficiency",
                endorsed: false,
                higlighted: false,
                endorsements: []
            },
        ],
        profilePicture: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        projects: [0, 1, 3],
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
                higlighted: true,
                endorsements: []
            },
            {
                skill: hardSkills[1],
                type: "hardSkill",
                endorsed: false,
                higlighted: true,
                endorsements: []
            },
            {
                skill: proficiencies[2],
                type: "proficiency",
                endorsed: false,
                higlighted: true,
                endorsements: []
            },
        ],
        profilePicture: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        projects: [0, 2, 4],
        links: [
            {text: "discord", url: "https://www.discord.com/"},
            {text: "twitter", url: "https://www.twitter.com/"},
            {text: "itch.io", url: "https://www.itch.io.com/"}
        ],
    },
    {
        _id: 3,
        name: "Bob the Builder",
        username: "ILoveBuilding",
        pronouns: ["He", "They"],
        bio: "Bob the Builder is a British animated children's television series created by Keith Chapman for HIT Entertainment and Hot Animation. The series follows the adventures of Bob, a general contractor, specialising in masonry, along with his colleague Wendy, various neighbours, and friends, and equipment, and their gang of anthropomorphised work-vehicles, Scoop, Muck, Dizzy, Roley, Lofty and many others. The series ran from 12 April 1999 to 31 December 20",
        preferences: {
            projectPreference: "Construction Games",
            rolePreference: "Construction please",
            availability: "All day"
        },
        messages: [],
        skills: [
            {
                skill: softSkills[7],
                type: "softSkill",
                endorsed: false,
                higlighted: true,
                endorsements: []
            },
            {
                skill: hardSkills[3],
                type: "hardSkill",
                endorsed: false,
                higlighted: true,
                endorsements: []
            },
            {
                skill: proficiencies[8],
                type: "proficiency",
                endorsed: false,
                higlighted: true,
                endorsements: []
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
        sentDate: "10/10/10",
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
        title: "A cool post",
        postText: "welcome to the coolest project of all time",
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
        title: "a cooler post",
        postText: "development is going great! our team rocks",
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
        title: "help",
        postText: "can you go to the hospital from eating rocks",
        postImage: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        comments: [],
    },
    {
        _id: 3,
        author: 1,
        createdDate: "sample date",
        title: "WAAH",
        postText: "wah",
        postImage: {
            name: "image1",
            data: "",
            mimeType: "",
        },
        comments: [],
    },
    {
        _id: 4,
        author: 0,
        createdDate: "sample date",
        title: "guys please join",
        postText: "i'm going to fail",
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