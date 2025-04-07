import { Router } from 'express';
import mid from '../middleware/index.js';
import projCtrl from '../controllers/projects.js';

const router = Router();

router.get('/api/projects', projCtrl.getProjects);
router.post('/api/projects', mid.checkLogin, projCtrl.createProject);
router.get('/api/projects/:id', projCtrl.getProjectById);
router.put('/api/projects/:id', mid.checkLogin, projCtrl.updateProject);
router.delete('/api/projects/:id', mid.checkLogin, projCtrl.deleteProject);
router.put(
  '/api/projects/:id/thumbnail',
  mid.checkLogin,
  mid.checkImageFile,
  projCtrl.updateThumbnail
);
router.get('/api/projects/:id/pictures', projCtrl.getPictures);
router.post('/api/projects/:id/pictures', mid.checkLogin, mid.checkImageFile, projCtrl.addPicture);
router.put('/api/projects/:id/pictures', mid.checkLogin, projCtrl.updatePicturePositions);
router.delete('/api/projects/:id/pictures', mid.checkLogin, projCtrl.deletePicture);
router.delete('/api/projects/:id/members/:userId', mid.checkLogin, projCtrl.deleteMember);

export default router;
