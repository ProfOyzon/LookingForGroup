import { Router } from 'express';
import mid from '../middleware/index.js';
import userCtrl from '../controllers/users.js';

const router = Router();

//Creates a login
router.post('/api/login', userCtrl.login);

//Recieves response to authorization
router.get('/api/auth', userCtrl.getAuth);

//Creates a user logout
router.post('/api/logout', userCtrl.logout);

//For a new user, create signup
router.post('/api/signup', userCtrl.signup);

//Recieves the token for a signed-up user
router.get('/api/signup/:token', userCtrl.createUser);

router.post('/api/resets/password', userCtrl.requestPasswordReset);
router.post('/api/resets/password/:token', userCtrl.resetPassword);
router.get('/api/users/get-username-session', mid.checkLogin, userCtrl.getUsernameBySession);
router.get('/api/users', userCtrl.getUsers);
router.get('/api/users/:id', userCtrl.getUserById);
router.put('/api/users/:id', mid.checkLogin, userCtrl.updateUser);
router.delete('/api/users/:id', mid.checkLogin, userCtrl.deleteUser);
router.get('/api/users/search-username/:username', userCtrl.getUserByUsername);
router.get('/api/users/search-email/:email', userCtrl.getUserByEmail);
router.put(
  '/api/users/:id/profile-picture',
  mid.checkLogin,
  mid.checkImageFile,
  userCtrl.updateProfilePicture
);
router.get('/api/users/:id/account', mid.checkLogin, userCtrl.getAccount);
router.put('/api/users/:id/email', mid.checkLogin, userCtrl.updateEmail);
router.put('/api/users/:id/username', mid.checkLogin, userCtrl.updateUsername);
router.put('/api/users/:id/password', mid.checkLogin, userCtrl.updatePassword);
router.put('/api/users/:id/visibility', mid.checkLogin, userCtrl.updateUserVisibility);
router.get('/api/users/:id/projects', mid.checkLogin, userCtrl.getMyProjects);
router.get('/api/users/:id/projects/profile', userCtrl.getVisibleProjects);
router.put('/api/users/:id/projects/visibility', mid.checkLogin, userCtrl.updateProjectVisibility);
router.get('/api/users/:id/followings/projects', userCtrl.getProjectFollowing);
router.post('/api/users/:id/followings/projects', mid.checkLogin, userCtrl.addProjectFollowing);
router.delete(
  '/api/users/:id/followings/projects/:projId',
  mid.checkLogin,
  userCtrl.deleteProjectFollowing
);
router.get('/api/users/:id/followings/people', userCtrl.getUserFollowing);
router.post('/api/users/:id/followings/people', mid.checkLogin, userCtrl.addUserFollowing);
router.delete('/api/users/:id/followings/people', mid.checkLogin, userCtrl.deleteUserFollowing);

export default router;
