import bcrypt from 'bcrypt';
import { join } from 'path';
import { unlink } from 'fs/promises';
import sharp from 'sharp';
import pool from '../config/database.js';
import { transporter } from '../config/mailer.js';
import envConfig from '../config/env.js';
import { genPlaceholders } from '../utils/sqlUtil.js';

const dirname = import.meta.dirname;

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

const logout = async (req, res) => {
  if (req.session) {
    req.session.destroy();
  }

  return res.json({ redirect: '/' });
};

const signup = async (req, res) => {
  const validEmails = ['@rit.edu', '@g.rit.edu'];

  // Get input data
  const { username, password, confirm, email, firstName, lastName } = req.body;

  // Checks
  if (!username || !password || !confirm || !email || !firstName || !lastName) {
    return res.status(400).json({
      status: 400,
      error: 'Missing sign up information',
    });
  } else if (password !== confirm) {
    return res.status(400).json({
      status: 400,
      error: 'Passwords do not match',
    });
  } else if (email) {
    const valid = validEmails.some((endingStr) => email.endsWith(endingStr));
    if (!valid) {
      return res.status(400).json({
        status: 400,
        error: 'Use a RIT email',
      });
    }
  }

  // Hash the password and generate a token for account activation
  const hashPass = await bcrypt.hash(password, 10);
  const token = crypto.randomUUID();

  // Change url based on environment to allow for signups to your local database
  let url = ``;
  if (envConfig.env === 'production') {
    url = `https://lookingforgrp.com/activation/${token}`;
  } else {
    url = `http://localhost:8081/activation/${token}`;
  }

  try {
    // Add user information to database, setting up for account activation
    const sql =
      'INSERT INTO signups (token, username, primary_email, rit_email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [token, username, email, email, hashPass, firstName, lastName];
    await pool.query(sql, values);

    // Email content
    const html = `
        <p>Hi ${firstName},<br>
        Thank you for signing up to LFG. You have 1 day to activate your account. Click the button below.
        </p>
        
        <div style="margin: 2rem 1rem">
        <a style="font-size:1.25rem; color:#FFFFFF; background-color:#271D66; text-align:center; margin:2rem 0; padding:1rem; text-decoration:none;"
        href="${url}" target="_blank">Activate Account</a>
        </div>

        <p>If the button doesn't work, use the following link:</p>
        <a href="${url}" target="_blank">${url}</a>

        <p>Kind regards,<br>
        LFG Team</p>
        `;

    const message = {
      from: envConfig.mailerEmail,
      to: email,
      subject: 'Activate Your LFG Account',
      html: html,
    };

    // Send account activation email
    await transporter.sendMail(message);

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred during sign up',
    });
  }
};

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

const requestPasswordReset = async (req, res) => {
  // Get input data
  const { email } = req.body;

  // Checks
  if (!email) {
    return res.status(400).json({
      status: 400,
      error: 'Missing email',
    });
  }

  // Generate a token for password reset
  const token = crypto.randomUUID();

  // Change url based on environment to allow for changes to your local database
  let url = ``;
  if (envConfig.env === 'production') {
    url = `https://lookingforgrp.com/resetPassword/${token}`;
  } else {
    url = `http://localhost:8081/resetPassword/${token}`;
  }

  try {
    // Add user information to database, setting up for password reset
    const sql = 'INSERT INTO password_resets (token, primary_email) VALUES (?, ?)';
    const values = [token, email];
    await pool.query(sql, values);

    // Email content
    const html = `
        <p>Hi,<br>
        Forgot you password? You have 15 minutes to reset your password. Click the button below.
        </p>
        
        <div style="margin: 2rem 1rem">
        <a style="font-size:1.25rem; color:#FFFFFF; background-color:#271D66; text-align:center; margin:2rem 0; padding:1rem; text-decoration:none;"
        href="${url}" target="_blank">Reset Password</a>
        </div>

        <p>If the button doesn't work, use the following link:</p>
        <a href="${url}" target="_blank">Need a link</a>

        <p>Kind regards,<br>
        LFG Team</p>
        `;

    const message = {
      from: envConfig.mailerEmail,
      to: email,
      subject: 'Reset Your LFG Password',
      html: html,
    };

    // Send account activation email
    await transporter.sendMail(message);

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred during password reset request',
    });
  }
};

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

const getUsers = async (req, res) => {
  try {
    // Get data on all users
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns, 
        jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, u.created_at, s.skills
            FROM users u
            LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
                FROM job_titles jt) jt
            ON u.job_title_id = jt.title_id
            LEFT JOIN (SELECT m.major_id, m.label AS major
                FROM majors m) m
            ON u.major_id = m.major_id
            LEFT JOIN (SELECT us.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", s.skill_id, "skill", s.label, "type", s.type,
                "position", us.position)) AS skills
                FROM user_skills us 
                JOIN skills s 
                    ON us.skill_id = s.skill_id
                GROUP BY us.user_id) s
            ON u.user_id = s.user_id
        `;
    const [users] = await pool.query(sql);

    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting all users',
    });
  }
};

const getUserById = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get data of a user
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username, u.profile_image, u.headline, u.pronouns, 
            jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, u.bio, s.skills, so.socials
            FROM users u
            LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
                FROM job_titles jt) jt
            ON u.job_title_id = jt.title_id
            LEFT JOIN (SELECT m.major_id, m.label AS major
                FROM majors m) m
            ON u.major_id = m.major_id
            LEFT JOIN (SELECT us.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", s.skill_id, "skill", s.label, "type", s.type,
                "position", us.position)) AS skills
                FROM user_skills us 
                JOIN skills s 
                    ON us.skill_id = s.skill_id
                GROUP BY us.user_id) s
            ON u.user_id = s.user_id
            LEFT JOIN (SELECT uso.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", so.website_id, "website", so.label, "url", uso.url)) AS socials
                FROM user_socials uso 
                JOIN socials so
                    ON uso.website_id = so.website_id
                GROUP BY uso.user_id) so
            ON u.user_id = so.user_id
            WHERE u.user_id = ? 
            `;
    const values = [id];
    const [user] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the user',
    });
  }
};

const getUserByUsername = async (req, res) => {
  // Get username from url
  const { username } = req.params;

  try {
    // Find same username in database
    const sql = `SELECT * FROM users WHERE username = ?`;
    const [user] = await pool.query(sql, [username]);

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the username',
    });
  }
};

const getUserByEmail = async (req, res) => {
  // Get email from url
  const { email } = req.params;

  try {
    // Find same username in database
    const sql = `SELECT * FROM users WHERE primary_email = ? OR rit_email = ?`;
    const [user] = await pool.query(sql, [email, email]);

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the email',
    });
  }
};

const getUsernameBySession = async (req, res) => {
  try {
    const [user] = await pool.query(
      `SELECT first_name, last_name, username, primary_email FROM users WHERE user_id = ?`,
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

const updateUser = async (req, res) => {
  // Get input data
  const { id } = req.params;
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

const deleteUser = async (req, res) => {
  // Get data
  const { id } = req.params;

  // Checks
  if (req.session.userId !== id) {
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
      'SELECT u.user_id, u.primary_email, u.rit_email, u.username FROM users u WHERE user_id = ?';
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

// Sets project visibility to either 'public' or 'private
// 0 - private
// 1 - public
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
}

const getMyProjects = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  // Checks
  if (`${req.session.userId}` !== `${id}`) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }

  try {
    // Get projects the user is a member of
    const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, p.user_id, p.created_at, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ?
        `;
    const values = [id];
    const [projects] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: projects,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting projects the user is a member of',
    });
  }
};

const getVisibleProjects = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get projects the user is a member and is set to be publicly visible
    const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, p.created_at, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ? AND profile_visibility = "public"
        `;
    const values = [id];
    const [projects] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: projects,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error:
        'An error occurred while getting projects the user is a member of and that are publicly visible',
    });
  }
};

const updateProjectVisibility = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { projectId, visibility } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!projectId || projectId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
  } else if (!visibility) {
    return res.status(400).json({
      status: 400,
      error: 'Missing a visibility',
    });
  }

  try {
    // Update a project visibility on user profiles
    const sql = 'UPDATE members SET profile_visibility = ? WHERE project_id = ? AND user_id = ?';
    const values = [visibility, projectId, id];
    await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while updating the visibility of a project on a user's profile",
    });
  }
};

const getProjectFollowing = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get projects the user is following
    const sql = `SELECT p.*, pf.followed_at
            FROM project_followings pf
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, g.project_types, t.tags
                FROM projects p
                JOIN (SELECT pg.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", g.type_id, "project_type", g.label)) AS project_types 
                    FROM project_genres pg 
                    JOIN genres g 
                        ON pg.type_id = g.type_id
                    GROUP BY pg.project_id) g
                ON p.project_id = g.project_id
                JOIN (SELECT pt.project_id, JSON_ARRAYAGG(JSON_OBJECT("id", t.tag_id, "tag", t.label, "type", t.type,
                "position", pt.position)) AS tags
                    FROM project_tags pt 
                    JOIN tags t 
                        ON pt.tag_id = t.tag_id
                    GROUP BY pt.project_id) t
                ON p.project_id = t.project_id) p
            ON pf.project_id = p.project_id
            WHERE pf.user_id = ?
        `;
    const values = [id];
    const [projects] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: projects,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting projects the user is following',
    });
  }
};

const addProjectFollowing = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { projectId } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!projectId || projectId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
  }

  try {
    // Add a project the user decided to follow
    await pool.query('INSERT INTO project_followings (user_id, project_id) VALUES (?, ?)', [
      id,
      projectId,
    ]);

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while adding a project the user wants to follow',
    });
  }
};

const deleteProjectFollowing = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { projectId } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!projectId || projectId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
  }

  try {
    // Delete a project the user was following
    await pool.query('DELETE FROM project_followings WHERE user_id = ? AND project_id = ?', [
      id,
      projectId,
    ]);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while removing a project the user wants to unfollow',
    });
  }
};

const getUserFollowing = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get people the user is following
    const sql = `SELECT u.*, uf.followed_at 
            FROM user_followings uf
            JOIN (SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns, 
            jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, s.skills
                FROM users u
                    LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
                    FROM job_titles jt) jt
                        ON u.job_title_id = jt.title_id
                    LEFT JOIN (SELECT m.major_id, m.label AS major
                    FROM majors m) m
                        ON u.major_id = m.major_id
                    LEFT JOIN (SELECT us.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", s.skill_id, "skill", s.label, "type", s.type,
                        "position", us.position)) AS skills
                        FROM user_skills us 
                        JOIN skills s 
                            ON us.skill_id = s.skill_id
                        GROUP BY us.user_id) s
                    ON u.user_id = s.user_id
                GROUP BY u.user_id) u
            ON uf.following_id = u.user_id
            WHERE uf.user_id = ?
        `;
    const values = [id];
    const [users] = await pool.query(sql, values);

    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while getting people the user is following',
    });
  }
};

const addUserFollowing = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { userId } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!userId || userId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing user id',
    });
  }

  try {
    // Add entry to track user following a person
    await pool.query('INSERT INTO user_followings (user_id, following_id) VALUES (?, ?)', [
      id,
      userId,
    ]);

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while adding a person the user wants to follow',
    });
  }
};

const deleteUserFollowing = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { userId } = req.body;

  // Checks
  if (req.session.userId !== id) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  } else if (!userId || userId < 1) {
    return res.status(400).json({
      status: 400,
      error: 'Missing user id',
    });
  }

  try {
    // Delete entry tracking the user following a person
    await pool.query('DELETE FROM user_followings WHERE user_id = ? AND following_id = ?', [
      id,
      userId,
    ]);

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: 'An error occurred while removing a person the user wants to unfollow',
    });
  }
};

// Removed due to Vite compilation error, still need to be added at some point
// blockUser,
// unblockUser,
// reportUser,

// Block a user
export default {
  login,
  getAuth,
  logout,
  signup,
  createUser,
  requestPasswordReset,
  resetPassword,
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getUsernameBySession,
  updateUser,
  deleteUser,
  updateProfilePicture,
  getAccount,
  updateEmail,
  updateUsername,
  updatePassword,
  updateUserVisibility,
  getMyProjects,
  getVisibleProjects,
  updateProjectVisibility,
  getProjectFollowing,
  addProjectFollowing,
  deleteProjectFollowing,
  getUserFollowing,
  addUserFollowing,
  deleteUserFollowing,
};
