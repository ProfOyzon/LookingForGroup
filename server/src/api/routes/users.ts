import { Router } from 'express';
import { deleteUser } from '#controllers/users/delete-user.ts';
import { getAccount } from '#controllers/users/get-acc.ts';
import { getAllUsers } from '#controllers/users/get-all.ts';
import { getUserByEmail } from '#controllers/users/get-by-email.ts';
import { getUsernameById } from '#controllers/users/get-by-id.ts';
import { getUserByUsername } from '#controllers/users/get-by-username.ts';
import { getUserFollowing } from '#controllers/users/get-following.ts';
import { getUsernameByShib } from '#controllers/users/get-username-shib.ts';
import { updateUserInfo } from '#controllers/users/update-info.ts';
import { updateUsername } from '#controllers/users/update-username.ts';
import { updateVisibility } from '#controllers/users/update-vis.ts';
import requiresLogin from '../middleware/requires-login.ts';

const router = Router();

//Gets username by shib ID
router.get('/get-username-shib', requiresLogin, getUsernameByShib);
//formerly get-username-session

//Gets users
router.get('/', getAllUsers);

//Gets users by id
router.get('/:id', getUsernameById);

//Updates users information
router.put('/:id', requiresLogin, updateUserInfo);

//Deletes users

//Gets users by username
router.get('/search-username/:username', getUserByUsername);

// Gets users by email
router.get('/search-email/:email', getUserByEmail);

//Updates users profile images

//Gets user's account
router.get('/:id/account', requiresLogin, getAccount);

//Updates users username
router.put('/:id/username', requiresLogin, updateUsername);

//Updates users visibility
router.put('/:id/visibility', requiresLogin, updateVisibility);

//Gets user's projects
//router.get('/api/users/:id/projects', mid.checkLogin, userCtrl.getMyProjects);

//Gets another user's visible projects
//router.get('/api/users/:id/projects/profile', userCtrl.getVisibleProjects);

//Updates user's project visibility

//Gets user's following projects
//router.get('/api/users/:id/followings/projects', userCtrl.getProjectFollowing);

//Adds users following project

//Delete users
router.delete('/:id', deleteUser);

//Gets user's following users
router.get('/:id/followings/people', getUserFollowing);

//Adds users following users

//Delete users following users

export default router;
