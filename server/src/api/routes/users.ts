import { Router } from 'express';
import getAllUsersController from '#controllers/users/getAllUsers.ts';
import getUsernameByIdController from '#controllers/users/getUserById.ts';
import getUsernameByShibController from '#controllers/users/getUsernameByShib.ts';

const router = Router();

//Gets username by shib ID
router.get('/get-username-shib', getUsernameByShibController);
//formerly get-username-session

//Gets users
router.get('/', getAllUsersController);

//Gets users by id
router.get('/:id', getUsernameByIdController);

//Updates users information

//Deletes users

//Gets users by username
//router.get('/search-username/:username', userCtrl.getUserByUsername);

// Gets users by email
//router.get('/search-email/:email', userCtrl.getUserByEmail);

//Updates users profile images

//Gets user's account
//router.get('/api/users/:id/account', mid.checkLogin, userCtrl.getAccount);

//Updates users email

//Updates users username

//Updates users password

//Updates users visibility

//Gets user's projects
//router.get('/api/users/:id/projects', mid.checkLogin, userCtrl.getMyProjects);

//Gets a user's visible projects
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
