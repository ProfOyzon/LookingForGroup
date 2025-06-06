import express from 'express';
import { join } from 'path';
import { unlink } from 'fs/promises';
import sharp from 'sharp';
import pool from '../config/database.js';
import { genPlaceholders } from '../utils/sqlUtil.js';

const dirname = import.meta.dirname;

/**
 * Get all project through request
 * @param {express.Request} req - request  (uses req.session.userId to check status)
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:[projects]} if success, else {status:400, error:...}
 */
const getProjects = async (req, res) => {
  try {
    // Get all projects
    const sql = `SELECT p.project_id, p.title, p.hook, p.thumbnail, p.created_at, g.project_types, t.tags, f.followers
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
            ON p.project_id = t.project_id
            JOIN (SELECT pf.project_id, JSON_ARRAYAGG(JSON_OBJECT('id', pf.user_id))
				        AS followers
                FROM project_followings pf
                GROUP BY pf.project_id) f
			      ON p.project_id = f.project_id;
        `;
    const projects = await pool.query(sql);

    // Format the follower section so it doesn't provide IDs
    projects.forEach((project) => {
      let followers = project.followers;

      project.followers = {
        count: followers.length,
        isFollowing: followers.find((follower) => req.session.userId === follower.id) !== undefined,
      };
    });

    res.status(200).json({
      status: 200,
      data: projects,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting all projects',
    });
    return;
  }
};

/**
 * Creates a new project with all necassary data types, tags, jobs, members, and socials
 * @param {express.Request} req - req.body - containing all project data
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status;201, data:projectId} if success, else {status:400, error:...}
 */
const createProject = async (req, res) => {
  // Get input data
  const {
    userId,
    title,
    hook,
    description,
    purpose,
    status,
    audience,
    project_types,
    tags,
    jobs,
    members,
    socials,
  } = req.body;

  // Checks
  if (!userId || userId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing user id',
    });
    return;
  } else if (!title) {
    res.status(400).json({
      status: 400,
      error: 'Missing a title',
    });
    return;
  } else if (!hook) {
    res.status(400).json({
      status: 400,
      error: 'Missing a hook',
    });
    return;
  } else if (!description) {
    res.status(400).json({
      status: 400,
      error: 'Missing a description',
    });
    return;
  } else if (!status) {
    res.status(400).json({
      status: 400,
      error: 'Missing a project status',
    });
    return;
  } else if (project_types.length < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing at least 1 project type',
    });
    return;
  } else if (tags.length < 1 || tags.length > 20) {
    res.status(400).json({
      status: 400,
      error: 'Missing at least 1 tag or more than 20 tags added',
    });
    return;
  } else if (members.length < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing at least 1 member',
    });
    return;
  }

  try {
    // Add project to database and get back its id
    const sql =
      'INSERT INTO projects (title, hook, description, purpose, status, audience, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [title, hook, description, purpose, status, audience, userId];
    await pool.query(sql, values);
    const [projectId] = await pool.query(
      'SELECT project_id FROM projects WHERE title = ? AND user_id = ?',
      [title, userId],
    );

    // Add project's types to database
    for (let type of project_types) {
      await pool.query('INSERT INTO project_genres (project_id, type_id) VALUES (?, ?)', [
        projectId[0].project_id,
        type.id,
      ]);
    }

    // Add project's tags to database
    for (let tag of tags) {
      await pool.query('INSERT INTO project_tags (project_id, tag_id, position) VALUES (?, ?, ?)', [
        projectId[0].project_id,
        tag.id,
        tag.position,
      ]);
    }

    // Add project's jobs to database
    for (let job of jobs) {
      await pool.query(
        'INSERT INTO jobs (project_id, title_id, availability, duration, location, compensation, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          projectId[0].project_id,
          job.title_id,
          job.availability,
          job.duration,
          job.location,
          job.compensation,
          job.description,
        ],
      );
    }

    // Add project's members to database
    for (let member of members) {
      console.log('inserting member', member);
      await pool.query('INSERT INTO members (project_id, user_id, title_id) VALUES (?, ?, ?)', [
        projectId[0].project_id,
        member.user_id,
        member.title_id,
      ]);
    }

    // Add project's socials to database
    for (let social of socials) {
      await pool.query(
        'INSERT INTO project_socials (project_id, website_id, url) VALUES (?, ?, ?)',
        [projectId[0].project_id, social.id, social.url],
      );
    }

    res.status(201).json({
      status: 201,
      data: projectId,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while creating the project',
    });
    return;
  }
};

/**
 * Gets project data by the projects ID
 * @param {express.Request} req - req.params - the project ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:[project]} if success, else {status:400, error:...}
 */
const getProjectById = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get data of a project
    const sql = `SELECT p.project_id, p.user_id, p.title, p.hook, p.description, p.thumbnail, p.purpose, p.status, p.audience, g.project_types, 
            t.tags, j.jobs, m.members, pi.images, pf.followers, so.socials
            FROM projects p
            LEFT JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                FROM project_genres pg 
                JOIN genres g 
                    ON pg.type_id = g.type_id
                GROUP BY pg.project_id) g
            ON p.project_id = g.project_id
            LEFT JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                FROM project_tags pt 
                JOIN tags t 
                    ON pt.tag_id = t.tag_id
                GROUP BY pt.project_id) t
            ON p.project_id = t.project_id
            LEFT JOIN (SELECT j.project_id, JSON_ARRAYAGG(JSON_OBJECT("title_id", j.title_id, "job_title", jt.label, "availability", j.availability, 
            "duration", j.duration, "location", j.location, "compensation", j.compensation, "description", j.description)) AS jobs
                FROM jobs j
                JOIN job_titles jt
			        ON j.title_id = jt.title_id
                WHERE j.project_id = ?) j
            ON p.project_id = j.project_id
            LEFT JOIN (SELECT m.project_id, JSON_ARRAYAGG(JSON_OBJECT("user_id", m.user_id, "first_name", u.first_name, "last_name", u.last_name,
            "profile_image", u.profile_image, "job_title", jt.label, "permissions", m.permissions, "profile_visibility", m.profile_visibility)) AS members
                FROM members m
                JOIN users u 
                    ON m.user_id = u.user_id
                JOIN job_titles jt
				    ON m.title_id = jt.title_id
                WHERE m.project_id = ?) m
            ON p.project_id = m.project_id
            LEFT JOIN (SELECT pi.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", pi.image_id, "image", pi.image, "position", pi.position)) AS images
                FROM project_images pi
                WHERE pi.project_id = ?) pi
            ON p.project_id = pi.project_id
            LEFT JOIN (SELECT pf.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", pf.user_id)) AS followers
				        FROM project_followings pf
                WHERE pf.project_id = ?) pf
			      ON p.project_id = pf.project_id
            LEFT JOIN (SELECT ps.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", so.website_id, "website", so.label, "url", ps.url)) AS socials
                FROM project_socials ps 
                JOIN socials so
                    ON ps.website_id = so.website_id
                GROUP BY ps.project_id) so
            ON p.project_id = so.project_id
            WHERE p.project_id = ?;
        `;
    const values = [id, id, id, id, id];
    const [project] = await pool.query(sql, values);

    // Format the follower section so it doesn't provide IDs
    let followers = project[0].followers;

    project[0].followers = {
      count: followers.length,
      isFollowing: followers.find((follower) => req.session.userId === follower.id) !== undefined,
    };

    res.status(200).json({
      status: 200,
      data: project,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the project',
    });
    return;
  }
};

/**
 * Update existing project and its data types, tags, member, socials
 * @param {express.Request} req - req.params-project ID, req.body-updated project data
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if successful, else {status:400, error:...}
 */
const updateProject = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const {
    title,
    hook,
    description,
    purpose,
    status,
    audience,
    project_types,
    tags,
    jobs,
    members,
    socials,
  } = req.body;

  // Checks
  if (!title) {
    res.status(400).json({
      status: 400,
      error: 'Missing a title',
    });
    return;
  } else if (!hook) {
    res.status(400).json({
      status: 400,
      error: 'Missing a hook',
    });
    return;
  } else if (!description) {
    res.status(400).json({
      status: 400,
      error: 'Missing a description',
    });
    return;
  } else if (!status) {
    res.status(400).json({
      status: 400,
      error: 'Missing a project status',
    });
    return;
  } else if (project_types.length < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing at least 1 project type',
    });
    return;
  } else if (tags.length < 1 || tags.length > 20) {
    res.status(400).json({
      status: 400,
      error: 'Missing at least 1 tag or more than 20 tags added',
    });
    return;
  } else if (members.length < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing at least 1 member',
    });
    return;
  }

  try {
    // Update database with project's new info
    let sql =
      'UPDATE projects SET title = ?, hook = ?, description = ?, purpose = ?, status = ?, audience = ? WHERE project_id = ?';
    let values = [title, hook, description, purpose, status, audience, id];
    await pool.query(sql, values);

    // ----- UPDATE PROJECT'S TYPES -----
    // Create array from project types
    const newProjectTypes = project_types.map((type) => type.id);
    // Get project types already in database that need to be removed
    let placeholders = genPlaceholders(newProjectTypes);
    sql = `SELECT JSON_ARRAYAGG(pg.type_id) AS project_types FROM project_genres pg 
        WHERE pg.project_id = ? AND NOT pg.type_id IN (${placeholders})`;
    values = [id, ...newProjectTypes];
    const [removingProjectTypes] = await pool.query(sql, values);
    // Remove project types if any were found
    if (removingProjectTypes[0].project_types) {
      placeholders = genPlaceholders(removingProjectTypes[0].project_types);
      sql = `DELETE FROM project_genres WHERE project_id = ? AND type_id IN (${placeholders})`;
      values = [id, ...removingProjectTypes[0].project_types];
      await pool.query(sql, values);
    }
    // Add new project types or update if already in database
    sql = `INSERT INTO project_genres (project_id, type_id) VALUES (?, ?) AS new 
        ON DUPLICATE KEY UPDATE project_id = new.project_id, type_id = new.type_id`;
    for (let type of project_types) {
      await pool.query(sql, [id, type.id]);
    }

    // ----- UPDATE PROJECT'S TAGS -----
    // Create array from tags
    const newTags = tags.map((tag) => tag.id);
    // Get tags already in database that need to be removed
    placeholders = genPlaceholders(newTags);
    sql = `SELECT JSON_ARRAYAGG(pt.tag_id) AS tags FROM project_tags pt 
        WHERE pt.project_id = ? AND NOT pt.tag_id IN (${placeholders})`;
    values = [id, ...newTags];
    const [removingTags] = await pool.query(sql, values);
    // Remove tags if any were found
    if (removingTags[0].tags) {
      placeholders = genPlaceholders(removingTags[0].tags);
      sql = `DELETE FROM project_tags WHERE project_id = ? AND tag_id IN (${placeholders})`;
      values = [id, ...removingTags[0].tags];
      await pool.query(sql, values);
    }
    // Add new tags or update if already in database
    sql = `INSERT INTO project_tags (project_id, tag_id, position) VALUES (?, ?, ?) AS new
        ON DUPLICATE KEY UPDATE project_id = new.project_id, tag_id = new.tag_id, position = new.position`;
    for (let tag of tags) {
      await pool.query(sql, [id, tag.id, tag.position]);
    }

    // ----- UPDATE PROJECT'S JOBS -----
    // Create array from jobs
    const newJobs = jobs.map((job) => job.title_id);
    // Add 0 if empty to allow sql statement to still find exisiting data to be removed
    if (newJobs.length === 0) {
      newJobs.push(0);
    }
    // Get jobs already in database that need to be removed
    placeholders = genPlaceholders(newJobs);
    sql = `SELECT JSON_ARRAYAGG(j.title_id) AS jobs FROM jobs j
        WHERE j.project_id = ? AND NOT j.title_id IN (${placeholders})`;
    values = [id, ...newJobs];
    const [removingJobs] = await pool.query(sql, values);
    // Remove jobs if any were found
    if (removingJobs[0].jobs) {
      placeholders = genPlaceholders(removingJobs[0].jobs);
      sql = `DELETE FROM jobs WHERE project_id = ? AND title_id IN (${placeholders})`;
      values = [id, ...removingJobs[0].jobs];
      await pool.query(sql, values);
    }
    // Add new jobs or update if already in database
    sql = `INSERT INTO jobs (project_id, title_id, availability, duration, location, compensation, description) VALUES (?, ?, ?, ?, ?, ?, ?) AS new
        ON DUPLICATE KEY UPDATE project_id = new.project_id, title_id = new.title_id, availability = new.availability, duration = new.duration,
        location = new.location, compensation = new.compensation, description = new.description`;
    for (let job of jobs) {
      await pool.query(sql, [
        id,
        job.title_id,
        job.availability,
        job.duration,
        job.location,
        job.compensation,
        job.description,
      ]);
    }

    // ----- UPDATE PROJECT'S MEMBERS -----
    // Create array from members
    const newMembers = members.map((member) => member.user_id);
    // Get members already in database that need to be removed
    placeholders = genPlaceholders(newMembers);
    sql = `SELECT JSON_ARRAYAGG(m.user_id) AS members FROM members m
        WHERE m.project_id = ? AND NOT m.user_id IN (${placeholders})`;
    values = [id, ...newMembers];
    const [removingMembers] = await pool.query(sql, values);
    // Remove members if any were found
    if (removingMembers[0].members) {
      placeholders = genPlaceholders(removingMembers[0].members);
      sql = `DELETE FROM members WHERE project_id = ? AND user_id IN (${placeholders})`;
      values = [id, ...removingMembers[0].members];
      await pool.query(sql, values);
    }
    // Add new members or update if already in database
    sql = `INSERT INTO members (project_id, user_id, title_id, permissions) VALUES (?, ?, ?, ?) AS new
        ON DUPLICATE KEY UPDATE project_id = new.project_id, user_id = new.user_id, title_id = new.title_id, permissions = new.permissions`;
    for (let member of members) {
      // find title_id with matching job title (members.label and member.job_title)
      const titleSql = `SELECT jt.title_id FROM job_titles jt WHERE jt.label = ?`;
      values = [member.job_title];
      const [matchingTitle] = await pool.query(titleSql, values);
      member.title_id = matchingTitle[0].title_id;
      await pool.query(sql, [id, member.user_id, member.title_id, member.permissions]);
    }

    // ----- UPDATE PROJECT'S SOCIALS -----
    // Check if there are socials to add
    if (!socials || socials === undefined) {
      res.status(200).json({
        status: 200,
      });
      return;
    }
    // Create array from socials
    const newSocials = socials.map((social) => social.id);
    // Add 0 if empty to allow sql statement to still find exisiting data to be removed
    if (newSocials.length === 0) {
      newSocials.push(0);
    }
    // Get socials already in database that need to be removed
    placeholders = genPlaceholders(newSocials);
    sql = `SELECT JSON_ARRAYAGG(ps.website_id) AS socials FROM project_socials ps 
        WHERE ps.project_id = ? AND NOT ps.website_id IN (${placeholders})`;
    values = [id, ...newSocials];
    const [removingSocials] = await pool.query(sql, values);
    // Remove socials if any were found
    if (removingSocials[0].socials) {
      placeholders = genPlaceholders(removingSocials[0].socials);
      sql = `DELETE FROM project_socials WHERE project_id = ? AND website_id IN (${placeholders})`;
      values = [id, ...removingSocials[0].socials];
      await pool.query(sql, values);
    }
    // Add new socials or update if already in database
    sql = `INSERT INTO project_socials (project_id, website_id, url) VALUES (?, ?, ?) AS new
        ON DUPLICATE KEY UPDATE project_id = new.project_id, website_id = new.website_id, url = new.url`;
    for (let social of socials) {
      await pool.query(sql, [id, social.id, social.url]);
    }

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while updating the project',
    });
    return;
  }
};

/**
 * Deletes project that user owns by ID
 * @param {express.Request} req - req.params.id-the project ID, req.session.userId-the current logged in users ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if succes, else {status:400 or 500, error:...}
 */
const deleteProject = async (req, res) => {
  // Get data
  const projId = parseInt(req.params.id);
  const userId = parseInt(req.session.userId);

  try {
    // Get creator/owner ID of project to verify it matches userId
    const [ownerData] = await pool.query(
      'SELECT p.user_id FROM projects p WHERE p.project_id = ?',
      [projId],
    );
    const ownerId = ownerData[0].user_id;

    // TO-DO: Feed back bad request if userId != ownerId
    // Otherwise, delete the project
    if (userId !== ownerId) {
      res.status(400).json({
        status: 400,
        error: 'You must be the project owner in order to delete a project',
      });
      return;
    }

    // Delete the project from the server
    await pool.query('DELETE FROM projects WHERE project_id = ?', [projId]);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 500,
      error: 'An error occurred while deleting project',
    });
    return;
  }
};

/**
 * Updates the thumbnail image for a project
 * @param {express.Request} req - req.params.id-project ID, req.file-file for the uploaded image
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201, data:[{thumbnail}]} if success, else (status:400, error:...)
 */
const updateThumbnail = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  // Checks
  if (!req.file) {
    res.status(400).json({
      status: 400,
      error: 'Missing image file',
    });
    return;
  }

  try {
    // Download user's uploaded image. Convert to webp and reduce file size
    const fileName = `${id}thumbnail${Date.now()}.webp`;
    const saveTo = join(dirname, '../images/thumbnails/');
    const filePath = join(saveTo, fileName);

    await sharp(req.file.buffer).webp({ quality: 50 }).toFile(filePath);

    // Remove old image from server
    const [image] = await pool.query('SELECT thumbnail FROM projects WHERE project_id = ?', [id]);
    if (image[0].thumbnail !== null) {
      await unlink(saveTo + image[0].thumbnail);
    }

    // Store file name in database
    const sql = 'UPDATE projects SET thumbnail = ? WHERE project_id = ?';
    const values = [fileName, id];
    await pool.query(sql, values);

    res.status(201).json({
      status: 201,
      data: [{ thumbnail: fileName }],
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while saving the project's thumbnail",
    });
    return;
  }
};

/**
 * Get all pictures for project by project ID
 * @param {express.Request} req - req.params.id- project ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:[{image_id, image, position}]} if success. else {status:400, error:...}
 */
const getPictures = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get project's pictures
    const sql = `SELECT pi.image_id, pi.image, pi.position
			FROM project_images pi
			WHERE pi.project_id = ?
            `;
    const values = [id];
    const [pictures] = await pool.query(sql, values);

    res.status(200).json({
      status: 200,
      data: pictures,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while getting the project's pictures",
    });
    return;
  }
};

/**
 * Add new picture to a project
 * @param {express.Request} req - req.params.id- project ID, req.file-file of uploaded image, req.body.position-number for image order
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201} if success, else {status:400, error:...}
 */
const addPicture = async (req, res) => {
  // Get data
  const { id } = req.params;
  const { position } = req.body;

  // Checks
  if (!req.file) {
    res.status(400).json({
      status: 400,
      error: 'Missing image file',
    });
    return;
  } else if (!position || Number(position) < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing a position for the picture',
    });
    return;
  }

  try {
    // Download user's uploaded image. Convert to webp and reduce file size
    const fileName = `${id}picture${Date.now()}.webp`;
    const saveTo = join(dirname, '../images/projects');
    const filePath = join(saveTo, fileName);

    await sharp(req.file.buffer).webp({ quality: 50 }).toFile(filePath);

    // Store file name in database
    const sql = 'INSERT INTO project_images (image, position, project_id) VALUES (?, ?, ?)';
    const values = [fileName, Number(position), id];
    await pool.query(sql, values);

    res.status(201).json({
      status: 201,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while saving the project's picture",
    });
    return;
  }
};

/**
 * Update the order of images in a project
 * @param {express.Request} req - req.params.id- project ID, req.body.images- the array of images {id, position}
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success. else {status:400, error:...}
 */
const updatePicturePositions = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { images } = req.body;

  // Checks
  if (images.length < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing at least 1 picture',
    });
    return;
  }

  try {
    // Update the picture positions for a project
    for (let image of images) {
      const sql = 'UPDATE project_images SET position = ? WHERE image_id = ? AND project_id = ?';
      const values = [image.position, image.id, id];
      await pool.query(sql, values);
    }

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while updating the picture order for a project',
    });
    return;
  }
};

/**
 * Delete picture from a project
 * @param {express.Request} req - req.params.id- project ID, req.body.image-image file name
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success. else {status:400, error:...}
 */
const deletePicture = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { image } = req.body;

  // Checks
  if (!image) {
    res.status(400).json({
      status: 400,
      error: 'Missing picture name',
    });
    return;
  }

  try {
    // Remove project's picture from server and database
    const filePath = join(dirname, '../images/projects/');
    await unlink(filePath + image);

    await pool.query('DELETE FROM project_images WHERE image = ? AND project_id = ?', [image, id]);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while removing a project's picture",
    });
    return;
  }
};

/**
 * Add a member to a project. Needs all member feilds
 * @param {express.Request} req - req.params.id- project ID, req.body.(userId|titleId|permission)- info about user being added
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201} if success, else {status:400|403, error:...}
 */
const addMember = async (req, res) => {
  // Get data
  const projId = parseInt(req.params.id);
  const userId = parseInt(req.body.userId);
  const titleId = parseInt(req.body.titleId);
  const permission = parseInt(req.body.permission);

  // Checks
  if (!projId || projId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing or invalid project id',
    });
    return;
  } else if (!userId || userId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing or invalid user id',
    });
    return;
  } else if (!titleId || titleId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing or invalid job title id',
    });
    return;
  } else if (!permission || permission < 0) {
    res.status(400).json({
      status: 400,
      error: 'Missing or invalid member permissions',
    });
    return;
  }

  try {
    // Make sure user making request is part of the project
    const [memberData] = await pool.query(
      'SELECT m.user_id, m.permissions FROM members m WHERE m.project_id = ?',
      [projId],
    );
    let requester = null;

    for (let i = 0; i < memberData.length; i++) {
      if (memberData[i].user_id === userId) {
        requester = memberData[i];
        break;
      }
    }

    if (!requester) {
      res.status(403).json({
        status: 403,
        error: 'You must be a member of this project to add another member.',
      });
      return;
    } else if (requester.permissions <= 0) {
      res.status(403).json({
        status: 403,
        error: 'You do not have permission to add another member to this project.',
      });
      return;
    }

    // Add member to project
    const sql = `INSERT INTO members (project_id, user_id, title_id, permissions) VALUES (?, ?, ?, ?)`;
    const values = [projId, userId, titleId, permission];
    await pool.query(sql, values);

    res.status(201).json({
      status: 201,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while adding a member to this project',
    });
    return;
  }
};

/**
 * Update a project members title and permission for the project
 * Checks the permissions of current user to allow updates
 * @param {express.Request} req - req.params.id- project ID, req.body.(userId|titleId|permission)- info about user being updated
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|403, error:...}
 */
const updateMember = async (req, res) => {
  // Get data
  const projId = parseInt(req.params.id);
  const userId = parseInt(req.body.userId);
  const titleId = parseInt(req.body.titleId);
  const permission = parseInt(req.body.permission);

  // Checks
  if (!projId || projId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing or invalid project id',
    });
    return;
  } else if (!userId || userId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing or invalid user id',
    });
    return;
  } else if (!titleId || titleId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing or invalid job title id',
    });
    return;
  } else if (!permission || permission < 0) {
    res.status(400).json({
      status: 400,
      error: 'Missing or invalid member permissions',
    });
    return;
  }

  try {
    // Make sure user is part of the project
    const [memberData] = await pool.query(
      'SELECT m.user_id, m.permissions FROM members m WHERE m.project_id = ?',
      [id],
    );
    let requester = null;
    let recipient = null;

    for (let i = 0; i < memberData.length; i++) {
      if (memberData[i] === userId) {
        recipient = memberData[i];
      }

      if (memberData[i] === req.session.userId) {
        requester = memberData[i];
      }
    }

    if (!requester) {
      res.status(403).json({
        status: 403,
        error: 'You must be a member of this project to update another member.',
      });
      return;
    } else if (!recipient) {
      res.status(400).json({
        status: 400,
        error: 'User is not currently a member of this project.',
      });
      return;
    } else if (
      parseInt(userId) !== req.session.userId &&
      requester.permissions <= recipient.permissions
    ) {
      res.status(403).json({
        status: 403,
        error: `You don't have the required permissions to update this user.`,
      });
      return;
    }

    // Update contents of project
    const sql = `UPDATE members SET title_id = ?, permissions = ?
      WHERE project_id = ? AND WHERE user_id = ?`;
    const values = [titleId, permission, visibility, projId, userId];
    await pool.query(sql, values);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    res.status(400).json({
      status: 400,
      error: 'Something went wrong while updating user membership',
    });
    return;
  }
};

/**
 * Delete a member from a project
 * Checks current users permissions to allow for deletes
 * @param {express.Request} req - req.params.id- project ID, req.body.userId- ID of user to remove
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|403, error:...}
 */
const deleteMember = async (req, res) => {
  // Get data
  const { id, userId } = req.params;
  //const { userId } = req.body;

  try {
    // Check if user making request is part of project
    const [memberData] = await pool.query(
      'SELECT m.user_id, m.permissions FROM members m WHERE m.project_id = ?',
      [id],
    );
    let requester = null;
    let recipient = null;

    console.log();

    for (let i = 0; i < memberData.length; i++) {
      if (parseInt(memberData[i].user_id) === parseInt(userId)) {
        recipient = memberData[i];
      }

      if (parseInt(memberData[i].user_id) === parseInt(req.session.userId)) {
        requester = memberData[i];
      }
    }

    if (!requester) {
      // Make sure user in current session is a member of project, and have lower permissions
      res.status(403).json({
        status: 403,
        error: 'You must be a member of the project to remove another member.',
      });
      return;
    } else if (!recipient) {
      res.status(400).json({
        status: 400,
        error: 'User is not currently a member of this project.',
      });
      return;
    } else if (
      parseInt(userId) !== req.session.userId &&
      requester.permissions <= recipient.permissions
    ) {
      console.log(`userId: ${userId} vs. sessionId: ${req.session.userId}`);

      res.status(403).json({
        status: 403,
        error: `You don't have the required permissions to remove this user from the project.`,
      });
      return;
    }

    // Remove member from a project
    await pool.query('DELETE FROM members WHERE project_id = ? AND user_id = ?', [id, userId]);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while attempting to removing a project's member",
    });
    return;
  }
};

export default {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  updateThumbnail,
  getPictures,
  addPicture,
  updatePicturePositions,
  deletePicture,
  addMember,
  updateMember,
  deleteMember,
};
