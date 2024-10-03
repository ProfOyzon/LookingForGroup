import pool from "../config/database.js";
import { genPlaceholders } from "../utils/sqlUtil.js";
//import { bcrypt } from "";
import bcrypt from "bcrypt";

const getUsers = async (req, res) => {
    // Get all users

    const users = await pool.query(`
        SELECT u.user_id, u.first_name, u.last_name, u.bio, JSON_ARRAYAGG(s.label) AS skills
        FROM users u
            JOIN user_skills us ON u.user_id = us.user_id 
            JOIN skills s ON us.skill_id = s.skill_id 
        GROUP BY u.user_id
        `);
    
    return res.status(200).json({
        status: 200,
        data: users[0]
    });
}

const createUser = async (req, res) => {
    // Create a new project

    // Get input data
    const { username, password, email, firstName, lastName, bio, skills } = req.body

    let hashPass = await bcrypt.hash(password, 10);
    console.log(hashPass);

    // Add user to database and get back its id
    const sql = "INSERT INTO users (username, password, email, first_name, last_name, bio) VALUES (?, ?, ?, ?, ?, ?) RETURNING user_id";
    const values = [username, hashPass, email, firstName, lastName, bio];
    const user = await pool.query(sql, values);
    
    // Get skill ids and add user's skills to database 
    const placeholders = genPlaceholders(skills);
    const skillIds = await pool.query(`SELECT skill_id FROM skills WHERE label IN (${placeholders})`, skills);

    for (let skill of skillIds) {
        await pool.query("INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)", [user[0].user_id, skill.skill_id]);
    }

    return res.sendStatus(201);
}

const getUsersById = async (req, res) => {
    // Get users using id

    // Get id from url 
    const { id } = req.params;

    // Get user data
    const sql = `
        SELECT u.user_id, u.first_name, u.last_name, u.bio, JSON_ARRAYAGG(s.label) AS skills
        FROM users u
            JOIN user_skills us ON u.user_id = us.user_id 
            JOIN skills s ON us.skill_id = s.skill_id
        WHERE u.user_id = ? 
        GROUP BY u.user_id
        `;
    const values = [id];
    const user = await pool.query(sql, values);
    
    return res.status(200).json({
        status: 200,
        data: user[0]
    });
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

const getProjectFollowing = async (req, res) => {
    // Get projects the user is following

    // Get id from url 
    const { id } = req.params;

    // Get user data
    const sql = `SELECT p.* 
	    FROM project_followings pf
	    JOIN (SELECT p.project_id, p.title, p.description, g.genres, t.tags
            FROM projects p
            JOIN (SELECT pg.project_id, JSON_ARRAYAGG(g.label) AS genres 
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
    const user = await pool.query(sql, values);
    
    return res.status(200).json({
        status: 200,
        data: user[0]
    });
}

const addProjectFollowing = async (req, res) => {
    // Add a project the user decided to follow 

    // Get input data
    const { id } = req.params;
    const { projectId } = req.body

    // Add projet following into database
    await pool.query("INSERT INTO project_followings (user_id, project_id) VALUES (?, ?)", [id, projectId]);

    return res.sendStatus(201);
}

const deleteProjectFollowing = async (req, res) => {
    // Delete a project the user was following

    // Get input data
    const { id } = req.params;
    const { projectId } = req.body

    // Remove project following from database
    await pool.query("DELETE FROM project_followings WHERE user_id = ? AND project_id = ?", [id, projectId]);

    return res.sendStatus(204);
}

export { getUsers, createUser, getUsersById, updateUser, addSkill, deleteSkill, 
    getProjectFollowing, addProjectFollowing, deleteProjectFollowing
 };