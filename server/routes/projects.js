import { Router } from "express";
import mid from "../middleware/index.js";
import { getProjects, getProjectById, createProject, updateProject, updateThumbnail,
    addGenre, deleteGenre, addTag, deleteTag, addJob, updateJob, deleteJob,
    addMember, updateMember, deleteMember } from "../controllers/projects.js";

const router = Router();

router.get("/api/projects", getProjects);
router.post("/api/projects", createProject);
router.get("/api/projects/:id", getProjectById);
router.put("/api/projects/:id", updateProject);
router.put("/api/projects/:id/thumbnail", mid.checkImageFile, updateThumbnail);
router.post("/api/projects/:id/genres", addGenre);
router.delete("/api/projects/:id/genres", deleteGenre);
router.post("/api/projects/:id/tags", addTag);
router.delete("/api/projects/:id/tags", deleteTag);
router.post("/api/projects/:id/jobs", addJob);
router.put("/api/projects/:id/jobs", updateJob);
router.delete("/api/projects/:id/jobs", deleteJob);
router.post("/api/projects/:id/members", addMember);
router.put("/api/projects/:id/members", updateMember);
router.delete("/api/projects/:id/members", deleteMember);


export default router;