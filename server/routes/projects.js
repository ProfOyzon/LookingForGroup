import { Router } from "express";
import { getProjects, getProjectById } from "../controllers/projects.js";

const router = Router();

router.get("/api/projects", getProjects);
router.get("/api/projects/:id", getProjectById);

export default router;