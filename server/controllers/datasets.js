import pool from '../config/database.js';
import express from 'express';

/**
 * Get skills through a request.
 * @param {express.Request} req - req.query-type of specific skill, default '' to return all skills.
 * @param {express.Response} res - response
 * @returns res.status - {status:200,data:[skills]} if successful, else {status:400,error:...}
 */
const getSkills = async (req, res) => {
  // Get search query
  const { type } = req.query;

  try {
    // Get skills of specific type when the "type" query parameter is given
    if (type) {
      const sql = `SELECT * FROM tags WHERE type = ?`;
      const [skills] = await pool.query(sql, [type]);

      return res.status(200).json({
        status: 200,
        data: skills,
      });
    }

    // Get all skills
    const sql = `SELECT * FROM tags WHERE type = "Developer Skill" 
      OR type = "Designer Skill" OR type = "Soft Skill"`;
    const [skills] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: skills,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the specified skills set',
    });
  }
};

/**
 * Get tags through request.
 * @param {express.Request} req - req.query-specific tag to return, otherwise returns all
 * @param {express.Response} res
 * @returns response - {status:200, data:tags} if successful, or {status:400, error:...}
 */
const getTags = async (req, res) => {
  // Get search query
  const { type } = req.query;

  try {
    // Get tags of specific type when the "type" query parameter is given
    if (type) {
      const sql = `SELECT * FROM tags WHERE type = ?`;
      const [tags] = await pool.query(sql, [type]);

      return res.status(200).json({
        status: 200,
        data: tags,
      });
    }

    // Get all tags
    //const sql = `SELECT * FROM tags`;
    const sql = `SELECT * FROM tags WHERE NOT type = "Developer Skill" 
      AND NOT type = "Designer Skill" AND NOT type = "Soft Skill"`;
    const [tags] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: tags,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the specified tags set',
    });
  }
};

/**
 *
 * @param {express.Request} req - request - unused?
 * @param {express.Response} res -
 * @returns result - {status:200, data: all jobTitles} if successful, or {status:400, error:...}
 */
const getJobTitles = async (req, res) => {
  try {
    // Get all job titles
    const sql = `SELECT * FROM job_titles`;
    const [jobTitles] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: jobTitles,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the job titles set',
    });
  }
};

/**
 * Returns ALL majors
 * @param {express.Request} req - unused.
 * @param {express.Response} res - response
 * @returns res - {status:200, data:[majors]} if successful, {status:400, error:...}
 */
const getMajors = async (req, res) => {
  try {
    // Get all majors
    const sql = `SELECT * FROM majors`;
    const [majors] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: majors,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the majors set',
    });
  }
};

/**
 * Gets ALL genres from request
 * @param {express.Request} req - unused
 * @param {express.Response} res -
 * @returns res - {status:200, data[projectTypes]} if successful, or {status:400, error:...}
 */
const getProjectTypes = async (req, res) => {
  try {
    // Get all project types
    const sql = `SELECT * FROM genres`;
    const [projectTypes] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: projectTypes,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the project types set',
    });
  }
};

/**
 * Gets ALL social media sites from request
 * @param {express.Request} req - unused
 * @param {express.Response} res -
 * @returns res - {status:200, data[socials]} if successful, or {status:400, error:...}
 */
const getSocials = async (req, res) => {
  try {
    // Get all social sites
    const sql = `SELECT * FROM socials`;
    const [socials] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: socials,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the websites set',
    });
  }
};

export default { getSkills, getTags, getJobTitles, getMajors, getProjectTypes, getSocials };
