import pool from "../config/database.js";
import { genPlaceholders } from "../utils/sqlUtil.js";

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
        data: users
    });
}

const createUser = async (req, res) => {
    // Create a new project

    // Get input data
    const { firstName, lastName, bio, skills } = req.body

    // Add user to database and get back its id
    const sql = "INSERT INTO users (first_name, last_name, bio) VALUES (?, ?, ?) RETURNING user_id";
    const values = [firstName, lastName, bio];
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
    const rows = await pool.query(sql, values);
    
    return res.status(200).json({
        status: 200,
        data: rows
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

export { getUsers, createUser, getUsersById, updateUser, addSkill, deleteSkill };