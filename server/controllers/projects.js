import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { unlink } from "fs/promises";
import sharp from "sharp";
import pool from "../config/database.js";
import { genPlaceholders } from "../utils/sqlUtil.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getProjects = async (req, res) => {
    // Get all projects
    try {
        const sql = `SELECT p.project_id, p.title, p.description, p.thumbnail, g.project_types, t.tags
            FROM projects p
            JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                FROM project_genres pg 
                JOIN genres g 
                    ON pg.type_id = g.type_id
                GROUP BY pg.project_id) g
            ON p.project_id = g.project_id
            JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label)) AS tags
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
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting all projects" 
        });
    }
}

const createProject = async (req, res) => {
    // Create a new project

    // Get input data
    const { title, description, id, genres, tags, jobs, members} = req.body;

    try {
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
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while creating the project" 
        });
    }
}

const getProjectById = async (req, res) => {
    // Get a project using its id

    // Get id from url 
    const { id } = req.params;

    try {
        // Get project data
        const sql = `SELECT p.project_id, p.title, p.description, p.purpose, p.audience, g.project_types, t.tags, j.jobs, m.members, pi.images
            FROM projects p
            JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                FROM project_genres pg 
                JOIN genres g 
                    ON pg.type_id = g.type_id
                GROUP BY pg.project_id) g
            ON p.project_id = g.project_id
            JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label)) AS tags
                FROM project_tags pt 
                JOIN tags t 
                    ON pt.tag_id = t.tag_id
                GROUP BY pt.project_id) t
            ON p.project_id = t.project_id
            JOIN (SELECT j.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", j.job_id, "job_title", jt.label, "amount", j.amount, 
            "description", j.description)) AS jobs
                FROM jobs j
                JOIN job_titles jt
			        ON j.title_id = jt.title_id
                WHERE j.project_id = ?) j
            ON p.project_id = j.project_id
            JOIN (SELECT m.project_id, JSON_ARRAYAGG(JSON_OBJECT("user_id", m.user_id, "first_name", u.first_name, 
            "last_name", u.last_name, "job_title", jt.label)) AS members
                FROM members m
                JOIN users u 
                    ON m.user_id = u.user_id
                JOIN job_titles jt
				    ON m.title_id = jt.title_id
                WHERE m.project_id = ?) m
            ON p.project_id = m.project_id
            JOIN (SELECT pi.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", pi.image_id, "image", pi.image, "position", pi.position)) AS images
				FROM project_images pi
				WHERE pi.project_id = ?) pi
			ON p.project_id = pi.project_id
            WHERE p.project_id = ?
            `;
        const values = [id, id, id, id];
        const [project] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: project
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting the project" 
        });
    }
}

const updateProject = async (req, res) => {
    // Update a project

    // Get input data
    const { id } = req.params;
    const { title, description} = req.body;

    try {
        // Update database with project's new info
        const sql = "UPDATE projects SET title = ?, description = ? WHERE project_id = ?";
        const values = [title, description, id];
        await pool.query(sql, values);
        
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating the project" 
        });
    }
}

const updateThumbnail = async (req, res) => {
    // Update thumbnail for a project

    // Get id from url
    const { id } = req.params;

    try {
        // Download user's uploaded image. Convert to webp and reduce file size
        const fileName = `${id}thumbnail.webp`;
        const saveTo = join(__dirname, "../images/thumbnails");
        const filePath = join(saveTo, fileName);
        
        await sharp(req.file.buffer).webp({quality: 50}).toFile(filePath);

        // Store file name in database
        const sql = "UPDATE projects SET thumbnail = ? WHERE project_id = ?";
        const values = [fileName, id];
        await pool.query(sql, values);

        return res.sendStatus(204);
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while saving the project's thumbnail" 
        });
    }
}

const addPicture = async (req, res) => {
    // Update picture for a project

    // Get data
    const { id } = req.params;
    const { position } = req.body
    
    try {
        // Download user's uploaded image. Convert to webp and reduce file size
        const fileName = `${id}picture${Date.now()}.webp`;
        const saveTo = join(__dirname, "../images/projects");
        const filePath = join(saveTo, fileName);
        
        await sharp(req.file.buffer).webp({quality: 50}).toFile(filePath);

        // Store file name in database
        const sql = "INSERT INTO project_images (image, position, project_id) VALUES (?, ?, ?)";
        const values = [fileName, Number(position), id];
        await pool.query(sql, values);

        return res.sendStatus(201);
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while saving the project's picture" 
        });
    }
}

const updatePicturePositions = async (req, res) => {
    // Update picture order for a project

    // Get input data
    const { id } = req.params;
    const { images } = req.body;

    try {
        // Update the picture positions for a project
        for (let image of images) {
            const sql = "UPDATE project_images SET position = ? WHERE image_id = ? AND project_id = ?";
            const values = [image.position, image.id, id];
            await pool.query(sql, values);
        }
        
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating the picture order for a project" 
        });
    }
}

const deletePicture = async (req, res) => {
    // Delete picture from a project

    // Get input data
    const { id } = req.params;
    const { image } = req.body;

    try {
        // Remove project's picture from server and database
        const filePath = join(__dirname, "../images/projects/");
        await unlink(filePath + image);

        await pool.query("DELETE FROM project_images WHERE image = ? AND project_id = ?", [image, id]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a project's picture" 
        });

    }
}

const addProjectType = async (req, res) => {
    // Add a project type to a project

    // Get input data
    const { id } = req.params;
    const { typeId } = req.body;

    try {
        await pool.query("INSERT INTO project_genres (project_id, type_id) VALUES (?, ?)", [id, typeId]);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a project's project type" 
        });
    }
}

const deleteProjectType = async (req, res) => {
    // Delete project type from a project

    // Get input data
    const { id } = req.params;
    const { typeId } = req.body;

    try {
        await pool.query("DELETE FROM project_genres WHERE project_id = ? AND type_id = ?", [id, typeId]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a project's project type" 
        });
    }
}

const addTag = async (req, res) => {
    // Add a tag to a project

    // Get input data
    const { id } = req.params;
    const { tagId, position } = req.body;

    try {
        // Add project's tag into database
        await pool.query("INSERT INTO project_tags (project_id, tag_id, position) VALUES (?, ?, ?)", [id, tagId, position]);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a project's tag" 
        });
    }
}

const updateTagPositions = async (req, res) => {
    // Update tag order for a project

    // Get input data 
    const { id } = req.params;
    const { tags } = req.body;

    try {
        for (let tag of tags) {
            const sql = "UPDATE project_tags SET position = ? WHERE project_id = ? AND tag_id = ?";
            const values = [tag.position, id, tag.id];
            await pool.query(sql, values);
        }
        
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating the tag order for a project" 
        });
    }
}

const deleteTag = async (req, res) => {
    // Delete tag from a project

    // Get input data
    const { id } = req.params;
    const { tagId } = req.body;

    try {
        // Remove project's tag from database
        await pool.query("DELETE FROM project_tags WHERE project_id = ? AND tag_id = ?", [id, tagId]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a project's tag" 
        });
    }
}

const addJob = async (req, res) => {
    // Add a job to a project

    // Get input data
    const { id } = req.params;
    const { titleId, amount, description } = req.body;

    try {
        // Add project's job into database
        const sql = "INSERT INTO jobs (title_id, amount, description, project_id) VALUES (?, ?, ?, ?)";
        const values = [titleId, amount, description, id];
        await pool.query(sql, values);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a job to a project" 
        });
    }
}

const updateJob = async (req, res) => {
    // Update a project's job

    // Get input data
    const { id } = req.params;
    const { titleId, amount, description } = req.body;

    try {
        // Update a project's job
        const sql = "UPDATE jobs SET amount = ?, description = ? WHERE title_id = ? AND project_id = ?";
        const values = [amount, description, titleId, id];
        await pool.query(sql, values);
        
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating a project's job" 
        });
    }
}

const deleteJob = async (req, res) => {
    // Delete job from a project

    // Get input data
    const { id } = req.params;
    const { titleId } = req.body;

    try {
        // Remove project's job from database
        await pool.query("DELETE FROM jobs WHERE title_id = ? AND project_id = ?", [titleId, id]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while deleting a project's job" 
        });
    }
}

const addMember = async (req, res) => {
    // Add a member to a project

    // Get input data
    const { id } = req.params;
    const { userId, titleId } = req.body;

    try {
        // Add project's member into database
        const sql = "INSERT INTO members (project_id, user_id, title_id) VALUES (?, ?, ?)";
        const values = [id, userId, titleId];
        await pool.query(sql, values);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a new member to the project" 
        });
    }
}

const updateMember = async (req, res) => {
    // Update a member of a project

    // Get input data
    const { id } = req.params;
    const { userId, titleId } = req.body;

    try {
        // Update a project's job
        const sql = "UPDATE members SET title_id = ? WHERE project_id = ? AND user_id = ?";
        const values = [titleId, id, userId];
        await pool.query(sql, values);
        
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating a project's member" 
        });
    }
}

const deleteMember = async (req, res) => {
    // Delete a member from a project

    // Get input data
    const { id } = req.params;
    const { userId } = req.body;

    try {
        // Remove project's member from database
        await pool.query("DELETE FROM members WHERE project_id = ? AND user_id = ?", [id, userId]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a project's member" 
        });
    }
}

export default { getProjects, createProject, getProjectById, updateProject, 
    updateThumbnail, addPicture, updatePicturePositions, deletePicture,
    addProjectType, deleteProjectType, 
    addTag, updateTagPositions, deleteTag, 
    addJob, updateJob, deleteJob,
    addMember, updateMember, deleteMember
};