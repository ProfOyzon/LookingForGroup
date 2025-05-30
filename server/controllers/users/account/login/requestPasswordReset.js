/**
 * Makes request to reset a user password. Send email stored in database temporarily.
 * @param req - req.body - {email} the email adress to sent reset to
 * @param res - response
 * @returns res.status - {status:201} if successful send, else {status:400, error:...}
 */
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

export default requestPasswordReset;
