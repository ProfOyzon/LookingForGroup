import pool from '../config/database.js';

/**
 * Retrieves a username based on current logged in session user ID
 * @param req - req.session,userId - the user ID from session
 * @param res - response
 * @returns res.status - {status:200, data:user} if successful, else {status:400, error:...}
 */
const getUsernameBySession = async (req, res) => {
  try {
    const [user] = await pool.query(
      `SELECT first_name, last_name, username, primary_email, profile_image FROM users WHERE user_id = ?`,
      [req.session.userId]
    );
    return res.status(200).json({
      status: 200,
      data: user[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the user',
    });
  }
};

export default getUsernameBySession;
