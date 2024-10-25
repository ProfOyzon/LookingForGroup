import { Router } from "express";
import mid from "../middleware/index.js";
import projCtrl from "../controllers/projects.js";

const router = Router();

router.get("/api/projects", projCtrl.getProjects);
router.post("/api/projects", projCtrl.createProject);
router.get("/api/projects/:id", projCtrl.getProjectById);
router.put("/api/projects/:id", projCtrl.updateProject);
router.put("/api/projects/:id/thumbnail", mid.checkImageFile, projCtrl.updateThumbnail);
router.post("/api/projects/:id/pictures", mid.checkImageFile, projCtrl.addPicture);
router.put("/api/projects/:id/pictures", projCtrl.updatePicturePositions);
router.delete("/api/projects/:id/pictures", projCtrl.deletePicture);
router.post("/api/projects/:id/project-types", projCtrl.addProjectType);
router.delete("/api/projects/:id/project-types", projCtrl.deleteProjectType);
router.post("/api/projects/:id/tags", projCtrl.addTag);
router.delete("/api/projects/:id/tags", projCtrl.deleteTag);
router.post("/api/projects/:id/jobs", projCtrl.addJob);
router.put("/api/projects/:id/jobs", projCtrl.updateJob);
router.delete("/api/projects/:id/jobs", projCtrl.deleteJob);
router.post("/api/projects/:id/members", projCtrl.addMember);
router.put("/api/projects/:id/members", projCtrl.updateMember);
router.delete("/api/projects/:id/members", projCtrl.deleteMember);


export default router;