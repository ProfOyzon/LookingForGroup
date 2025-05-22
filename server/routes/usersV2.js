import { Router } from 'express';
import pool from '../config/database.js';

const router = Router();

router.get('/api/2/users', async (req, res) => {
  try {
    let sql = 'SELECT * FROM users WHERE 1=1';

    for (const [key, value] of Object.entries(req.query)) {
      sql += ` AND ${key} = ${value}`;
    }

    const [users] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: err,
    });
  }
});

export default router;
