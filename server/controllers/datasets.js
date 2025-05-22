import pool from '../config/database.js';

/* 
This controller handles the metadata queries from database
ALL DATA is a read only GET request gotten via MySQL
*/

//fetch all skills or filtered type
const getSkills = async (req, res) => {
  // Get search query
  const { type } = req.query;

  try {
    // Get skills of specfic type when the "type" query parameter is given
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

//fetches tags that are not skills
const getTags = async (req, res) => {
  // Get search query
  const { type } = req.query;

  try {
    // Get tags of specfic type when the "type" query parameter is given
    if (type) {
      //const sql = `SELECT * FROM tags WHERE type = ?`;
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

//fetch all jobs titles
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

//fetch all majors
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

//fetches all project types
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

//fetches all social sites
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
