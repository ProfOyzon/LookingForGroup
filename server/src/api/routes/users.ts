import { Router } from 'express';
import getUsernameByShib from '#controllers/userController.ts';

const router = Router();

//Gets username by shib ID
router.get('/get-username-shib', getUsernameByShib);
//formerly get-username-session

//Gets users
//router.get('/api/users', userCtrl.getUsers);

//Gets users by id
//router.get('/api/users/:id', userCtrl.getUserById);

//Updates users information

//Deletes users

//Gets users by username
//router.get('/api/users/search-username/:username', userCtrl.getUserByUsername);

// Gets users by email
//router.get('/api/users/search-email/:email', userCtrl.getUserByEmail);

//Updates users profile images

//Gets users account
//router.get('/api/users/:id/account', mid.checkLogin, userCtrl.getAccount);

//Updates users email

//Updates users username

//Updates users password
//router.put('/api/users/:id/password', mid.checkLogin, userCtrl.updatePassword);

//Updates users visibility

//Gets users projects
//router.get('/api/users/:id/projects', mid.checkLogin, userCtrl.getMyProjects);

//Gets users visible projects
//router.get('/api/users/:id/projects/profile', userCtrl.getVisibleProjects);

//Updates users project visibility

//Gets users following projects
//router.get('/api/users/:id/followings/projects', userCtrl.getProjectFollowing);

//Adds users following project

//Delete users

//Gets users following users
//router.get('/api/users/:id/followings/people', userCtrl.getUserFollowing);

//Adds users following users

//Delete users following users

export default router;
