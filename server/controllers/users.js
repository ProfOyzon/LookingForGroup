import bcrypt from "bcrypt";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import pool from "../config/database.js";
import { genPlaceholders } from "../utils/sqlUtil.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getUsers = async (req, res) => {
    // Get all users

    const [users] = await pool.query(`SELECT u.user_id, u.first_name, u.last_name, u.bio, s.skills
        FROM users u
        JOIN (SELECT us.user_id, JSON_ARRAYAGG(s.label) AS skills
            FROM user_skills us 
            JOIN skills s 
                ON us.skill_id = s.skill_id
            GROUP BY us.user_id) s
		ON u.user_id = s.user_id
        `);
    
    return res.status(200).json({
        status: 200,
        data: users
    });
}

const createUser = async (req, res) => {
    // Create a new project

    // Get input data
    const { username, password, email, firstName, lastName, bio, skills } = req.body

    let hashPass = await bcrypt.hash(password, 10);

    // Add user to database and get back its id
    const sql = "INSERT INTO users (username, password, primary_email, rit_email, first_name, last_name, bio) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [username, hashPass, email, email, firstName, lastName, bio];
    await pool.query(sql, values);
    
    // Get skill ids and add user's skills to database 
    /* const placeholders = genPlaceholders(skills);
    const skillIds = await pool.query(`SELECT skill_id FROM skills WHERE label IN (${placeholders})`, skills);

    for (let skill of skillIds) {
        await pool.query("INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)", [user[0].user_id, skill.skill_id]);
    } */

    return res.sendStatus(201);
}

const login = async (req, res) => {
    const { username, password } = req.body;

    console.log("USERNAME IS: " + username);

    const userQuery = "SELECT * FROM users WHERE username = ?";
    const [user] = await pool.query(userQuery, [username]);

    console.log("I FOUND THE USER, IT'S: " + user);
}

const getUsersById = async (req, res) => {
    // Get users using id

    // Get id from url 
    const { id } = req.params;

    // Get user data
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.bio, s.skills
        FROM users u
        JOIN (SELECT us.user_id, JSON_ARRAYAGG(s.label) AS skills
            FROM user_skills us 
            JOIN skills s 
                ON us.skill_id = s.skill_id
            GROUP BY us.user_id) s
		ON u.user_id = s.user_id
        WHERE u.user_id = ? 
        `;
    const values = [id];
    const [user] = await pool.query(sql, values);
    
    return res.status(200).json({
        status: 200,
        data: user
    });
}

const getUserByUsername = async (req, res) => {
    // Get user's id by username

    // Get username from url
    const { id } = req.params;

    // Get user data
    //const sql =
}

const updateUser = async (req, res) => {
    // Update a user

    // Get input data
    const { id } = req.params;
    const { firstName, lastName, bio } = req.body

    // Update database with users's new info
    const sql = "UPDATE users SET first_name = ?, last_name = ?, bio = ? WHERE user_id = ?";
    const values = [firstName, lastName, bio, id];
    await pool.query(sql, values);
    
    return res.sendStatus(204)
}

const updateProfilePicture = async (req, res) => {
    // Update profile picture for a user

    // Get id from url
    const { id } = req.params;

    try {
        // Download user's uploaded image. Convert to webp and reduce file size
        const fileName = `${id}profile.webp`;
        const saveTo = join(__dirname, "../images/profiles");
        const filePath = join(saveTo, fileName);
        
        await sharp(req.file.buffer).webp({quality: 50}).toFile(filePath);

        // Store file name in database
        const sql = "UPDATE users SET profile_image = ? WHERE user_id = ?";
        const values = [fileName, id];
        await pool.query(sql, values);

        return res.sendStatus(204);
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while saving the profile picture" 
        });
    }
}

const addSkill = async (req, res) => {
    // Add a skill to a user

    // Get input data
    const { id } = req.params;
    const { skill } = req.body

    // Get skill id and add user's skill into database
    const skillId = await pool.query(`SELECT skill_id FROM skills WHERE label = ?`, skill);
    await pool.query("INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)", [id, skillId[0].skill_id]);

    return res.sendStatus(201);
}

const deleteSkill = async (req, res) => {
    // Delete skill from a user

    // Get input data
    const { id } = req.params;
    const { skill } = req.body

    // Get skill id and remove user's skill from database
    const skillId = await pool.query(`SELECT skill_id FROM skills WHERE label = ?`, skill);
    await pool.query("DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?", [id, skillId[0].skill_id]);

    return res.sendStatus(204);
}

const getMyProjects = async (req, res) => {
    // Get projects the user is a member of

    // Get id from url 
    const { id } = req.params;

    try {
        // Get projects' data
        const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.description, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(g.label) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.genre_id = g.genre_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(t.label) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ?
            `;
        const values = [id];
        const [projects] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: projects
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting projects the user is a member of" 
        });
    }
}

const getVisibleProjects = async (req, res) => {
    // Get projects the user is a member and is set to be publicly visible

    // Get id from url 
    const { id } = req.params;

    try {
        // Get projects' data
        const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.description, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(g.label) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.genre_id = g.genre_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(t.label) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ? AND profile_visibility = "public"
            `;
        const values = [id];
        const [projects] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: projects
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting projects the user is a member of and that are publicly visible" 
        });
    }
}

const updateProjectVisibility = async (req, res) => {
    // Update profile visibility on projects the user is a member of

    // Get input data 
    const { id } = req.params;
    const { projectId, visibility } = req.body;

    try {
        // Update a project visibility on user profiles
        const sql = "UPDATE members SET profile_visibility = ? WHERE project_id = ? AND user_id = ?";
        const values = [visibility, projectId, id];
        await pool.query(sql, values);
        
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating the visibility of a project on a user's profile" 
        });
    }
}

const getProjectFollowing = async (req, res) => {
    // Get projects the user is following

    // Get id from url 
    const { id } = req.params;

    try {
        // Get user data
        const sql = `SELECT p.* 
            FROM project_followings pf
            JOIN (SELECT p.project_id, p.title, p.description, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(g.label) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.genre_id = g.genre_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(t.label) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON pf.project_id = p.project_id
            WHERE pf.user_id = ?
            `;
        const values = [id];
        const [projects] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: projects
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting projects the user is following" 
        });
    }
}

const addProjectFollowing = async (req, res) => {
    // Add a project the user decided to follow 

    // Get input data
    const { id } = req.params;
    const { projectId } = req.body

    try {
        // Add projet following into database
        await pool.query("INSERT INTO project_followings (user_id, project_id) VALUES (?, ?)", [id, projectId]);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a project the user wants to follow" 
        });
    }
}

const deleteProjectFollowing = async (req, res) => {
    // Delete a project the user was following

    // Get input data
    const { id } = req.params;
    const { projectId } = req.body

    try {
        // Remove project following from database
        await pool.query("DELETE FROM project_followings WHERE user_id = ? AND project_id = ?", [id, projectId]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a project the user wants to unfollow" 
        });
    }
}

const getUserFollowing = async (req, res) => {
    // Get people the user is following

    // Get id from url 
    const { id } = req.params;

    try {
        // Get user data
        const sql = `SELECT u.* 
            FROM user_followings uf
            JOIN (SELECT u.user_id, u.first_name, u.last_name, u.bio, JSON_ARRAYAGG(s.label) AS skills
                FROM users u
                    JOIN user_skills us ON u.user_id = us.user_id 
                    JOIN skills s ON us.skill_id = s.skill_id 
                GROUP BY u.user_id) u
            ON uf.following_id = u.user_id
            WHERE uf.user_id = ?
            `;
        const values = [id];
        const [users] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: users
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting people the user is following" 
        });
    }
}

const addUserFollowing = async (req, res) => {
    // Add the person the user decided to follow 

    // Get input data
    const { id } = req.params;
    const { userId } = req.body

    try {
        // Add user following into database
        await pool.query("INSERT INTO user_followings (user_id, following_id) VALUES (?, ?)", [id, userId]);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a person the user wants to follow" 
        });
    }
}

const deleteUserFollowing = async (req, res) => {
    // Delete the person the user was following

    // Get input data
    const { id } = req.params;
    const { userId } = req.body

    try {
        // Remove user following from database
        await pool.query("DELETE FROM user_followings WHERE user_id = ? AND following_id = ?", [id, userId]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a person the user wants to unfollow" 
        });
    }
}

export { getUsers, createUser, getUsersById, getUserByUsername, login, updateUser, updateProfilePicture, addSkill, deleteSkill, 
    getMyProjects, getVisibleProjects, updateProjectVisibility, 
    getProjectFollowing, addProjectFollowing, deleteProjectFollowing, 
    getUserFollowing, addUserFollowing, deleteUserFollowing
 };