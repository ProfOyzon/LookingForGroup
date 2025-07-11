import express from 'express';
import bcrypt from 'bcrypt';
import { join } from 'path';
import { unlink } from 'fs/promises';
import sharp from 'sharp';
import pool from '../config/database.js';
import { transporter } from '../config/mailer.js';
import envConfig from '../config/env.js';
import { genPlaceholders } from '../utils/sqlUtil.js';

const dirname = import.meta.dirname;

/**
 * Takes login information and retirieves accrount from database
 * @param {express.Request} req - req.body - {loginInput, password} for user login
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, redirect:'/'} if success, else {status:400, error:...}
 */
const login = async (req, res) => {
  const { loginInput, password } = req.body;

  // Checks
  if (!loginInput || !password) {
    res.status(400).json({
      status: 400,
      error: 'Missing login credentials',
    });
    return;
  }

  const userQuery =
    'SELECT user_id, password FROM users WHERE username = ? OR primary_email = ? OR rit_email = ?';
  const [userResult] = await pool.query(userQuery, [loginInput, loginInput, loginInput]);

  // check for user with matching loginInput
  if (!userResult[0]) {
    // no user found
    res.status(400).json({
      status: 400,
      error: 'Wrong username or password',
    });
    return;
  } else {
    // user found, check password
    const match = await bcrypt.compare(password, userResult[0].password);
    if (!match) {
      res.status(400).json({
        status: 400,
        error: 'Wrong username or password',
      });
      return;
    }
  }

  req.session.userId = userResult[0].user_id;

  res.json({ status: 200, redirect: '/' });
  return;
};

/**
 * Checks if user is authenticated
 * @param {express.Request} req - req.session.userId - the current logged in users ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:userId} if authorized, else {status:401, error:...}
 */
const getAuth = async (req, res) => {
  // Allow frontend to check if user is logged in
  if (!req.session.userId) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else {
    res.status(200).json({
      status: 200,
      data: req.session.userId,
    });
    return;
  }
};

/**
 * Checks if user is logged in
 * @param {express.Request} req - req.session - current session to destroy
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {redirect:'/'} if success
 */
const logout = async (req, res) => {
  if (req.session) {
    req.session.destroy();
  }

  res.json({ redirect: '/' });
  return;
};

/**
 * Takes sign up data to send confirmation email. Email stored in database temporarily
 * @param {express.Request} req - req.body - {username, password, confirm, email, firstName, lastName} setup input data
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201} if success, else {status:400, error:...}
 */
const signup = async (req, res) => {
  const validEmails = ['@rit.edu', '@g.rit.edu'];

  // Get input data
  const { username, password, confirm, email, firstName, lastName } = req.body;

  // Checks
  if (!username || !password || !confirm || !email || !firstName || !lastName) {
    res.status(400).json({
      status: 400,
      error: 'Missing sign up information',
    });
    return;
  } else if (password !== confirm) {
    res.status(400).json({
      status: 400,
      error: 'Passwords do not match',
    });
    return;
  } else if (email) {
    const valid = validEmails.some((endingStr) => email.endsWith(endingStr));
    if (!valid) {
      res.status(400).json({
        status: 400,
        error: 'Use a RIT email',
      });
      return;
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

    res.status(201).json({
      status: 201,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred during sign up',
    });
    return;
  }
};

/**
 * Adds new user and thier data to database.
 * Uses token from signup
 * @param {express.Request} req - req.params - {token} token to verify user
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400, error:...}
 */
const createUser = async (req, res) => {
  // Get token from url
  const { token } = req.params;

  try {
    // Get signup email if token is valid
    const [email] = await pool.query(
      'SELECT rit_email FROM signups WHERE token = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)',
      [token],
    );
    if (email.length < 1) {
      res.status(400).json({
        status: 400,
        error: 'Your token has expired',
      });
      return;
    }
    // Check if an user with the email already exists
    const [user] = await pool.query('SELECT rit_email FROM users WHERE rit_email = ?', [
      email[0].rit_email,
    ]);
    if (user.length > 0) {
      res.status(400).json({
        status: 400,
        error: 'Your account has already been activated',
      });
      return;
    }

    // Add user officially to database
    const sql = ` INSERT INTO users (username, primary_email, rit_email, password, first_name, last_name)
            SELECT username, primary_email, rit_email, password, first_name, last_name
            FROM signups
            WHERE token = ?
        `;
    const values = [token];
    await pool.query(sql, values);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while activating the user's account",
    });
    return;
  }
};

/**
 * Makes request to reset a user password. Send email stored in database temporarily.
 * @param {express.Request} req - req.body - {email} the email adress to sent reset to
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201} if successful send, else {status:400, error:...}
 */
const requestPasswordReset = async (req, res) => {
  // Get input data
  const { email } = req.body;

  // Checks
  if (!email) {
    res.status(400).json({
      status: 400,
      error: 'Missing email',
    });
    return;
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
        Forgot your password? You have 15 minutes to reset your password. Click the button below.
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

    res.status(201).json({
      status: 201,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred during password reset request',
    });
    return;
  }
};

/**
 * Replaces password of an existing user
 * @param {express.Request} req - req.params - {token} from password reset link
 * @param {express.Request} req - req.body - {password, confirm} inputs for new password
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201} if successful send, else {status:400, error:...}
 */
const resetPassword = async (req, res) => {
  // Get data
  const { token } = req.params;
  const { password, confirm } = req.body;

  if (!password || !confirm) {
    res.status(400).json({
      status: 400,
      error: 'Missing passwords',
    });
    return;
  } else if (password !== confirm) {
    res.status(400).json({
      status: 400,
      error: 'Passwords do not match',
    });
    return;
  }

  // Hash the password
  const hashPass = await bcrypt.hash(password, 10);

  try {
    // Get email if token is valid
    // Add 5 minute leeway to the 15 minutes stated in email, to account for time taken for email to arrive
    const [email] = await pool.query(
      'SELECT primary_email FROM password_resets WHERE token = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 20 MINUTE)',
      [token],
    );
    if (email.length < 1) {
      res.status(400).json({
        status: 400,
        error: 'Your token has expired',
      });
      return;
    }

    // Update user password
    const sql = 'UPDATE users SET password = ? WHERE primary_email = ?';
    const values = [hashPass, email[0].primary_email];
    await pool.query(sql, values);

    res.status(201).json({
      status: 201,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while updating user's password",
    });
    return;
  }
};

/**
 * Retrieves a list of all users from database
 * @param {express.Request} req - not used
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:[users]} if successful, else {status:400, error:...}
 */
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
            WHERE u.visibility = '1'
        `;
    const [users] = await pool.query(sql);

    res.status(200).json({
      status: 200,
      data: users,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting all users',
    });
    return;
  }
};

/**
 * Retrieves a user based on thier user ID number
 * @param {express.Request} req - req.params - {id} the user ID of the being searched for
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:[user]} if successful, else {status:400, error:...}
 */
const getUserById = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get data of a user
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username, u.profile_image, u.headline, u.pronouns, 
            jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, u.bio, u.visibility, s.skills, so.socials
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

    res.status(200).json({
      status: 200,
      data: user,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the user',
    });
    return;
  }
};

/**
 * Retrieves a user based on thier username
 * @param {express.Request} req - req.params - {username} the username of the user being searched for
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:[user]} if successful, else {status:400, error:...}
 */
const getUserByUsername = async (req, res) => {
  // Get username from url
  const { username } = req.params;

  try {
    // Find same username in database
    const sql = `SELECT * FROM users WHERE username = ?`;
    const [user] = await pool.query(sql, [username]);

    res.status(200).json({
      status: 200,
      data: user,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the username',
    });
    return;
  }
};

/**
 * Retrieves a user based on thier email
 * @param {express.Request} req - req.params - {email} the email of the user being searched for
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:[user]} if successful, else {status:400, error:...}
 */
const getUserByEmail = async (req, res) => {
  // Get email from url
  const { email } = req.params;

  try {
    // Find same username in database
    const sql = `SELECT * FROM users WHERE primary_email = ? OR rit_email = ?`;
    const [user] = await pool.query(sql, [email, email]);

    res.status(200).json({
      status: 200,
      data: user,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the email',
    });
    return;
  }
};

/**
 * Retrieves a username based on current logged in session user ID
 * @param {express.Request} req - req.session,userId - the user ID from session
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:user} if successful, else {status:400, error:...}
 */
const getUsernameBySession = async (req, res) => {
  try {
    const [user] = await pool.query(
      `SELECT first_name, last_name, username, primary_email, profile_image FROM users WHERE user_id = ?`,
      [req.session.userId],
    );
    res.status(200).json({
      status: 200,
      data: user[0],
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting the user',
    });
    return;
  }
};

/**
 * Updates users data in database
 * @param {express.Request} req - req.params.id - current users ID
 * @param {express.Request} req - req.body - {firstname, lastname, ...} all user feilds to be updated
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if successful, else {status:400|401, error:...}
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
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!firstName) {
    res.status(400).json({
      status: 400,
      error: "Missing user's first name",
    });
    return;
  } else if (!lastName) {
    res.status(400).json({
      status: 400,
      error: "Missing user's last name",
    });
    return;
  } else if (!jobTitleId || jobTitleId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing job title id',
    });
    return;
  } else if (!majorId || jobTitleId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing major id',
    });
    return;
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

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while updating the user's profile",
    });
    return;
  }
};

/**
 * Deletes user by checking user ID to session ID
 * @param {express.Request} req - req.params.id the ID of user to delete, req.session.id session user ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if successful, else {status:400|401, error:...}
 */
const deleteUser = async (req, res) => {
  // Get data
  const { id } = req.params;
  console.log(typeof id);
  console.log(typeof req.session.userId);

  // Checks
  if (req.session.userId !== Number(id)) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  }

  try {
    // Delete user
    await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while deleting the user',
    });
    return;
  }
};

/**
 * Updates the profile image of user
 * @param {express.Request} req - req.params.id user ID, req.session.id session user ID
 * @param {express.Request} req - req.file - uploaded image file
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201, data:[{profile_image}]} if success, else {status:400|401, error:...}
 */
const updateProfilePicture = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  // Checks
  if (req.session.userId !== parseInt(id)) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!req.file) {
    res.status(400).json({
      status: 400,
      error: 'Missing image file',
    });
    return;
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

    res.status(201).json({
      status: 201,
      data: [{ profile_image: fileName }],
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while saving the profile picture',
    });
    return;
  }
};

/**
 * Gets the current users account data
 * @param {express.Request} req - req.params.id user ID, req.session.id session user ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:account} if success, else {status:400|401, error:...}
 */
const getAccount = async (req, res) => {
  // Get data
  //const { id } = req.params;
  const id = parseInt(req.params.id);

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  }

  try {
    // Get account information
    const sql =
      'SELECT u.user_id, u.primary_email, u.rit_email, u.username, u.visibility FROM users u WHERE user_id = ?';
    const values = [id];
    const [account] = await pool.query(sql, values);

    res.status(200).json({
      status: 200,
      data: account,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while getting the user's account information",
    });
    return;
  }
};

/**
 * Replaces users email in database
 * @param {express.Request} req - req.params.id user ID, req.session.id session user ID
 * @param {express.Request} req - req.body - {email, confirm, password} info for the email change
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updateEmail = async (req, res) => {
  // Get data
  const id = parseInt(req.params.id);
  const { email, confirm, password } = req.body;

  const [curPassword] = await pool.query('SELECT password FROM users WHERE user_id = ?', [id]);
  const match = await bcrypt.compare(password, curPassword[0].password);

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!email || !confirm || !password) {
    res.status(400).json({
      status: 400,
      error: 'Missing input information',
    });
    return;
  } else if (email !== confirm) {
    res.status(400).json({
      status: 400,
      error: 'Emails do not match',
    });
    return;
  } else if (!match) {
    res.status(400).json({
      status: 400,
      error: 'Password is incorrect',
    });
    return;
  }

  try {
    // Update user primary email
    const sql = 'UPDATE users SET primary_email = ? WHERE user_id = ?';
    const values = [email, id];
    await pool.query(sql, values);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while updating the user's primary email",
    });
    return;
  }
};

/**
 * Replaces users username in database
 * @param {express.Request} req - req.params.id user ID, req.session.id session user ID
 * @param {express.Request} req - req.body - {username, confirm, password} info for the username change
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updateUsername = async (req, res) => {
  // Get data
  const id = parseInt(req.params.id);
  const { username, confirm, password } = req.body;

  const [curPassword] = await pool.query('SELECT password FROM users WHERE user_id = ?', [id]);
  const match = await bcrypt.compare(password, curPassword[0].password);

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!username || !confirm || !password) {
    res.status(400).json({
      status: 400,
      error: 'Missing input information',
    });
    return;
  } else if (username !== confirm) {
    res.status(400).json({
      status: 400,
      error: 'Usernames do not match',
    });
    return;
  } else if (!match) {
    res.status(400).json({
      status: 400,
      error: 'Password is incorrect',
    });
    return;
  }

  try {
    // Update user's username
    const sql = 'UPDATE users SET username = ? WHERE user_id = ?';
    const values = [username, id];
    await pool.query(sql, values);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while updating the user's username",
    });
    return;
  }
};

/**
 * Replaces users password in database for when user knos current passord but want to change it
 * @param {express.Request} req - req.params.id user ID, req.session.id session user ID
 * @param {express.Request} req - req.body - {newPassword, confirm, password} info for the password change
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updatePassword = async (req, res) => {
  // Get data
  const id = parseInt(req.params.id);
  const { newPassword, confirm, password } = req.body;

  const [curPassword] = await pool.query('SELECT password FROM users WHERE user_id = ?', [id]);
  const match = await bcrypt.compare(password, curPassword[0].password);

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!newPassword || !confirm || !password) {
    res.status(400).json({
      status: 400,
      error: 'Missing input information',
    });
    return;
  } else if (newPassword !== confirm) {
    res.status(400).json({
      status: 400,
      error: 'Passwords do not match',
    });
    return;
  } else if (!match) {
    res.status(400).json({
      status: 400,
      error: 'Current password is incorrect',
    });
    return;
  }

  // Hash the new password
  const hashPass = await bcrypt.hash(newPassword, 10);

  try {
    // Update user password
    const sql = 'UPDATE users SET password = ? WHERE user_id = ?';
    const values = [hashPass, id];
    await pool.query(sql, values);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while updating the user's password",
    });
    return;
  }
};

/**
 * Changes the users visibility of the profile (0=private, 1=public)
 * @param {express.Request} req - req.params.id user ID, req.session.id session user ID
 * @param {express.Request} req - req.body - {newVisibility} 0 or 1 to show visible or not
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updateUserVisibility = async (req, res) => {
  // Get data
  const id = parseInt(req.params.id);
  const { newVisibility } = req.body;

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (newVisibility < 0 || newVisibility > 1) {
    res.status(400).json({
      status: 400,
      error: 'Invalid value for visibility',
    });
    return;
  }

  try {
    // Update user's visibility
    const sql = 'UPDATE users SET visibility = ? WHERE user_id = ?';
    const values = [newVisibility, id];
    await pool.query(sql, values);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while updating user's visibility",
    });
    return;
  }
};

/**
 * Retirves all projects the user is a member of
 * @param {express.Request} req - req.params.id user ID, req.session.id session user ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:projects} if success, else {status:400|401, error:...}
 */
const getMyProjects = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  // Checks
  if (`${req.session.userId}` !== `${id}`) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
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

    res.status(200).json({
      status: 200,
      data: projects,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting projects the user is a member of',
    });
    return;
  }
};

/**
 * Retirves all public visible projects the user is a member of
 * @param {express.Request} req - req.params.id - user ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:projects} if success, else {status:400, error:...}
 */
const getVisibleProjects = async (req, res) => {
  // Get id from url
  const { id } = req.params;

  try {
    // Get projects the user is a member and is set to be publicly visible
    const sql = `SELECT p.* 
            FROM members m
            JOIN (SELECT p.project_id, p.title, p.hook, p.thumbnail, p.created_at, g.project_types, t.tags, f.followers
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
                ON p.project_id = t.project_id
                JOIN (SELECT pf.project_id, JSON_ARRAYAGG(JSON_OBJECT('id', pf.user_id)) AS followers
                    FROM project_followings pf
                    GROUP BY pf.project_id) f
                ON p.project_id = f.project_id) p
            ON m.project_id = p.project_id
            WHERE m.user_id = ? AND profile_visibility = "public"
        `;
    const values = [id];
    const [projects] = await pool.query(sql, values);

    // Format the follower section so it doesn't provide IDs
    projects.forEach((project) => {
      let followers = project.followers;

      project.followers = {
        count: followers.length,
        isFollowing: followers.find((follower) => req.session.userId === follower.id) !== undefined,
      };
    });

    res.status(200).json({
      status: 200,
      data: projects,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error:
        'An error occurred while getting projects the user is a member of and that are publicly visible',
    });
    return;
  }
};

/**
 * Changes the visibility of a users project (public or private)
 * @param {express.Request} req - req.params.id - user ID, req.session - seesion user ID
 * @param {express.Request} req - req.body - {projId, visibility}
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|401, error:...}
 */
const updateProjectVisibility = async (req, res) => {
  // Get input data
  const id = parseInt(req.params.id);
  const { projectId, visibility } = req.body;

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!projectId || projectId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
    return;
  } else if (!visibility) {
    res.status(400).json({
      status: 400,
      error: 'Missing a visibility',
    });
    return;
  }

  try {
    // Update a project visibility on user profiles
    const sql = 'UPDATE members SET profile_visibility = ? WHERE project_id = ? AND user_id = ?';
    const values = [visibility, projectId, id];
    await pool.query(sql, values);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: "An error occurred while updating the visibility of a project on a user's profile",
    });
    return;
  }
};

/**
 * Gets all projects the user is following
 * @param {express.Request} req - req.params.id - user ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:projects} if success, else {status:400, error:...}
 */
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

    res.status(200).json({
      status: 200,
      data: projects,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting projects the user is following',
    });
    return;
  }
};

/**
 * Adds a link between a project and user that indicates the user is “following” that project to database.
 * @param {express.Request} req - req.params.id - user ID, req.body.projectId - project ID to follow
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201} if success, else {status:400|401, error:...}
 */
const addProjectFollowing = async (req, res) => {
  // Get input data
  const id = parseInt(req.params.id);
  const projectId = parseInt(req.body.projectId);

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!projectId || projectId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
    return;
  }

  try {
    // Add a project the user decided to follow
    await pool.query('INSERT INTO project_followings (user_id, project_id) VALUES (?, ?)', [
      id,
      projectId,
    ]);

    res.status(201).json({
      status: 201,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while adding a project the user wants to follow',
    });
    return;
  }
};

/**
 * Removes a link between a project and user that indicates the user is not “following” that project anymore from database.
 * @param {express.Request} req - req.params.id - user ID, req.params.projectId - project ID to unfollow
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|401, error:...}
 */
const deleteProjectFollowing = async (req, res) => {
  // Get input data
  const id = parseInt(req.params.id);
  const projId = parseInt(req.params.projId);

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!projId || projId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing project id',
    });
    return;
  }

  try {
    // Delete a project the user was following
    await pool.query('DELETE FROM project_followings WHERE user_id = ? AND project_id = ?', [
      id,
      projId,
    ]);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while removing a project the user wants to unfollow',
    });
    return;
  }
};

/**
 * Gets all other users the user is following
 * @param {express.Request} req - req.params.id - user ID
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200, data:users} if success, else {status:400, error:...}
 */
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

    res.status(200).json({
      status: 200,
      data: users,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while getting people the user is following',
    });
    return;
  }
};

/**
 * Adds a link between two users to indicate one is “following” the other in database
 * @param {express.Request} req - req.params.id - user ID, req.body.userId - ID of target user to follow
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:201} if success, else {status:400|401, error:...}
 */
const addUserFollowing = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { userId } = req.body;

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!userId || userId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing user id',
    });
    return;
  }

  try {
    // Add entry to track user following a person
    await pool.query('INSERT INTO user_followings (user_id, following_id) VALUES (?, ?)', [
      id,
      userId,
    ]);

    res.status(201).json({
      status: 201,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while adding a person the user wants to follow',
    });
    return;
  }
};

/**
 * Removes a link between two user to indicate one is not “following” the other anymore from database.
 * @param {express.Request} req - req.params.id - user ID, req.body.userId - ID of target user to unfollow
 * @param {express.Response} res - response
 * @returns {Promise<void>} res.status - {status:200} if success, else {status:400|401, error:...}
 */
const deleteUserFollowing = async (req, res) => {
  // Get input data
  const { id } = req.params;
  const { userId } = req.body;

  // Checks
  if (req.session.userId !== id) {
    res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
    return;
  } else if (!userId || userId < 1) {
    res.status(400).json({
      status: 400,
      error: 'Missing user id',
    });
    return;
  }

  try {
    // Delete entry tracking the user following a person
    await pool.query('DELETE FROM user_followings WHERE user_id = ? AND following_id = ?', [
      id,
      userId,
    ]);

    res.status(200).json({
      status: 200,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      error: 'An error occurred while removing a person the user wants to unfollow',
    });
    return;
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
