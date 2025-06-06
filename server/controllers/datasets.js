import express from 'express';
import pool from '../config/database.js';

/**
 * Get skills through a request.
 * @param {express.Request} req - req.query-type of specific skill, default '' to return all skills.
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200,data:[skills]} if successful, else {status:400,error:...}
 */
const getSkills = async (req, res) => {
  // Get search query
  const { type } = req.query;

  try {
    // Get skills of specific type when the "type" query parameter is given
    if (type) {
      const sql = `SELECT * FROM tags WHERE type = ?`;
      const [skills] = await pool.query(sql, [type]);

      res.status(200).json({
        status: 200,
        data: skills,
      });
      return;
    }

    // Get all skills
    const sql = `SELECT * FROM tags WHERE type = "Developer Skill" 
      OR type = "Designer Skill" OR type = "Soft Skill"`;
    const [skills] = await pool.query(sql);

    res.status(200).json({
      status: 200,
      data: skills,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the specified skills set',
    });
    return;
  }
};

/**
 * Get tags through request.
 * @param {express.Request} req - req.query-specific tag to return, otherwise returns all
 * @param {express.Response} res
 * @returns {Promise<void>} response - {status:200, data:tags} if successful, or {status:400, error:...}
 */
const getTags = async (req, res) => {
  // Get search query
  const { type } = req.query;

  try {
    // Get tags of specific type when the "type" query parameter is given
    if (type) {
      const sql = `SELECT * FROM tags WHERE type = ?`;
      const [tags] = await pool.query(sql, [type]);

      res.status(200).json({
        status: 200,
        data: tags,
      });
      return;
    }

    // Get all tags
    //const sql = `SELECT * FROM tags`;
    const sql = `SELECT * FROM tags WHERE NOT type = "Developer Skill" 
      AND NOT type = "Designer Skill" AND NOT type = "Soft Skill"`;
    const [tags] = await pool.query(sql);

    res.status(200).json({
      status: 200,
      data: tags,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the specified tags set',
    });
    return;
  }
};

/**
 *
 * @param {express.Request} req - request - unused?
 * @param {express.Response} res -
 * @returns {Promise<void>} result - {status:200, data: all jobTitles} if successful, or {status:400, error:...}
 */
const getJobTitles = async (req, res) => {
  try {
    // Get all job titles
    const sql = `SELECT * FROM job_titles`;
    const [jobTitles] = await pool.query(sql);

    res.status(200).json({
      status: 200,
      data: jobTitles,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the job titles set',
    });
    return;
  }
};

/**
 * Returns ALL majors
 * @param {express.Request} req - unused.
 * @param {express.Response} res - response
 * @returns {Promise<void>} res - {status:200, data:[majors]} if successful, {status:400, error:...}
 */
const getMajors = async (req, res) => {
  try {
    // Get all majors
    const sql = `SELECT * FROM majors`;
    const [majors] = await pool.query(sql);

    res.status(200).json({
      status: 200,
      data: majors,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the majors set',
    });
    return;
  }
};

/**
 * Gets ALL genres from request
 * @param {express.Request} req - unused
 * @param {express.Response} res -
 * @returns {Promise<void>} res - {status:200, data[projectTypes]} if successful, or {status:400, error:...}
 */
const getProjectTypes = async (req, res) => {
  try {
    // Get all project types
    const sql = `SELECT * FROM genres`;
    const [projectTypes] = await pool.query(sql);

    res.status(200).json({
      status: 200,
      data: projectTypes,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the project types set',
    });
    return;
  }
};

/**
 * Gets ALL social media sites from request
 * @param {express.Request} req - unused
 * @param {express.Response} res -
 * @returns {Promise<void>} res - {status:200, data[socials]} if successful, or {status:400, error:...}
 */
const getSocials = async (req, res) => {
  try {
    // Get all social sites
    const sql = `SELECT * FROM socials`;
    const [socials] = await pool.query(sql);

    res.status(200).json({
      status: 200,
      data: socials,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the websites set',
    });
    return;
  }
};

export default { getSkills, getTags, getJobTitles, getMajors, getProjectTypes, getSocials };
