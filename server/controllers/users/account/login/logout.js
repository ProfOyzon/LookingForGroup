import pool from '../config/database.js';

/**
 * Checks if user is logged in
 * @param req - req.session - current session to destroy
 * @param res - response
 * @returns res.status - {redirect:'/'} if success
 */
const logout = async (req, res) => {
  if (req.session) {
    req.session.destroy();
  }

  return res.json({ redirect: '/' });
};

export default logout;
