import { Router } from "express";
import { getProjects, getProjectById, createProject } from "../controllers/projects.js";

const router = Router();

router.get("/api/projects", getProjects);
router.post("/api/projects", createProject);
router.get("/api/projects/:id", getProjectById);

export default router;