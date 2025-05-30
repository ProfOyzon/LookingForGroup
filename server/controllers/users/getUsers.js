import pool from '../config/database.js';

/**
 * Retrieves a list of all users from database
 * @param req - not used
 * @param res - response
 * @returns res.status - {status:200, data:[users]} if successful, else {status:400, error:...}
 */
const getUsers = async (req, res) => {
  try {
    // Get data on all users
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns, 
        jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, u.created_at, s.skills
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
            WHERE u.visibility = '1'
        `;
    const [users] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting all users',
    });
  }
};

/**
 * Retrieves a user based on thier user ID number
 * @param req - req.params - {id} the user ID of the being searched for
 * @param res - response
 * @returns res.status - {status:200, data:[user]} if successful, else {status:400, error:...}
 */
const getUserById = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get data of a user
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username, u.profile_image, u.headline, u.pronouns, 
            jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, u.bio, u.visibility, s.skills, so.socials
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
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the user',
    });
  }
};

/**
 * Retrieves a user based on thier username
 * @param req - req.params - {username} the username of the user being searched for
 * @param res - response
 * @returns res.status - {status:200, data:[user]} if successful, else {status:400, error:...}
 */
const getUserByUsername = async (req, res) => {
  // Get username from url
  const { username } = req.params;

  try {
    // Find same username in database
    const sql = `SELECT * FROM users WHERE username = ?`;
    const [user] = await pool.query(sql, [username]);

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the username',
    });
  }
};

/**
 * Retrieves a user based on thier email
 * @param req - req.params - {email} the email of the user being searched for
 * @param res - response
 * @returns res.status - {status:200, data:[user]} if successful, else {status:400, error:...}
 */
const getUserByEmail = async (req, res) => {
  // Get email from url
  const { email } = req.params;

  try {
    // Find same username in database
    const sql = `SELECT * FROM users WHERE primary_email = ? OR rit_email = ?`;
    const [user] = await pool.query(sql, [email, email]);

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the email',
    });
  }
};

export default getUsers;
export { getUserById, getUserByUsername, getUserByEmail };
