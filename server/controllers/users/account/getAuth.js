import pool from '../config/database.js';

/**
 * Checks if user is authenticated
 * @param req - req.session.userId - the current logged in users ID
 * @param res - response
 * @returns res.status - {status:200, data:userId} if authorized, else {status:401, error:...}
 */
const getAuth = (req, res) => {
  // Allow frontend to check if user is logged in

  if (!req.session.userId) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else {
    return res.status(200).json({
      status: 200,
      data: req.session.userId,
    });
  }
};

export default getAuth;
