import pool from '../config/database.js';

/**
 * Takes sign up data to send confirmation e-mail. E-mail stored in database temporarily
 * @param req - req.body - {username, password, confirm, email, firstName, lastName} setup input data
 * @param res - response
 * @returns res.status - {status:201} if success, else {status:400, error:...}
 */
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

export default signup;
