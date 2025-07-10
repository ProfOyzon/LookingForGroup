import { Router } from 'express';
import PROJECT from '#controllers/projects/index.ts';
import requiresLogin from '../middleware/requires-login.ts';

const router = Router();

//Receive all projects
router.get('/', PROJECT.getProjects);

//Create a new project
// router.post('/' /* createProject */);

//Get a specific project
router.get('/:id', PROJECT.getProjectByID);

//Edits a project through a specific id
router.put('/:id', requiresLogin, PROJECT.updateProject);

// //Deletes project through a specific id
// router.delete('/:id' /* deleteProject */);

//Edits a project thumbnail through a specific id
router.put('/:id/thumbnail', requiresLogin, PROJECT.updateThumbnail);

//Receives pictures from project through id
router.get('/:id/pictures', PROJECT.getProjectPics);

//Creates a new picture for a project
//router.post('/:id/pictures' /* addPicture */);

//Changes a picture for a project
//router.put('/:id/pictures' /* changePicture */);

//Removes picture from a project
//router.delete('/:id/pictures' /* deletePicture */);

//Adds member to a specific project through id
//router.post('/:id/members' /* addMember */);

//Edits a member of a specific project through id
//router.put('/:id/members' /* updateMember */);

//Removes a member from a specific project through project and user ID
//router.delete('/:id/members' /* deleteMember */);

export default router;
