///import {login} from '../controllers/users';
import envConfig from '../config/env.js';
import { POST } from './fetchUtils.js';
import bcrypt from 'bcrypt';

const root =
  envConfig.env === 'development' || envConfig.env === 'test'
    ? 'https://localhost:8081/api'
    : 'https://lfg.gccis.rit.edu/api';

// Add Shibboleth login here. Functions are set out in controllers/users.js to login, these are not utilized.

/**
 * Takes sign up data to send confirmation email. The email is then stored in database temporarily
 *
 * @param {*} _username - username to sign up
 * @param {*} _password
 * @param {*} _confirmPassword
 * @param {*} _email
 * @param {*} _firstName
 * @param {*} _lastName
 * @returns res.status - 201 if success, else status:400, error. Returns token if in dev mode.
 */
async function sendSignup(_username, _password, _confirmPassword, _email, _firstName, _lastName) {
  //set up input data
  let res = {
    status: 0,
    body: '',
    error: '',
  };
  if (!_username || !_password || !_confirmPassword || !_email || !_firstName || !_lastName) {
    return res({
      status: 400,
      error: 'Missing sign up information',
    });
  } else if (_password !== _confirmPassword) {
    return res({
      status: 400,
      error: 'Passwords do not match',
    });
  }

  const hashPass = await bcrypt.hash(_password, 10);
  const _token = crypto.randomUUID();
  let url = ``;

  //add user info to database, set up for account activation

  url = `https://lookingforgrp.com/activation/${_token}`;
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

  //insert into database
  if (envConfig.env === 'production') {
    try {
      const response = await POST(url, data);
      if (response.ok) {
        console.log('Information put into database.');
      } else {
        return (res = {
          status: 400,
          error: 'Error posting into database.',
        });
      }
      const emailhtml = `
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
        to: _email,
        subject: 'Activate Your LFG Account',
        html: emailhtml,
      };

      //send activation email
      await transporter.sendMail(message);
    } catch (err) {
      console.log(err);
      return (res = {
        status: 400,
        error: 'An error occured during sign up',
      });
    }
  }

  if (envConfig.env === 'development') {
    console.log('development');
    return {
      status: 201,
      data: _token,
    };
  }

  return {
    status: 201,
  };
}

/**
 * Login as the user.
 * @param {*} loginInput - string, Username or email of the user
 * @param {*} password - string, password
 * @returns status
 */
async function login(loginInput, password) {
  try {
    const r = await POST(`${root}/login`, {
      loginInput: loginInput,
      password: password,
    });

    if (r.ok) {
      console.log('Logged in.');
      return {
        status: 201,
        data: r.data,
      };
    }
  } catch (err) {
    console.log(err);

    return {
      status: 400,
      error: err,
    };
  }
}

/**
 * Checks if user is logged in.
 * @param session - current session to destroy
 * @returns status, redirect:'/' if success
 */
async function logout(session) {
  if (session) {
    session.destroy();
  }
  return (res = {
    redirect: '/',
  });
}

/**
 * Checks if user is authenticated
 * @param userID - int, user id checking logged in.
 * @returns status
 */
async function getAuth(id) {
  if (!id) {
    console.log('no id.');
    return (res = {
      status: 401,
      error: 'Unauthorized, no id.',
    });
  } else {
    return (res = {
      status: 200,
      data: id,
    });
  }
}

/**
 * create a user using the token from signup.
 * @param {*} token - token from signup, to verify user
 * @returns status
 */
// async function createUser(token) {
//     try {
//         //get signup email if valid
//         const email = await
//     }
// }

export default {
  sendSignup,
  login,
  getAuth,
  logout,
};
