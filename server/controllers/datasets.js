import pool from "../config/database.js";

const getSkills = async (req, res) => {
    // Get all skills

    const { type } = req.query;

    try {
        // Get skills of specfic type when the "type" query parameter is given
        if (type) {
            const sql = `SELECT * FROM skills WHERE type = ?`;
            const [skills] = await pool.query(sql, [type]);

            return res.status(200).json({
                status: 200,
                data: skills
            });
        }

        const sql = `SELECT * FROM skills`;
        const [skills] = await pool.query(sql);

        return res.status(200).json({
            status: 200,
            data: skills
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting the specified skills set" 
        });
    }
}

const getTags = async (req, res) => {
    // Get all tags

    const { type } = req.query;

    try {
        // Get tags of specfic type when the "type" query parameter is given
        if (type) {
            const sql = `SELECT * FROM tags WHERE type = ?`;
            const [tags] = await pool.query(sql, [type]);

            return res.status(200).json({
                status: 200,
                data: tags
            });
        }

        const sql = `SELECT * FROM tags`;
        const [tags] = await pool.query(sql);

        return res.status(200).json({
            status: 200,
            data: tags
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting the specified tags set" 
        });
    }
}

const getJobTitles = async (req, res) => {
    // Get all job titles

    try {
        const sql = `SELECT * FROM job_titles`;
        const [jobTitles] = await pool.query(sql);

        return res.status(200).json({
            status: 200,
            data: jobTitles
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting the job titles set" 
        });
    }
}

const getMajors = async (req, res) => {
    // Get all majors

    try {
        const sql = `SELECT * FROM majors`;
        const [majors] = await pool.query(sql);

        return res.status(200).json({
            status: 200,
            data: majors
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting the majors set" 
        });
    }
}

const getProjectTypes = async (req, res) => {
    // Get all project types

    try {
        const sql = `SELECT * FROM genres`;
        const [projectTypes] = await pool.query(sql);

        return res.status(200).json({
            status: 200,
            data: projectTypes
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting the project types set" 
        });
    }
}

const getSocials = async (req, res) => {
    // Get all project types

    try {
        const sql = `SELECT * FROM socials`;
        const [socials] = await pool.query(sql);

        return res.status(200).json({
            status: 200,
            data: socials
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting the websites set" 
        });
    }
}

export default { getSkills, getTags, getJobTitles, getMajors, getProjectTypes, getSocials };