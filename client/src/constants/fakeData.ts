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
        tags: ["Game Development", "Roguelike", "FPS", "So Retro"],
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
        posts: [0]
    },
    {
        _id: 2,
        name: "Minerraria",
        members: [
            {
                userID: 0,
                admin: true,
                owner: true,
                role: "Coder"
            },
            {
                userID: 2,
                admin: true,
                owner: false,
                role: "Project Lead"
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
        posts: [0, 2]
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
        posts: [0, 1]
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
        tags: ["Boring", "BlahBlahBlah", "abc", "12345"],
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
        posts: [1, 2]
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
        description: "Hey guys I need help on my class project I'm gonna fail",
        tags: ["Class Project", "pls help", "idk"],
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
        posts: []
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
                        endorserID: "1",
                        endorseProjectID:"0"
                    },
                    {   endorsement: "his greatest skill",
                        endorserID: "2",
                        endorseProjectID:"2"
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
                        endorserID: "3",
                        endorseProjectID:"2"
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
                        endorserID: "0",
                        endorseProjectID:"0"
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
                        endorser: "3",
                        endorseProject:"1"
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
                    {   endorsement: "she's cool",
                        endorser: "0",
                        endorseProject:"3"
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
                        endorsement: "waa'd all over thos guys",
                        endorserID: "2",
                        endorseProjectID:"0"
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
        messageContent: "hello",
    },
    {
        _id: 1,
        senderID: 1,
        recipientID: 0,
        sentDate: "1/1/1",
        messageContent: "howdy",
    },
    {
        _id: 2,
        senderID: 1,
        recipientID: 0,
        sentDate: "2/2/2",
        messageContent: "wah amirite",
    },
    {
        _id: 3,
        senderID: 1,
        recipientID: 2,
        sentDate: "1/1/1",
        messageContent: "hey princess",
    },
    {
        _id: 4,
        senderID: 2,
        recipientID: 1,
        sentDate: "1/1/1",
        messageContent: "leave me alone",
    },
    {
        _id: 3,
        senderID: 3,
        recipientID: 0,
        sentDate: "1/1/1",
        messageContent: "i LOVE building",
    },
    {
        _id: 3,
        senderID: 3,
        recipientID: 1,
        sentDate: "1/1/1",
        messageContent: "i LOVE building",
    },
    {
        _id: 3,
        senderID: 3,
        recipientID: 2,
        sentDate: "1/1/1",
        messageContent: "i LOVE building",
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
        createdDate: "1",
        content: "bleh",
    },
    {
        _id: 1,
        author: 0,
        replies: [2, 5],
        createdDate: "2",
        content: "blah",
    },
    {
        _id: 2,
        author: 0,
        replies: [],
        createdDate: "3",
        content: "bluh",
    },
    {
        _id: 3,
        author: 0,
        replies: [],
        createdDate: "4",
        content: "blih",
    },
    {
        _id: 4,
        author: 0,
        replies: [],
        createdDate: "5",
        content: "bloh",
    },
    {
        _id: 5,
        author: 1,
        replies: [],
        createdDate: "6",
        content: "bleh ultimate",
    }
]