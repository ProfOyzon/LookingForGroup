import pool from "../config/database.js"

const getProjects = async (req, res) => {
    const rows = await pool.query("SELECT * FROM projects");
    
    return res.status(200).json({
        status: 200,
        data: rows
    });
}

const getProjectById = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM projects WHERE project_id = ?";
    const values = [id];
    const rows = await pool.query(sql, values);
    
    return res.status(200).json({
        status: 200,
        data: rows
    });
}

export { getProjects, getProjectById };