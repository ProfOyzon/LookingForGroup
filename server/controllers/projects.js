import pool from "../config/database.js"

const getProjects = async (req, res) => {
    const rows = await pool.query("SELECT * FROM projects");
    console.log(rows);
    return res.status(200).json({data: rows})
}

export { getProjects };