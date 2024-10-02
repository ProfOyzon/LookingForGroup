import pool from "../config/database.js";
import { genPlaceholders } from "../utils/sqlUtil.js";

const getProjects = async (req, res) => {
    // Get all projects

    const sql = `SELECT p.project_id, p.title, p.description, g.genres, t.tags
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
        ON p.project_id = t.project_id
        `;
    const [projects] = await pool.query(sql);

    return res.status(200).json({
        status: 200,
        data: projects
    });
}

const createProject = async (req, res) => {
    // Create a new project

    // Get input data
    const { title, description, id, genres, tags, jobs, members} = req.body;

    // Add project to database and get back its id
    const sql = "INSERT INTO projects (title, description, user_id) VALUES (?, ?, ?)";
    const values = [title, description, id];
    await pool.query(sql, values);
    const [projectId] = await pool.query("SELECT project_id FROM projects WHERE title = ? AND user_id = ?", [title, id]);

    // Get genre ids and add project's genres to database
    let placeholders = genPlaceholders(genres);
    const [genreIds] = await pool.query(`SELECT genre_id FROM genres WHERE label IN (${placeholders})`, genres);
    for (let genre of genreIds) {
        await pool.query("INSERT INTO project_genres (project_id, genre_id) VALUES (?, ?)", [projectId[0].project_id, genre.genre_id]);
    }
    
    // Get tag ids and add project's tags to database 
    placeholders = genPlaceholders(tags);
    const [tagIds] = await pool.query(`SELECT tag_id FROM tags WHERE label IN (${placeholders})`, tags);
    for (let tag of tagIds) {
        await pool.query("INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)", [projectId[0].project_id, tag.tag_id]);
    }

    // Add project's jobs to database
    for (let job of jobs) {
        await pool.query("INSERT INTO jobs (role, amount, description, project_id) VALUES (?, ?, ?, ?)", [job.role, job.amount, job.description, projectId[0].project_id])
    }

    // Add project's members to database
    for (let member of members) {
        await pool.query("INSERT INTO members (project_id, user_id, role) VALUES (?, ?, ?)", [projectId[0].project_id, member.userId, member.role]);
    }

    return res.sendStatus(201);
}

const getProjectById = async (req, res) => {
    // Get a project using its id

    // Get id from url 
    const { id } = req.params;

    // Get project data
    const sql = `SELECT p.project_id, p.title, p.description, g.genres, t.tags, j.jobs, m.members
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
        ON p.project_id = t.project_id
        JOIN (SELECT j.project_id, JSON_ARRAYAGG(JSON_OBJECT("role", j.role, "amount", j.amount, "description", j.description)) AS jobs
		    FROM jobs j
		    WHERE j.project_id = ?) j
        ON p.project_id = j.project_id
        JOIN (SELECT m.project_id, JSON_ARRAYAGG(JSON_OBJECT("user_id", m.user_id, "first_name", u.first_name, 
        "last_name", u.last_name, "role", m.role)) AS members
		    FROM members m
            JOIN users u 
				ON m.user_id = u.user_id
		    WHERE m.project_id = ?) m
        ON p.project_id = m.project_id
        WHERE p.project_id = ?
        `;
    const values = [id, id, id];
    const [project] = await pool.query(sql, values);
    
    return res.status(200).json({
        status: 200,
        data: project
    });
}

const updateProject = async (req, res) => {
    // Update a project

    // Get input data
    const { id } = req.params;
    const { title, description} = req.body;

    // Update database with project's new info
    const sql = "UPDATE projects SET title = ?, description = ? WHERE project_id = ?";
    const values = [title, description, id];
    await pool.query(sql, values);
    
    return res.sendStatus(204)
}

const addGenre = async (req, res) => {
    // Add a genre to a project

    // Get input data
    const { id } = req.params;
    const { genre } = req.body;

    // Get genre id and add project's genre into database
    const [genreId] = await pool.query(`SELECT genre_id FROM genres WHERE label = ?`, genre);
    await pool.query("INSERT INTO project_genres (project_id, genre_id) VALUES (?, ?)", [id, genreId[0].genre_id]);

    return res.sendStatus(201);
}

const deleteGenre = async (req, res) => {
    // Delete tag from a project

    // Get input data
    const { id } = req.params;
    const { genre } = req.body;

    // Get genre id and remove project's genre from database
    const [genreId] = await pool.query(`SELECT genre_id FROM genres WHERE label = ?`, genre);
    await pool.query("DELETE FROM project_genres WHERE project_id = ? AND genre_id = ?", [id, genreId[0].genre_id]);

    return res.sendStatus(204);
}

const addTag = async (req, res) => {
    // Add a tag to a project

    // Get input data
    const { id } = req.params;
    const { tag } = req.body;

    // Get tag id and add project's tag into database
    const [tagId] = await pool.query(`SELECT tag_id FROM tags WHERE label = ?`, tag);
    await pool.query("INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)", [id, tagId[0].tag_id]);

    return res.sendStatus(201);
}

const deleteTag = async (req, res) => {
    // Delete tag from a project

    // Get input data
    const { id } = req.params;
    const { tag } = req.body;

    // Get tag id and remove project's tag from database
    const [tagId] = await pool.query(`SELECT tag_id FROM tags WHERE label = ?`, tag);
    await pool.query("DELETE FROM project_tags WHERE project_id = ? AND tag_id = ?", [id, tagId[0].tag_id]);

    return res.sendStatus(204);
}

const addJob = async (req, res) => {
    // Add a job to a project

    // Get input data
    const { id } = req.params;
    const { role, amount, description } = req.body;

    // Add project's job into database
    const sql = "INSERT INTO jobs (role, amount, description, project_id) VALUES (?, ?, ?, ?)";
    const values = [role, amount, description, id];
    await pool.query(sql, values);

    return res.sendStatus(201);
}

const updateJob = async (req, res) => {
    // Update a project's job

    // Get input data
    const { id } = req.params;
    const { role, amount, description } = req.body;

    // Update a project's job
    const sql = "UPDATE jobs SET amount = ?, description = ? WHERE role = ? AND project_id = ?";
    const values = [amount, description, role, id];
    await pool.query(sql, values);
    
    return res.sendStatus(204)
}

const deleteJob = async (req, res) => {
    // Delete job from a project

    // Get input data
    const { id } = req.params;
    const { role } = req.body;

    // Remove project's job from database
    await pool.query("DELETE FROM jobs WHERE role = ? AND project_id = ?", [role, id]);

    return res.sendStatus(204);
}

const addMember = async (req, res) => {
    // Add a member to a project

    // Get input data
    const { id } = req.params;
    const { userId, role } = req.body;

    // Add project's member into database
    const sql = "INSERT INTO members (project_id, user_id, role) VALUES (?, ?, ?)";
    const values = [id, userId, role];
    await pool.query(sql, values);

    return res.sendStatus(201);
}

const updateMember = async (req, res) => {
    // Update a project's job

    // Get input data
    const { id } = req.params;
    const { userId, role } = req.body;

    // Update a project's job
    const sql = "UPDATE members SET role = ? WHERE project_id = ? AND user_id = ?";
    const values = [role, id, userId];
    await pool.query(sql, values);
    
    return res.sendStatus(204)
}

const deleteMember = async (req, res) => {
    // Delete a member from a project

    // Get input data
    const { id } = req.params;
    const { userId } = req.body;

    // Remove project's member from database
    await pool.query("DELETE FROM members WHERE project_id = ? AND user_id = ?", [id, userId]);

    return res.sendStatus(204);
}

export { getProjects, createProject, getProjectById, updateProject, 
    addGenre, deleteGenre, addTag, deleteTag, addJob, updateJob, deleteJob,
    addMember, updateMember, deleteMember
};