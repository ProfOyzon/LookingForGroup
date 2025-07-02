import { Router } from 'express';
import {
  getUsernameByShib,
  getAllUsers,
  getUsernameById,
} from '#controllers/users/userCRUDController.ts';
import {
  getUserByUsername,
  getUserByEmail,
} from '#controllers/users/userVerificationController.ts';
//import {getAccount} from '#controllers/users/userAccController.ts';

const router = Router();

//Gets username by shib ID
router.get('/get-username-shib', getUsernameByShib);
//formerly get-username-session
//should check login middleware

//Create new user

//Gets users
router.get('/', getAllUsers);

//Gets users by id
router.get('/:id', getUsernameById);

//Updates users information

//Deletes users

//Gets users by username
router.get('/search-username/:username', getUserByUsername);

// Gets users by email
router.get('/search-email/:email', getUserByEmail);

//Updates users profile images

//Gets user's account
//router.get('/:id/account', mid.checkLogin, getAccount);

//Updates users email

//Updates users username

//Updates users password

//Updates users visibility

//Gets user's projects
//router.get('/api/users/:id/projects', mid.checkLogin, userCtrl.getMyProjects);

//Gets another user's visible projects
//router.get('/api/users/:id/projects/profile', userCtrl.getVisibleProjects);

//Updates user's project visibility

//Gets user's following projects
//router.get('/api/users/:id/followings/projects', userCtrl.getProjectFollowing);

//Adds users following project

//Delete users

//Gets user's following users
//router.get('/api/users/:id/followings/people', userCtrl.getUserFollowing);

//Adds users following users

//Delete users following users

export default router;
