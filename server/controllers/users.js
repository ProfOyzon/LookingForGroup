import bcrypt from "bcrypt";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import pool from "../config/database.js";
import { genPlaceholders } from "../utils/sqlUtil.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getUsers = async (req, res) => {
    // Get all users
    try {
        const sql = `SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns, 
        jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, s.skills
            FROM users u
            LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
                FROM job_titles jt) jt
            ON u.job_title_id = jt.title_id
            LEFT JOIN (SELECT m.major_id, m.label AS major
                FROM majors m) m
            ON u.major_id = m.major_id
            LEFT JOIN (SELECT us.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", s.skill_id, "skill", s.label, "type", s.type,
                "position", us.position)) AS skills
                FROM user_skills us 
                JOIN skills s 
                    ON us.skill_id = s.skill_id
                GROUP BY us.user_id) s
            ON u.user_id = s.user_id
        `;
        const [users] = await pool.query(sql);
        
        return res.status(200).json({
            status: 200,
            data: users
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting all users" 
        });
    }
}

const createUser = async (req, res) => {
    // Create a new project

    // Get input data
    const { username, password, email, firstName, lastName, bio, skills } = req.body

    let hashPass = await bcrypt.hash(password, 10);

    // Add user to database and get back its id
    const sql = "INSERT INTO users (username, password, primary_email, rit_email, first_name, last_name, bio) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [username, hashPass, email, email, firstName, lastName, bio];
    await pool.query(sql, values);
    
    // Get skill ids and add user's skills to database 
    /* const placeholders = genPlaceholders(skills);
    const skillIds = await pool.query(`SELECT skill_id FROM skills WHERE label IN (${placeholders})`, skills);

    for (let skill of skillIds) {
        await pool.query("INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)", [user[0].user_id, skill.skill_id]);
    } */

    return res.sendStatus(201);
}

const login = async (req, res) => {
    const { username, password } = req.body;

    console.log("USERNAME IS: " + username);

    const userQuery = "SELECT user_id FROM users WHERE username = ?";
    const [user] = await pool.query(userQuery, [username]);

    console.log(user);
}

const getUserById = async (req, res) => {
    // Get users using id

    // Get id from url 
    const { id } = req.params;

    try {
        // Get user data
        const sql = `SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns, 
            jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, u.bio, s.skills, so.socials
            FROM users u
            LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
                FROM job_titles jt) jt
            ON u.job_title_id = jt.title_id
            LEFT JOIN (SELECT m.major_id, m.label AS major
                FROM majors m) m
            ON u.major_id = m.major_id
            LEFT JOIN (SELECT us.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", s.skill_id, "skill", s.label, "type", s.type,
                "position", us.position)) AS skills
                FROM user_skills us 
                JOIN skills s 
                    ON us.skill_id = s.skill_id
                GROUP BY us.user_id) s
            ON u.user_id = s.user_id
            LEFT JOIN (SELECT uso.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", so.website_id, "website", so.label, "url", uso.url)) AS socials
                FROM user_socials uso 
                JOIN socials so
                    ON uso.website_id = so.website_id
                GROUP BY uso.user_id) so
            ON u.user_id = so.user_id
            WHERE u.user_id = ? 
            `;
        const values = [id];
        const [user] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: user
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting the user" 
        });
    }
}

const getUserByUsername = async (req, res) => {
    // Get user's id by username

    // Get username from url
    const { id } = req.params;

    // Get user data
    //const sql =
}

const updateUser = async (req, res) => {
    // Update a user

    // Get input data
    const { id } = req.params;
    const { firstName, lastName, headline, pronouns, jobTitleId, majorId, 
        academicYear, location, funFact, bio, skills, socials } = req.body

    try {
        // Update database with users's new info
        let sql = `UPDATE users SET first_name = ?, last_name = ?, headline = ?, pronouns = ?, job_title_id = ?,
        major_id = ?, academic_year = ?, location = ?, fun_fact = ?, bio = ? WHERE user_id = ?`;
        let values = [firstName, lastName, headline, pronouns, jobTitleId, majorId, academicYear, location, funFact, bio, id];
        await pool.query(sql, values);

        // ----- UPDATE USER'S SKILLS -----
        // Create array from skills
        const newSkills = skills.map((skill) => skill.id);
        // Get skills already in database that need to be removed
        let placeholders = genPlaceholders(newSkills);
        sql = `SELECT JSON_ARRAYAGG(us.skill_id) AS skills FROM user_skills us 
        WHERE us.user_id = ? AND NOT us.skill_id IN (${placeholders})`;
        values = [id, ...newSkills];
        const [removingSkills] = await pool.query(sql, values);
        // Remove skills if any were found
        if (removingSkills[0].skills) {
            placeholders = genPlaceholders(removingSkills[0].skills);
            sql = `DELETE FROM user_skills WHERE user_id = ? AND skill_id IN (${placeholders})`;
            values = [id, ...removingSkills[0].skills];
            await pool.query(sql, values);
        }
        // Add new skills or update if already in database
        sql = `INSERT INTO user_skills (user_id, skill_id, position) VALUES (?, ?, ?) AS new
        ON DUPLICATE KEY UPDATE user_id = new.user_id, skill_id = new.skill_id, position = new.position`
        for (let skill of skills) {
            await pool.query(sql, [id, skill.id, skill.position]);
        }

        // ----- UPDATE USER'S SOCIALS -----
        // Create array from socials
        const newSocials = socials.map((social) => social.id);
        // Add 0 if empty to allow sql statement to still find exisiting data to be removed
        if (newSocials.length === 0) {
            newSocials.push(0);
        }
        // Get socials already in database that need to be removed
        placeholders = genPlaceholders(newSocials);
        sql = `SELECT JSON_ARRAYAGG(uso.website_id) AS socials FROM user_socials uso 
        WHERE uso.user_id = ? AND NOT uso.website_id IN (${placeholders})`;
        values = [id, ...newSocials];
        const [removingSocials] = await pool.query(sql, values);
        // Remove socials if any were found
        if (removingSocials[0].socials) {
            placeholders = genPlaceholders(removingSocials[0].socials);
            sql = `DELETE FROM user_socials WHERE user_id = ? AND website_id IN (${placeholders})`;
            values = [id, ...removingSocials[0].socials];
            await pool.query(sql, values);
        }
        // Add new socials or update if already in database
        sql = `INSERT INTO user_socials (user_id, website_id, url) VALUES (?, ?, ?) AS new
        ON DUPLICATE KEY UPDATE user_id = new.user_id, website_id = new.website_id, url = new.url`
        for (let social of socials) {
            await pool.query(sql, [id, social.id, social.url]);
        }
        
        return res.sendStatus(204)
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating the user's profile" 
        });
    }
}

const updateProfilePicture = async (req, res) => {
    // Update profile picture for a user

    // Get id from url
    const { id } = req.params;

    try {
        // Download user's uploaded image. Convert to webp and reduce file size
        const fileName = `${id}profile.webp`;
        const saveTo = join(__dirname, "../images/profiles");
        const filePath = join(saveTo, fileName);
        
        await sharp(req.file.buffer).webp({quality: 50}).toFile(filePath);

        // Store file name in database
        const sql = "UPDATE users SET profile_image = ? WHERE user_id = ?";
        const values = [fileName, id];
        await pool.query(sql, values);

        return res.status(201).json({
            status: 201,
            data: [{profile_image: fileName}]
        });
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while saving the profile picture" 
        });
    }
}

const addSkill = async (req, res) => {
    // Add a skill to a user

    // Get input data
    const { id } = req.params;
    const { skillId, position } = req.body

    try {
        await pool.query("INSERT INTO user_skills (user_id, skill_id, position) VALUES (?, ?, ?)", [id, skillId, position]);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a new skill for the user" 
        });
    }
}

const updateSkillPositions = async (req, res) => {
    // Update skill order for a user

    // Get input data 
    const { id } = req.params;
    const { skills } = req.body;

    try {
        for (let skill of skills) {
            const sql = "UPDATE user_skills SET position = ? WHERE user_id = ? AND skill_id = ?";
            const values = [skill.position, id, skill.id];
            await pool.query(sql, values);
        }
        
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating the skill order for a user" 
        });
    }
}

const deleteSkill = async (req, res) => {
    // Delete skill from a user

    // Get input data
    const { id } = req.params;
    const { skillId } = req.body

    try {
        // Remove user's skill from database
        await pool.query("DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?", [id, skillId]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a skill from the user" 
        });
    }
}

const getMyProjects = async (req, res) => {
    // Get projects the user is a member of

    // Get id from url 
    const { id } = req.params;

    try {
        // Get projects' data
        const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ?
            `;
        const values = [id];
        const [projects] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: projects
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting projects the user is a member of" 
        });
    }
}

const getVisibleProjects = async (req, res) => {
    // Get projects the user is a member and is set to be publicly visible

    // Get id from url 
    const { id } = req.params;

    try {
        // Get projects' data
        const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ? AND profile_visibility = "public"
            `;
        const values = [id];
        const [projects] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: projects
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting projects the user is a member of and that are publicly visible" 
        });
    }
}

const updateProjectVisibility = async (req, res) => {
    // Update profile visibility on projects the user is a member of

    // Get input data 
    const { id } = req.params;
    const { projectId, visibility } = req.body;

    try {
        // Update a project visibility on user profiles
        const sql = "UPDATE members SET profile_visibility = ? WHERE project_id = ? AND user_id = ?";
        const values = [visibility, projectId, id];
        await pool.query(sql, values);
        
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while updating the visibility of a project on a user's profile" 
        });
    }
}

const getProjectFollowing = async (req, res) => {
    // Get projects the user is following

    // Get id from url 
    const { id } = req.params;

    try {
        // Get user data
        const sql = `SELECT p.* 
            FROM project_followings pf
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON pf.project_id = p.project_id
            WHERE pf.user_id = ?
            `;
        const values = [id];
        const [projects] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: projects
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting projects the user is following" 
        });
    }
}

const addProjectFollowing = async (req, res) => {
    // Add a project the user decided to follow 

    // Get input data
    const { id } = req.params;
    const { projectId } = req.body

    try {
        // Add projet following into database
        await pool.query("INSERT INTO project_followings (user_id, project_id) VALUES (?, ?)", [id, projectId]);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a project the user wants to follow" 
        });
    }
}

const deleteProjectFollowing = async (req, res) => {
    // Delete a project the user was following

    // Get input data
    const { id } = req.params;
    const { projectId } = req.body

    try {
        // Remove project following from database
        await pool.query("DELETE FROM project_followings WHERE user_id = ? AND project_id = ?", [id, projectId]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a project the user wants to unfollow" 
        });
    }
}

const getUserFollowing = async (req, res) => {
    // Get people the user is following

    // Get id from url 
    const { id } = req.params;

    try {
        // Get user data
        const sql = `SELECT u.* 
            FROM user_followings uf
            JOIN (SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns, 
            jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, s.skills
                FROM users u
                    LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
                    FROM job_titles jt) jt
                        ON u.job_title_id = jt.title_id
                    LEFT JOIN (SELECT m.major_id, m.label AS major
                    FROM majors m) m
                        ON u.major_id = m.major_id
                    LEFT JOIN (SELECT us.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", s.skill_id, "skill", s.label, "type", s.type,
                        "position", us.position)) AS skills
                        FROM user_skills us 
                        JOIN skills s 
                            ON us.skill_id = s.skill_id
                        GROUP BY us.user_id) s
                    ON u.user_id = s.user_id
                GROUP BY u.user_id) u
            ON uf.following_id = u.user_id
            WHERE uf.user_id = ?
        `;
        const values = [id];
        const [users] = await pool.query(sql, values);
        
        return res.status(200).json({
            status: 200,
            data: users
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while getting people the user is following" 
        });
    }
}

const addUserFollowing = async (req, res) => {
    // Add the person the user decided to follow 

    // Get input data
    const { id } = req.params;
    const { userId } = req.body

    try {
        // Add user following into database
        await pool.query("INSERT INTO user_followings (user_id, following_id) VALUES (?, ?)", [id, userId]);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while adding a person the user wants to follow" 
        });
    }
}

const deleteUserFollowing = async (req, res) => {
    // Delete the person the user was following

    // Get input data
    const { id } = req.params;
    const { userId } = req.body

    try {
        // Remove user following from database
        await pool.query("DELETE FROM user_followings WHERE user_id = ? AND following_id = ?", [id, userId]);

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            error: "An error occurred while removing a person the user wants to unfollow" 
        });
    }
}

export default { getUsers, createUser, getUserById, getUserByUsername, login, updateUser, updateProfilePicture, 
    addSkill, updateSkillPositions, deleteSkill, 
    getMyProjects, getVisibleProjects, updateProjectVisibility, 
    getProjectFollowing, addProjectFollowing, deleteProjectFollowing, 
    getUserFollowing, addUserFollowing, deleteUserFollowing
};