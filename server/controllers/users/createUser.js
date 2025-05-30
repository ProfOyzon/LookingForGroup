import pool from '../config/database.js';

/**
 * Adds new user and thier data to database.
 * Uses token from signup
 * @param req - req.params - {token} token to verify user
 * @param res - response
 * @returns res.status - {status:200} if success, else {status:400, error:...}
 */
const createUser = async (req, res) => {
  // Get token from url
  const { token } = req.params;

  try {
    // Get signup email if token is valid
    const [email] = await pool.query(
      'SELECT rit_email FROM signups WHERE token = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)',
      [token]
    );
    if (email.length < 1) {
      return res.status(400).json({
        status: 400,
        error: 'Your token has expired',
      });
    }
    // Check if an user with the email already exists
    const [user] = await pool.query('SELECT rit_email FROM users WHERE rit_email = ?', [
      email[0].rit_email,
    ]);
    if (user.length > 0) {
      return res.status(400).json({
        status: 400,
        error: 'Your account has already been activated',
      });
    }

    // Add user officially to database
    const sql = ` INSERT INTO users (username, primary_email, rit_email, password, first_name, last_name)
            SELECT username, primary_email, rit_email, password, first_name, last_name
            FROM signups
            WHERE token = ?
        `;
    const values = [token];
    await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while activating the user's account",
    });
  }
};

export default createUser;
