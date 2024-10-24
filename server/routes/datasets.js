import { Router } from "express";
import dataCtrl from "../controllers/datasets.js";

const router = Router();

router.get("/api/datasets/skills", dataCtrl.getSkills);

export default router;