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

export default { getSkills
};