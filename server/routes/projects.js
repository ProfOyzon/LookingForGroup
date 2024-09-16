import { Router } from "express";
import { getProjects, getProjectById, createProject, updateProject, addTag, deleteTag } from "../controllers/projects.js";

const router = Router();

router.get("/api/projects", getProjects);
router.post("/api/projects", createProject);
router.get("/api/projects/:id", getProjectById);
router.put("/api/projects/:id", updateProject);
router.post("/api/projects/tags/:id", addTag);
router.delete("/api/projects/tags/:id", deleteTag);

export default router;