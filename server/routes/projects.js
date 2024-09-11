import { Router } from "express";
import { getProjects, getProjectById, createProject, updateProjectById } from "../controllers/projects.js";

const router = Router();

router.get("/api/projects", getProjects);
router.post("/api/projects", createProject);
router.get("/api/projects/:id", getProjectById);
router.put("/api/projects/:id", updateProjectById);

export default router;