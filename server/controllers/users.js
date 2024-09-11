import pool from "../config/database.js"

const getUsers = async (req, res) => {
    // Get all users

    // Get data
    const rows = await pool.query("SELECT * FROM users");
    
    return res.status(200).json({
        status: 200,
        data: rows
    });
}

const createUser = async (req, res) => {
    // Create a new project

    // Get input data
    const { firstName, lastName, bio } = req.body

    // Add entry to database 
    const sql = "INSERT INTO users (first_name, last_name, bio) VALUES (?, ?, ?)";
    const values = [firstName, lastName, bio];
    await pool.query(sql, values);

    return res.sendStatus(201);
}

const getUsersById = async (req, res) => {
    // Get users using id

    // Get id from url 
    const { id } = req.params;

    // Get data
    const sql = "SELECT * FROM users WHERE user_id = ?";
    const values = [id];
    const rows = await pool.query(sql, values);
    
    return res.status(200).json({
        status: 200,
        data: rows
    });
}

export { getUsers, createUser, getUsersById };