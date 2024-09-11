import pool from "../config/database.js"

const getProjects = async (req, res) => {
    // Get all projects

    // Get data
    const rows = await pool.query("SELECT * FROM projects");
    
    return res.status(200).json({
        status: 200,
        data: rows
    });
}

const createProject = async (req, res) => {
    // Create a new project

    // Get input data
    const { title, description, id } = req.body

    // Add entry to database 
    const sql = "INSERT INTO projects (title, description, user_id) VALUES (?, ?, ?)";
    const values = [title, description, id];
    await pool.query(sql, values);

    return res.sendStatus(201);
}

const getProjectById = async (req, res) => {
    // Get projects using its id

    // Get id from url 
    const { id } = req.params;

    // Get data
    const sql = "SELECT * FROM projects WHERE project_id = ?";
    const values = [id];
    const rows = await pool.query(sql, values);
    
    return res.status(200).json({
        status: 200,
        data: rows
    });
}


export { getProjects, createProject, getProjectById };