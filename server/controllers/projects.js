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
    // Get a project using its id

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

const updateProjectById = async (req, res) => {
    // Update a project

    // Get id from url 
    const { id } = req.params;
    const { title, description} = req.body

    // Update database with project's new info
    const sql = "UPDATE projects SET title = ?, description = ? WHERE project_id = ?";
    const values = [title, description, id];
    await pool.query(sql, values);
    
    return res.sendStatus(204)
}

export { getProjects, createProject, getProjectById, updateProjectById };