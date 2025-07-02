import { Router } from 'express';
import { getAccount } from '#controllers/users/get-acc.ts';
import { getAllUsers } from '#controllers/users/get-all.ts';
import { getUserByEmail } from '#controllers/users/get-by-email.ts';
import { getUsernameById } from '#controllers/users/get-by-id.ts';
import { getUserByUsername } from '#controllers/users/get-by-username.ts';
import { getUsernameByShib } from '#controllers/users/get-username-shib.ts';
import requiresLogin from '../middleware/requiresLogin.ts';

const router = Router();

//Gets username by shib ID
router.get('/get-username-shib', requiresLogin, getUsernameByShib);
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
router.get('/:id/account', requiresLogin, getAccount);

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
