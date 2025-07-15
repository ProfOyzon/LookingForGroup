import { Router } from 'express';
import { deleteFollowing } from '#controllers/users/delete-following.ts';
import { deleteUser } from '#controllers/users/delete-user.ts';
import { getAccount } from '#controllers/users/get-acc.ts';
import { getAllUsers } from '#controllers/users/get-all.ts';
import { getUserByEmail } from '#controllers/users/get-by-email.ts';
import { getUsernameById } from '#controllers/users/get-by-id.ts';
import { getUserByUsername } from '#controllers/users/get-by-username.ts';
import { getMyProjects } from '#controllers/users/get-my-proj.ts';
import { getProjectsFollowing } from '#controllers/users/get-proj-following.ts';
import { getUserFollowing } from '#controllers/users/get-user-following.ts';
import { getOtherUserProjects } from '#controllers/users/get-user-proj.ts';
import { getUsernameByShib } from '#controllers/users/get-username-shib.ts';
import { updateUserInfo } from '#controllers/users/update-info.ts';
import { updateUsername } from '#controllers/users/update-username.ts';
import { updateVisibility } from '#controllers/users/update-vis.ts';
import requiresLogin from '../middleware/requires-login.ts';

const router = Router();

//Gets username by shib ID
router.get('/get-username', requiresLogin, getUsernameByShib);
//formerly get-username-session

//Gets users
router.get('/', getAllUsers);

//Gets users by id
router.get('/:id', getUsernameById);

//Updates users information
router.put('/:id', requiresLogin, updateUserInfo);

//Delete user
router.delete('/:id', deleteUser);

//Gets users by username
router.get('/search-username/:username', getUserByUsername);

// Gets users by email
router.get('/search-email/:email', getUserByEmail);

//Updates users profile images
//router.put('/:id/profile-picture', requiresLogin, checkImageFile, updateProfilePicture);

//Gets user's account
router.get('/:id/account', requiresLogin, getAccount);

//Updates users username
router.put('/:id/username', requiresLogin, updateUsername);

//Updates users visibility
router.put('/:id/visibility', requiresLogin, updateVisibility);

//Gets current user's projects
router.get('/:id/projects', requiresLogin, getMyProjects);

//Gets another user's projects
router.get('/:id/projects/profile', getOtherUserProjects);

//Gets projects user is following
router.get('/:id/followings/projects', requiresLogin, getProjectsFollowing);

//Adds users following project
//router.post('/:id/followings/projects', requiresLogin, addProjectFollowing);

//Delete users following users
//router.delete('/:id/followings/projects/:followerId', requiresLogin, deleteProjFollowing);

//Gets users user is following
router.get('/:id/followings/people', requiresLogin, getUserFollowing);

//Adds users following users
//router.post('/:id/followings/people', requiresLogin, addUserFollowing);

//Delete users following users
router.delete('/:id/followings/people/:followerId', requiresLogin, deleteFollowing);

export default router;
