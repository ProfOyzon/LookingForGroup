import { Router } from 'express';
import mid from '../middleware/index.js';
import userCtrl from '../controllers/users.js';
import pool from '../config/database.js';

const router = Router();

/**
 * Creates a login
 * @param requst HTTP request
 * @returns HTTP response
 */
router.post('/api/login', userCtrl.login);

/**
 * Receives response to authorization
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/auth', userCtrl.getAuth);

/**
 * Creates a user logout
 * @param requst HTTP request
 * @returns HTTP response
 */
router.post('/api/logout', userCtrl.logout);

/**
 * For a new user, create signup
 * @param requst HTTP request
 * @returns HTTP response
 */
router.post('/api/signup', userCtrl.signup);

/**
 * Receives the token for a signed-up user
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/signup/:token', userCtrl.createUser);

/**
 * Resets user password at validation stage
 * @param requst HTTP request
 * @returns HTTP response
 */
router.post('/api/resets/password', userCtrl.requestPasswordReset);

/**
 * Resets user password
 * @param requst HTTP request
 * @returns HTTP response
 */
router.post('/api/resets/password/:token', userCtrl.resetPassword);

/**
 * Gets username by session id
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/get-username-session', mid.checkLogin, userCtrl.getUsernameBySession);

/**
 * Gets users
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users', userCtrl.getUsers);

/**
 * Gets users v2
 * @param attributes attributes that filter out users
 * @returns users match attributes
 */
router.get('/api/2/users', async (req, res) => {
  try {
    let sql = 'SELECT * FROM users WHERE visibility = 1';

    for (const [key, value] of Object.entries(req.query)) {
      sql += ` AND ${key} = ${value}`;
    }

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
      error: err,
    });
    return;
  }
});

/**
 * Gets users by id
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/:id', userCtrl.getUserById);

/**
 * Updates users information
 * @param requst HTTP request
 * @returns HTTP response
 */
router.put('/api/users/:id', mid.checkLogin, userCtrl.updateUser);

/**
 * Deletes users
 * @param requst HTTP request
 * @returns HTTP response
 */
router.delete('/api/users/:id', mid.checkLogin, userCtrl.deleteUser);

/**
 * Gets users by username
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/search-username/:username', userCtrl.getUserByUsername);

/**
 * Gets users by email
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/search-email/:email', userCtrl.getUserByEmail);

/**
 * Updates users profile images
 * @param requst HTTP request
 * @returns HTTP response
 */
router.put(
  '/api/users/:id/profile-picture',
  mid.checkLogin,
  mid.checkImageFile,
  userCtrl.updateProfilePicture
);

/**
 * Gets users account
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/:id/account', mid.checkLogin, userCtrl.getAccount);

/**
 * Updates users email
 * @param requst HTTP request
 * @returns HTTP response
 */
router.put('/api/users/:id/email', mid.checkLogin, userCtrl.updateEmail);

/**
 * Updates users username
 * @param requst HTTP request
 * @returns HTTP response
 */
router.put('/api/users/:id/username', mid.checkLogin, userCtrl.updateUsername);

/**
 * Updates users password
 * @param requst HTTP request
 * @returns HTTP response
 */
router.put('/api/users/:id/password', mid.checkLogin, userCtrl.updatePassword);

/**
 * Updates users visibility
 * @param requst HTTP request
 * @returns HTTP response
 */
router.put('/api/users/:id/visibility', mid.checkLogin, userCtrl.updateUserVisibility);

/**
 * Gets users projects
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/:id/projects', mid.checkLogin, userCtrl.getMyProjects);

/**
 * Gets users visible projects
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/:id/projects/profile', userCtrl.getVisibleProjects);

/**
 * Updates users project visibility
 * @param requst HTTP request
 * @returns HTTP response
 */
router.put('/api/users/:id/projects/visibility', mid.checkLogin, userCtrl.updateProjectVisibility);

/**
 * Gets users following projects
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/:id/followings/projects', userCtrl.getProjectFollowing);

/**
 * Adds users following project
 * @param requst HTTP request
 * @returns HTTP response
 */
router.post('/api/users/:id/followings/projects', mid.checkLogin, userCtrl.addProjectFollowing);

/**
 * Delete users
 * @param requst HTTP request
 * @returns HTTP response
 */
router.delete(
  '/api/users/:id/followings/projects/:projId',
  mid.checkLogin,
  userCtrl.deleteProjectFollowing
);

/**
 * Gets users following users
 * @param requst HTTP request
 * @returns HTTP response
 */
router.get('/api/users/:id/followings/people', userCtrl.getUserFollowing);

/**
 * Adds users following users
 * @param requst HTTP request
 * @returns HTTP response
 */
router.post('/api/users/:id/followings/people', mid.checkLogin, userCtrl.addUserFollowing);

/**
 * Delete users following users
 * @param requst HTTP request
 * @returns HTTP response
 */
router.delete('/api/users/:id/followings/people', mid.checkLogin, userCtrl.deleteUserFollowing);

export default router;
