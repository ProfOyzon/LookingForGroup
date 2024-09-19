import { Router } from "express";
import { getProjects, getProjectById, createProject, updateProject, 
    addGenre, deleteGenre, addTag, deleteTag, addJob, deleteJob } from "../controllers/projects.js";

const router = Router();

router.get("/api/projects", getProjects);
router.post("/api/projects", createProject);
router.get("/api/projects/:id", getProjectById);
router.put("/api/projects/:id", updateProject);
router.post("/api/projects/:id/genres", addGenre);
router.delete("/api/projects/:id/genres", deleteGenre);
router.post("/api/projects/:id/tags", addTag);
router.delete("/api/projects/:id/tags", deleteTag);
router.post("/api/projects/:id/jobs", addJob);
router.delete("/api/projects/:id/jobs", deleteJob);

export default router;