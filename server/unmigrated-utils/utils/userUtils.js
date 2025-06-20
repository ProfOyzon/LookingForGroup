//import pool from '../config/database.js';
import envConfig from '../config/env.js';
//import { createUser } from '../controllers/users';

import { GET, POST, PUT, DELETE, RESPONSE } from './fetchUtils.js';
import { transporter } from '../config/mailer.js';
import { hash } from 'bcrypt';

const root =
  envConfig.env === 'development' || envConfig.env === 'test'
    ? 'http://localhost:8081/api'
    : 'https://lfg.gccis.rit.edu/api';

/**
 * Creates a new user, and adds them to the signups table. All data params default to null.
 * @param {any} token - from url, security token
 * @param {any} email - get signup email if the token is valid. Checks if a user with that email already exists.
 
 * @returns status - 200 if valid, 400 if not
 * @param {string} _firstName
 * @param {string} _lastName
 * @param {string} _headline
 * @param {string} _pronouns
 * @param {number} _jobTitleId
 * @param {number} _majorId
 * @param {number} _academicYear
 * @param {string} _location
 * @param {string} _funFact
 * @param {string} _bio
 * @param {Array<object>} _skills
 * @param {Array<object>} _socials
 */
async function createNewUser(
  token,
  email,
  _firstName,
  _lastName,
  _headline,
  _pronouns,
  _jobTitleId,
  _majorId,
  _academicYear,
  _location,
  _funFact,
  _bio,
  _skills,
  _socials,
) {
  //check if token is valid
  const apiURL = `${root}/signup/${token}`;

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    //bypass for dev environment
    console.log('DEV MODE: Skip token check');
  } else {
    //token validation
    const response = await GET(apiURL);
    if (response.status === 400) {
      console.log('Token does not exist.');
      return { status: 400, error: 'Token does not exist.' };
    }
  }

  //else, token valid and check if a user with that email already exists.
  if (await userInDatabase(email)) {
    console.log('User is already in database, create fails');
    return { status: 400, error: 'User is already in database.' };
  } else {
    //user is not in database, add them.
    //local
    // if (envConfig.env === 'development' || envConfig.env === 'test') {
    //   const sql =
    //     'INSERT INTO users (username, primary_email, rit_email, password, first_name, last_name SELECT username, primary_email, rit_email, password, first_name, last_name FROM signups WHERE rit_email=?';
    //   const values = [email];
    //   await pool.query(sql, values);
    //   console.log('Added into database.');
    //   return RESPONSE(200, '', '');
    // } else {
    const data = {
      firstName: _firstName,
      lastName: _lastName,
      headline: _headline,
      pronouns: _pronouns,
      jobTitleId: _jobTitleId,
      majorId: _majorId,
      academicYear: _academicYear,
      location: _location,
      funFact: _funFact,
      bio: _bio,
      skills: _skills,
      socials: _socials,
    };

    const response = await POST(apiURL, data);
    if (response.status === 400) {
      console.log('Error creating a new user.');
      return { status: 400, error: 'Error creating a new user.' };
    }
    console.log(`User ${email} created.`);
    console.log(response);
    return response;
  }
}

/**
 * Checks if a User is already within database through RIT email
 * @param {string} email - RIT email, string
 * @returns result - boolean, true if they exist within database, false if not.
 */
async function userInDatabase(email) {
  //   if (envConfig.env === 'development' || envConfig.env === 'test') {
  //     const [user] = await pool.query('SELECT rit_email FROM users WHERE rit_email = ?', [email]);

  //         if(!user) {
  //             console.log( RESPONSE(400,'','Your account has already been activated.') );
  //             return false;
  //         } else {
  //             return true;
  //         }
  //     } else {
  const apiURL = `${root}/users/search-email/${email}`;
  const response = await GET(apiURL);

  if (response.status === 400) {
    console.log('Error fetching email.');
    return false;
  } else {
    if (!response.data || response.data.length === 0) {
      console.log(response.data);
      return false;
    }
    console.log('User found with email', email);
    return true;
  }
}

/**
 * Gets all data on all public users. Does not return private ones
 * @returns result - JSONified data of all users, else if error, '400'.
 */
async function getUsers() {
  try {
    // if (envConfig.env === 'development' || envConfig.env === 'test') {
    //   const sql = `SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns,
    //         jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, u.created_at, s.skills
    //             FROM users u
    //             LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
    //                 FROM job_titles jt) jt
    //             ON u.job_title_id = jt.title_id
    //             LEFT JOIN (SELECT m.major_id, m.label AS major
    //                 FROM majors m) m
    //             ON u.major_id = m.major_id
    //             LEFT JOIN (SELECT us.user_id, JSON_ARRAYAGG(JSON_OBJECT("id", s.skill_id, "skill", s.label, "type", s.type,
    //                 "position", us.position)) AS skills
    //                 FROM user_skills us
    //                 JOIN skills s
    //                     ON us.skill_id = s.skill_id
    //                 GROUP BY us.user_id) s
    //             ON u.user_id = s.user_id
    //             WHERE u.visibility = '1'`;
    //   const [users] = await pool.query(sql);
    //   return RESPONSE(200, users, '');
    // } else {
    const apiURL = `${root}/users`;
    const response = await GET(apiURL);
    if (response.status === 400) return response;
    return response;
  } catch (err) {
    console.log(err);
    return { status: 400, error: err };
  }
}

/**
 * Get account information of a user through ID
 * @param {number} user_id - int, id of the user
 * @returns data - JSONified data from account information. 400 if not valid.
 */
async function getAccountInformation(user_id) {
  // if(envConfig.env === 'development' || envConfig.env === 'test') {
  //     const sql= `SELECT u.user_id, u.first_name, u.last_name, u.profile_image, u.headline, u.pronouns,
  //         jt.job_title, m.major, u.academic_year, u.location, u.fun_fact, u.created_at, s.skills
  //             FROM users u
  //             LEFT JOIN (SELECT jt.title_id, jt.label AS job_title
  //                 FROM)`
  // } else {
  const apiURL = `${root}/users/${user_id}/account`;
  const response = await GET(apiURL);
  console.log(response);
  if (response.status === 401) {
    console.log(response.error);
    return response;
  }

  console.log('User account information recieved');
  return response;
}

/**
 * Gets all data on one specific user, specified by URL.
 * @param {number} id - user_id for user
 * @returns result - JSONified data of specified user.
 */
async function getUsersById(id) {
  const apiURL = `${root}/users/${id}`;
  const response = await GET(apiURL);
  if (response.status === 400) return response; //error

  return response;
}

/**
 * Edit information for one user, specified by URL.
 * @param {number} id - user_id for user
 * @param {Array<object>} data - mapped(eg {data1:'value1', data2:'value2'}) data to change for user
 * @returns response data
 */
async function editUser(id, data) {
  const apiURL = `${root}/api/users/${id}`;
  const response = await PUT(apiURL, data);
  if (response.status === 400) return response;

  return response;
}

/**
 * Removes a user specified by URL.
 * @param {number} id - user_id to be deleted
 * @returns response data
 */
async function deleteUser(id) {
  const apiURL = `${root}/users/${id}`;
  const response = await DELETE(apiURL);
  if (response.status === 400) return response;

  return response;
}

/**
 * Update Profile Picture for a user's id.
 * @param {number} id - int, the user_id to change
 * @param {string} _image - file, the picture to put into the user's profile
 * @return status, 200 if successful, 400 if not, and data. data=array[object] with the profile_image, string, name of the file
 */
async function updateProfilePicture(id, _image) {
  const apiURL = `${root}/users/${id}/profile-picture`;
  const data = { image: _image };
  const response = await PUT(apiURL, data);
  if (response.status === 400) {
    console.log('error updating profile picture.');
    return { status: 400, error: 'Error updating profile picture.' };
  }
  console.log('Updated Profile Picture for user.');
  return response;
}

/**
 * Update email for a user
 * @param {number} id = user_id for the profile wishing to change email.
 * @param {string} _email - email to change to
 * @param {string} _confirm_email - secondary entering of email to confirm
 * @param {string} _password - the user's current password.
 * @returns response, 200 if valid, 400 if not, 401 if emails do not match.
 */
async function updateEmail(id, _email, _confirm_email, _password) {
  const apiURL = `${root}/users/${id}/email`;
  if (_email != _confirm_email) {
    console.log('Not the same email, try again.');
    return { status: 401, error: 'Not the same email.' };
  }
  const data = {
    email: _email,
    confirm: _confirm_email,
    password: _password,
  };

  const response = await PUT(apiURL, data);
  if (response.status === 400) {
    console.log('error updating email.');
    return { status: 400, error: 'Error updating email.' };
  }
  console.log('Updated primary email for user.');

  return response;
}

/**
 * Update username through id.
 * @param {number} id
 * @param {string} _username - username to change to
 * @param {string} _confirm_user - secondary entering of username to confirm
 * @param {string} _password - the user's current password.
 * @returns response, 200 if valid, 400 if not, 401 if users do not match.
 */
async function updateUsername(id, _username, _confirm_user, _password) {
  const apiURL = `${root}/users/${id}/username`;
  if (_username != _confirm_user) {
    console.log('Usernames are not the same.');
    return { status: 401, error: 'Usernames are not the same.' };
  }
  const data = {
    username: _username,
    confirm_user: _confirm_user,
    password: _password,
  };

  const response = await PUT(apiURL, data);
  if (response.status === 400) {
    console.log('error updating username.');
    return { status: 400, error: 'Error updating username.' };
  }
  console.log('Updated primary username for user.');
  return { status: 400, data: response.data };
}

/**
 * Request for the forget password page, send the user an email for resetting their password.
 * @param {string} email - email to send password reset to.
 * @returns 201 if email sent, 400 if error.
 */
async function requestPasswordReset(email) {
  //check if email exists
  if (!email) {
    console.log('Error: Missing email.');
    return { status: 400, error: 'Missing email.' };
  }

  // Generate a token for password reset
  const _token = crypto.randomUUID();

  let url = ``;
  if (envConfig.env === 'production') {
    url = `https://lookingforgrp.com/resetPassword/${_token}`;
  } else {
    url = `http://localhost:8081/resetPassword/${_token}`;
  }
  console.log('Token put into database.');

  try {
    // Add token to online
    const data = {
      token: _token,
    };
    const response = await POST(`https://lookingforgrp/resetPassword`, data);

    if (response.status === 400) {
      console.error('Error posting token for password reset.');
      return { status: 400, error: 'Error posting token for password reset.' };
    }
    console.log('Token put into database.');

    const emailMessage = `
            <p>Hi, <br>
            Forgot your password? You have 15 minutes to reset it. Click the button below.
            </p>

            <div style="margin:2rem 1rem">
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
      html: emailMessage,
    };

    // send account activation email
    await transporter.sendMail(message);

    console.log('Email sent successfully.');
    return { status: 201, data: 'Email sent successfully.' };
  } catch (err) {
    console.log(err);
    console.log('An error occured during password reset request');
    return { status: 400, error: err };
  }
}

/**
 * Update Password for user specified with user_id
 * @param {number} id = int, user id for the user wishing to change
 * @param {string} _newPassword = string, new password
 * @param {string} _password_confirm - string, confirm password to be the same as the new password
 * @param {string} _password - string, user's current password
 * @param {string} _token
 */
async function updatePassword(id, _newPassword, _password_confirm, _password, _token) {
  let apiURL = `${root}/users/${id}/password`;
  if (!_newPassword || !_password_confirm) {
    console.log('Missing passwords.');
    return { status: 400, error: 'Missing passwords.' };
  }
  if (_newPassword != _password_confirm) {
    console.log('Password and confirmation are not the same.');
    return { status: 400, error: 'Password and confirmation are not the same.' };
  }
  console.log('Token accepted, email verified.');

  //hash password
  const hashPass = await hash(_newPassword, 10);

  try {
    //get email if token is valid
    let url = `${root}/resets/password/${_token}`;
    let response = await GET(url);
    if (!response.data.email) {
      console.log('Your token has expired.');
      return response;
    }
    console.log('Token accepted, email verified.');

    //update user password
    url = `${root}/users/${id}/password`;
    const data = {
      password: hashPass,
    };
    response = PUT(url, data);
    if (response.status === 400) {
      console.log('Error putting new password.');
      return { status: 400, error: response.error };
    }

    console.log('User password updated successfully.');
    return { status: 201, data: response.data };
  } catch (err) {
    console.log(err);
    console.log("An error occurred while updating user's password");
    return { status: 400, error: err };
  }
}

/**
 * Updates user visibility, between 0 (private) and 1 (public). just a switch.
 * @param {number} id - user_id for the user
 * @returns 400 if error, 200 if valid
 */
async function updateUserVisibility(id) {
  let url = `${root}/users/${id}`;
  let data = await GET(url);
  const parsedata = JSON.parse(await data);
  const vis = parsedata.visibility;

  if (vis == 1) {
    data = {
      visibility: 0,
    };
  } else if (vis == 0) {
    data = {
      visibility: 1,
    };
  }
  const result = await editUser(id, data);
  if (result.status === 400) {
    console.log('Error editing user.');
    return { status: 400, error: 'Error editing user.' };
  }
  return { status: 200, response: result.data };
}

/**
 * Get User by Username
 * @param {string} username - Username of user to be recieved
 * @return data, list of 1 user, or 400 if not successful
 */
async function getUserByUsername(username) {
  let url = `${root}/users/search-username/${username}`;
  const response = await GET(url);

  if (response.status === 400) {
    console.log('Error getting user.');
    return { status: 400, error: response.error };
  }

  //check if array is not empty
  if (!response.data || response.data.length === 0) {
    console.log('No user found');
    return { status: 404, error: response.error };
  }

  console.log('Data recieved.');
  return response;
}

/**
 * Get User by email
 * @param {string} email - email of user to be recieved
 * @return data, list of 1 user, or 400 if not successful
 */
async function getUserByEmail(email) {
  let url = `${root}/users/search-email/${email}`;
  const response = await GET(url);

  if (response.status === 400) {
    console.log('Error getting user.');
    return { status: 400, error: response.error };
  }

  //check if array is not empty
  if (!response.data || response.data.length === 0) {
    console.log('No user found');
    return { status: 404, error: 'No user found.' };
  }

  console.log('Data recieved.');
  return response;
}

/**
 * Get people that a user is following.
 * @param {number} id - id of the user that we are searching.
 * @returns array of users following, or 400 if unsuccessful.
 */
async function getUserFollowing(id) {
  let url = `${root}/users/${id}/followings/people`;
  const response = await GET(url);
  if (response.status === 400) {
    console.log('Error getting users.');
    return { status: 400, error: response.error };
  }
  console.log('Data recieved.');
  return response;
}

/**
 * Get all projects the user is a member of and has set to be public for the profile page
 * @param {number} id - user to search
 * @return - array of projects, or 400 if unsuccessful.
 */
async function getVisibleProjects(id) {
  let url = `${root}/users/${id}/projects/profile`;
  const response = await GET(url);
  if (response.status === 400) {
    console.log('Error getting projects.');
    return { status: 400, error: response.error };
  }
  console.log('Data recieved.');
  return response;
}

/**
 * Update the project visibility for a project a user is a member of.
 * @param {number} userID - user's ID
 * @param {number} projectID - Id of the project
 * @param {string} _visibility - either "public" or "private", set visibility
 * @return 201 if successful, 400 if not
 */
async function updateProjectVisibility(userID, projectID, _visibility) {
  let url = `${root}/users/${userID}/projects/visibility`;
  const data = {
    projectId: projectID,
    visibility: _visibility,
  };

  let response = await PUT(url, data);
  if (response.status === 400) {
    console.log('Error editing projects.');
    return { status: 400, error: response.error };
  }
  console.log('Data edited.');
  return { status: 201, data: response.data };
}

/**
 * Get projects the user is following.
 * @param {number} id - ID of the user.
 * @returns array of projects, or 400 if error.
 */
async function getProjectFollowing(id) {
  let url = `${root}/users/${id}/followings/projects`;
  const response = await GET(url);
  if (response.status === 400) {
    console.log('Error getting projects.');
    return { status: 400, error: response.error };
  }
  console.log('Data recieved.');
  return response;
}

/**
 * Follow a project for a user.
 * @param {number} id - user ID trying to follow a project.
 * @param {number} projectID - ID of the project trying to follow.
 * @returns 201 if successful, 400 if not.
 */
async function addProjectFollowing(id, projectID) {
  let url = `${root}/users/${id}/followings/projects`;
  const data = {
    projectId: projectID,
  };
  const response = await POST(url, data);
  if (response.status === 400) {
    console.log('Error creating project following, unauthorized.');
    return { status: 400, error: response.error };
  }
  console.log('Created project following.');
  return { status: 200, data: id };
}

/**
 * Unfollow a project for a user.
 * @param {number} id - user id
 * @param {number} projID - project Id to be unfollowed.
 * @returns 201 if successful, 400 if not.
 */
async function deleteProjectFollowing(id, projID) {
  let url = `${root}/users/${id}/followings/projects/${projID}`;
  const response = await DELETE(url);
  if (response.status === 400) {
    console.log('Error deleting project following.');
    return { status: 400, error: response.error };
  }
  console.log('Deleted project following.');
  return { status: 201, data: response.data };
}

/**
 * Follow a person for a user.
 * @param {number} id - user's id
 * @param {number} followID - user to be followed.
 * @returns 201 if successful, 400 if not
 */
async function addUserFollowing(id, followID) {
  let url = `${root}/users/${id}/followings/people`;
  const data = {
    userId: followID,
  };
  const response = await POST(url, data);
  if (response.status === 400) {
    console.log('Error creating user following.');
    return { status: 400, error: response.error };
  }
  console.log('Created user following.');
  return { status: 201, data: response.data };
}

/**
 * Unfollow person for a user.
 * @param {number} id - user id of the user.
 * @param {number} unfollowID - user id to be unfollowed.
 */
async function deleteUserFollowing(id, unfollowID) {
  let url = `${root}/users/${id}/followings/people`;
  const data = {
    userId: unfollowID,
  };
  const response = await DELETE(url);

  if (response.status === 400) {
    console.log('Error deleting user following.');
    return { status: 400, error: response.error };
  }
  console.log('Deleted user following.');
  return { status: 201, data: response.data };
}

export default {
  createNewUser,
  getUsers,
  getUsersById,
  editUser,
  deleteUser,
  userInDatabase,
  updateProfilePicture,
  getAccountInformation,
  updateEmail,
  updateUsername,
  updatePassword,
  updateUserVisibility,
  requestPasswordReset,
  getUserByUsername,
  getUserByEmail,
  getUserFollowing,
  getVisibleProjects,
  updateProjectVisibility,
  getProjectFollowing,
  addProjectFollowing,
  deleteProjectFollowing,
  addUserFollowing,
  deleteUserFollowing,
};
