import pool from '../config/database.js';

/**
 * Updates users data in database
 * @param req - req.params.id - current users ID
 * @param req - req.body - {firstname, lastname, ...} all user feilds to be updated
 * @param res - response
 * @returns res.status - {status:200} if successful, else {status:400|401, error:...}
 */
const updateUser = async (req, res) => {
  // Get input data
  const id = parseInt(req.params.id);
  const {
    firstName,
    lastName,
    headline,
    pronouns,
    jobTitleId,
    majorId,
    academicYear,
    location,
    funFact,
    bio,
    skills,
    socials,
  } = req.body;

  console.log('ID is: ' + id);
  console.log('sessionID is: ' + req.session.userId);

  // Checks
  if (req.session.userId != id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!firstName) {
    return res.status(400).json({
      status: 400,
      error: "Missing user's first name",
    });
  } else if (!lastName) {
    return res.status(400).json({
      status: 400,
      error: "Missing user's last name",
    });
  } else if (!jobTitleId || jobTitleId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing job title id',
    });
  } else if (!majorId || jobTitleId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing major id',
    });
  }
  // else if (!skills || skills.length < 1) {
  //   return res.status(400).json({
  //     status: 400,
  //     error: 'Missing at least 1 skill',
  //   });
  // }

  try {
    // Update database with users's new info
    let sql = `UPDATE users SET first_name = ?, last_name = ?, headline = ?, pronouns = ?, job_title_id = ?,
        major_id = ?, academic_year = ?, location = ?, fun_fact = ?, bio = ? WHERE user_id = ?`;
    let values = [
      firstName,
      lastName,
      headline,
      pronouns,
      jobTitleId,
      majorId,
      academicYear,
      location,
      funFact,
      bio,
      id,
    ];
    await pool.query(sql, values);

    // // ----- UPDATE USER'S SKILLS -----
    // // Create array from skills
    // const newSkills = skills.map((skill) => skill.id);
    // // Get skills already in database that need to be removed
    // let placeholders = genPlaceholders(newSkills);
    // sql = `SELECT JSON_ARRAYAGG(us.skill_id) AS skills FROM user_skills us
    //     WHERE us.user_id = ? AND NOT us.skill_id IN (${placeholders})`;
    // values = [id, ...newSkills];
    // const [removingSkills] = await pool.query(sql, values);
    // // Remove skills if any were found
    // if (removingSkills[0].skills) {
    //   placeholders = genPlaceholders(removingSkills[0].skills);
    //   sql = `DELETE FROM user_skills WHERE user_id = ? AND skill_id IN (${placeholders})`;
    //   values = [id, ...removingSkills[0].skills];
    //   await pool.query(sql, values);
    // }
    // // Add new skills or update if already in database
    // sql = `INSERT INTO user_skills (user_id, skill_id, position) VALUES (?, ?, ?) AS new
    //     ON DUPLICATE KEY UPDATE user_id = new.user_id, skill_id = new.skill_id, position = new.position`;
    // for (let skill of skills) {
    //   await pool.query(sql, [id, skill.id, skill.position]);
    // }

    // ----- UPDATE USER'S SOCIALS -----
    // Create array from socials
    const newSocialIds = socials.map((social) => social.id);
    // Add 0 if empty to allow sql statement to still find exisiting data to be removed
    if (newSocialIds.length === 0) {
      newSocialIds.push(0);
    }
    // Get socials already in database that need to be removed
    let placeholders = genPlaceholders(newSocialIds);
    sql = `SELECT JSON_ARRAYAGG(uso.website_id) AS socials FROM user_socials uso
        WHERE uso.user_id = ? AND NOT uso.website_id IN (${placeholders})`;
    values = [id, ...newSocialIds];
    const [removingSocials] = await pool.query(sql, values);
    // Remove socials if any were found
    if (removingSocials[0].socials) {
      placeholders = genPlaceholders(removingSocials[0].socials);
      sql = `DELETE FROM user_socials WHERE user_id = ? AND website_id IN (${placeholders})`;
      values = [id, ...removingSocials[0].socials];
      await pool.query(sql, values);
    }
    // Add new socials or update if already in database
    sql = `INSERT INTO user_socials (user_id, website_id, url) VALUES (?, ?, ?) AS new
        ON DUPLICATE KEY UPDATE user_id = new.user_id, website_id = new.website_id, url = new.url`;
    for (let social of socials) {
      console.log(social);
      await pool.query(sql, [id, social.id, social.url]);
    }

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while updating the user's profile",
    });
  }
};

/**
 * Updates the profile image of user
 * @param req - req.params.id user ID, req.session.id session user ID
 * @param req - req.file - uploaded image file
 * @param res - response
 * @returns res.status - {status:201, data:[{profile_image}]} if success, else {status:400|401, error:...}
 */
const updateProfilePicture = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  // Checks
  if (req.session.userId !== parseInt(id)) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!req.file) {
    return res.status(400).json({
      status: 400,
      error: 'Missing image file',
    });
  }

  try {
    // Download user's uploaded image. Convert to webp and reduce file size
    const fileName = `${id}profile${Date.now()}.webp`;
    const saveTo = join(dirname, '../images/profiles/');
    const filePath = join(saveTo, fileName);

    await sharp(req.file.buffer).webp({ quality: 50 }).toFile(filePath);

    // Remove old image from server
    const [image] = await pool.query('SELECT profile_image FROM users WHERE user_id = ?', [id]);
    if (image[0].profile_image !== null) {
      await unlink(saveTo + image[0].profile_image);
    }

    // Store file name in database
    const sql = 'UPDATE users SET profile_image = ? WHERE user_id = ?';
    const values = [fileName, id];
    await pool.query(sql, values);

    return res.status(201).json({
      status: 201,
      data: [{ profile_image: fileName }],
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while saving the profile picture',
    });
  }
};

/**
 * Replaces users email in database
 * @param req - req.params.id user ID, req.session.id session user ID
 * @param req - req.body - {email, confirm, password} info for the email change
 * @param res - response
 * @returns res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updateEmail = async (req, res) => {
  // Get data
  const id = parseInt(req.params.id);
  const { email, confirm, password } = req.body;

  const [curPassword] = await pool.query('SELECT password FROM users WHERE user_id = ?', [id]);
  const match = await bcrypt.compare(password, curPassword[0].password);

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!email || !confirm || !password) {
    return res.status(400).json({
      status: 400,
      error: 'Missing input information',
    });
  } else if (email !== confirm) {
    return res.status(400).json({
      status: 400,
      error: 'Emails do not match',
    });
  } else if (!match) {
    return res.status(400).json({
      status: 400,
      error: 'Password is incorrect',
    });
  }

  try {
    // Update user primary email
    const sql = 'UPDATE users SET primary_email = ? WHERE user_id = ?';
    const values = [email, id];
    await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while updating the user's primary email",
    });
  }
};

/**
 * Replaces users username in database
 * @param req - req.params.id user ID, req.session.id session user ID
 * @param req - req.body - {username, confirm, password} info for the username change
 * @param res - response
 * @returns res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updateUsername = async (req, res) => {
  // Get data
  const id = parseInt(req.params.id);
  const { username, confirm, password } = req.body;

  const [curPassword] = await pool.query('SELECT password FROM users WHERE user_id = ?', [id]);
  const match = await bcrypt.compare(password, curPassword[0].password);

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!username || !confirm || !password) {
    return res.status(400).json({
      status: 400,
      error: 'Missing input information',
    });
  } else if (username !== confirm) {
    return res.status(400).json({
      status: 400,
      error: 'Usernames do not match',
    });
  } else if (!match) {
    return res.status(400).json({
      status: 400,
      error: 'Password is incorrect',
    });
  }

  try {
    // Update user's username
    const sql = 'UPDATE users SET username = ? WHERE user_id = ?';
    const values = [username, id];
    await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while updating the user's username",
    });
  }
};

/**
 * Replaces users password in database for when user knos current passord but want to change it
 * @param req - req.params.id user ID, req.session.id session user ID
 * @param req - req.body - {newPassword, confirm, password} info for the password change
 * @param res - response
 * @returns res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updatePassword = async (req, res) => {
  // Get data
  const id = parseInt(req.params.id);
  const { newPassword, confirm, password } = req.body;

  const [curPassword] = await pool.query('SELECT password FROM users WHERE user_id = ?', [id]);
  const match = await bcrypt.compare(password, curPassword[0].password);

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!newPassword || !confirm || !password) {
    return res.status(400).json({
      status: 400,
      error: 'Missing input information',
    });
  } else if (newPassword !== confirm) {
    return res.status(400).json({
      status: 400,
      error: 'Passwords do not match',
    });
  } else if (!match) {
    return res.status(400).json({
      status: 400,
      error: 'Current password is incorrect',
    });
  }

  // Hash the new password
  const hashPass = await bcrypt.hash(newPassword, 10);

  try {
    // Update user password
    const sql = 'UPDATE users SET password = ? WHERE user_id = ?';
    const values = [hashPass, id];
    await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while updating the user's password",
    });
  }
};

/**
 * Changes the users visibility of the profile (0=private, 1=public)
 * @param req - req.params.id user ID, req.session.id session user ID
 * @param req - req.body - {newVisibility} 0 or 1 to show visible or not
 * @param res - response
 * @returns res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updateUserVisibility = async (req, res) => {
  // Get data
  const id = parseInt(req.params.id);
  const { newVisibility } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (newVisibility < 0 || newVisibility > 1) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid value for visibility',
    });
  }

  try {
    // Update user's visibility
    const sql = 'UPDATE users SET visibility = ? WHERE user_id = ?';
    const values = [newVisibility, id];
    await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while updating user's visibility",
    });
  }
};

export default updateUser;
export { updateProfilePicture, updateEmail, updateUsername, updatePassword, updateUserVisibility };
