import pool from '../config/database.js';

/**
 * Deletes user by checking user ID to session ID
 * @param req - req.params.id the ID of user to delete, req.session.id session user ID
 * @param res - response
 * @returns res.status - {status:200} if successful, else {status:400|401, error:...}
 */
const deleteUser = async (req, res) => {
  // Get data
  const { id } = req.params;
  console.log(typeof id);
  console.log(typeof req.session.userId);

  // Checks
  if (req.session.userId !== Number(id)) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }

  try {
    // Delete user
    await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while deleting the user',
    });
  }
};

export default deleteUser;
