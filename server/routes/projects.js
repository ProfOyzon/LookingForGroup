import { Router } from 'express';
import mid from '../middleware/index.js';
import projCtrl from '../controllers/projects.js';

const router = Router();

//Receive all projects
router.get('/api/projects', projCtrl.getProjects);

//Create a new project
router.post('/api/projects', mid.checkLogin, projCtrl.createProject);

//Get a specific project
router.get('/api/projects/:id', projCtrl.getProjectById);

//Edits a project through a specific id
router.put('/api/projects/:id', mid.checkLogin, projCtrl.updateProject);

//Deletes project through a specific id
router.delete('/api/projects/:id', mid.checkLogin, projCtrl.deleteProject);

//Edits a project thumbnail through a specific id
router.put(
  '/api/projects/:id/thumbnail',
  mid.checkLogin,
  mid.checkImageFile,
  projCtrl.updateThumbnail,
);

//Receives picture from project through id
router.get('/api/projects/:id/pictures', projCtrl.getPictures);

//Creates a new picture for a project
router.post('/api/projects/:id/pictures', mid.checkLogin, mid.checkImageFile, projCtrl.addPicture);

//Changes a picture for a project
router.put('/api/projects/:id/pictures', mid.checkLogin, projCtrl.updatePicturePositions);

//Removes picture from a project
router.delete('/api/projects/:id/pictures', mid.checkLogin, projCtrl.deletePicture);

//Adds member to a specific project through id
router.post('/api/projects/:id/members', mid.checkLogin, projCtrl.addMember);

//Edits a member of a specific project through id
router.put('/api/projects/:id/members', mid.checkLogin, projCtrl.updateMember);

//Removes a member from a specific project through project and user ID
router.delete('/api/projects/:id/members/:userId', mid.checkLogin, projCtrl.deleteMember);

export default router;
