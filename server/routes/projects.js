import { Router } from "express";
import { getProjects } from "../controllers/projects.js";

const router = Router();

router.get("/api/projects", getProjects);

export default router;