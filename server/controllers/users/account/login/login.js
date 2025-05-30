/**
 * Takes login information and retirieves accrount from database
 * @param req - req.body - {loginInput, password} for user login
 * @param res - response
 * @returns res.status - {status:200, redirect:'/'} if success, else {status:400, error:...}
 */
const login = async (req, res) => {
  const { loginInput, password } = req.body;

  // Checks
  if (!loginInput || !password) {
    return res.status(400).json({
      status: 400,
      error: 'Missing login credentials',
    });
  }

  const userQuery =
    'SELECT user_id, password FROM users WHERE username = ? OR primary_email = ? OR rit_email = ?';
  const [userResult] = await pool.query(userQuery, [loginInput, loginInput, loginInput]);

  // check for user with matching loginInput
  if (!userResult[0]) {
    // no user found
    return res.status(400).json({
      status: 400,
      error: 'Wrong username or password',
    });
  } else {
    // user found, check password
    const match = await bcrypt.compare(password, userResult[0].password);
    if (!match) {
      return res.status(400).json({
        status: 400,
        error: 'Wrong username or password',
      });
    }
  }

  req.session.userId = userResult[0].user_id;

  return res.json({ status: 200, redirect: '/' });
};

export default login;
