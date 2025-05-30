import pool from '../config/database.js';

/**
 * Replaces password of an existing user
 * @param req - req.params - {token} from password reset link
 * @param req - req.body - {password, confirm} inputs for new password
 * @param res - response
 * @returns res.status - {status:201} if successful send, else {status:400, error:...}
 */
const resetPassword = async (req, res) => {
  // Get data
  const { token } = req.params;
  const { password, confirm } = req.body;

  if (!password || !confirm) {
    return res.status(400).json({
      status: 400,
      error: 'Missing passwords',
    });
  } else if (password !== confirm) {
    return res.status(400).json({
      status: 400,
      error: 'Passwords do not match',
    });
  }

  // Hash the password
  const hashPass = await bcrypt.hash(password, 10);

  try {
    // Get email if token is valid
    // Add 5 minute leeway to the 15 minutes stated in email, to account for time taken for email to arrive
    const [email] = await pool.query(
      'SELECT primary_email FROM password_resets WHERE token = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 20 MINUTE)',
      [token]
    );
    if (email.length < 1) {
      return res.status(400).json({
        status: 400,
        error: 'Your token has expired',
      });
    }

    // Update user password
    const sql = 'UPDATE users SET password = ? WHERE primary_email = ?';
    const values = [hashPass, email[0].primary_email];
    await pool.query(sql, values);

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while updating user's password",
    });
  }
};

export default resetPassword;
