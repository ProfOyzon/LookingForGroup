import pool from '../config/database.js';

/**
 * Gets the current users account data
 * @param req - req.params.id user ID, req.session.id session user ID
 * @param res - response
 * @returns res.status - {status:200, data:account} if success, else {status:400|401, error:...}
 */
const getAccount = async (req, res) => {
  // Get data
  //const { id } = req.params;
  const id = parseInt(req.params.id);

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }

  try {
    // Get account information
    const sql =
      'SELECT u.user_id, u.primary_email, u.rit_email, u.username, u.visibility FROM users u WHERE user_id = ?';
    const values = [id];
    const [account] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: account,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while getting the user's account information",
    });
  }
};

export default getAccount;
