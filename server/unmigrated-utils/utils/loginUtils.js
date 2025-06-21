///import {login} from '../controllers/users';
import envConfig from '../config/env.js';
import { transporter } from '../config/mailer.js';
import { POST, RESPONSE } from './fetchUtils.js';
import bcrypt from 'bcrypt';

const root =
  envConfig.env === 'development' || envConfig.env === 'test'
    ? 'http://localhost:8081/api'
    : 'https://lfg.gccis.rit.edu/api';

// Add Shibboleth login here. Functions are set out in controllers/users.js to login, these are not utilized.

/**
 * Takes sign up data to send confirmation email. The email is then stored in database temporarily
 * @param {string} _username - username to sign up
 * @param {string} _password - password used by user
 * @param {string} _confirmPassword - same password to confirm match
 * @param {string} _email - rit email adress to send activation link to
 * @param {string} _firstName - User first name
 * @param {string} _lastName - ueser last name
 * @returns res.status - 201 if success, else status:400, error. Returns token if in dev mode.
 */
async function sendSignup(_username, _password, _confirmPassword, _email, _firstName, _lastName) {
  //set up input data
  if (!_username || !_password || !_confirmPassword || !_email || !_firstName || !_lastName) {
    return RESPONSE(400, '', 'Missing sign up information');
  } else if (_password !== _confirmPassword) {
    return RESPONSE(400, '', 'Passwords do not match.');
  }

  const hashPass = await bcrypt.hash(_password, 10);
  const _token = crypto.randomUUID();
  let url = ``;

  //add user info to database, set up for account activation
  url = `${root}/activation/${_token}`;
  console.log(url);
  console.log(_token);

  const data = {
    token: _token,
    username: _username,
    email: _email,
    password: hashPass,
    firstName: _firstName,
    lastName: _lastName,
  };

  try {
    if (envConfig.env === 'development' || envConfig.env === 'test') {
      console.log('development');
      return RESPONSE(201, _token, '');
    }

    //insert into database
    if (envConfig.env === 'production') {
      const response = await POST(url, data);
      if (response.ok) {
        console.log('Information put into database.');
      } else {
        return RESPONSE(400, '', 'Error posting into database.');
      }
      const emailhtml = `
        <p>Hi ${_firstName},<br>
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
        to: _email,
        subject: 'Activate Your LFG Account',
        html: emailhtml,
      };

      //send activation email
      await transporter.sendMail(message);
      return RESPONSE(201, '', '');
    }
  } catch (error) {
    console.log(error);
    return RESPONSE(400, '', 'An error occurred during sign up.');
  }
}

/**
 * Login as the user.
 * @param {string} _loginInput - Username or email of the user
 * @param {string} _password - users password
 * @returns status
 */
async function login(_loginInput, _password) {
  try {
    const r = await POST(`${root}/login`, {
      loginInput: _loginInput,
      password: _password,
    });

    if (r.ok) {
      console.log('Logged in.');
      return RESPONSE(201, r.data);
    } else {
      return RESPONSE(r.status, '', r.error);
    }
  } catch (err) {
    console.log(err);
    return RESPONSE(400, '', err);
  }
}

/**
 * Checks if user is logged in.
 * @param {Object} session - current session to destroy
 * @returns status - redirect:'/' if success
 */
async function logout(session) {
  if (session) {
    session.destroy();
  }

  return {
    redirect: '/',
  };
}

/**
 * Checks if user is authenticated
 * @param {number} id - int, user id checking logged in.
 * @returns status
 */
async function getAuth(id) {
  if (!id) {
    console.log('no id.');
    return RESPONSE(401, '', 'Unauthorized, no id.');
  } else {
    //check if logged in

    return RESPONSE(200, id, '');
  }
}

export default {
  sendSignup,
  login,
  getAuth,
  logout,
};
