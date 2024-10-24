import { Router } from "express";
import dataCtrl from "../controllers/datasets.js";

const router = Router();

router.get("/api/datasets/skills", dataCtrl.getSkills);
router.get("/api/datasets/tags", dataCtrl.getTags);
router.get("/api/datasets/job-titles", dataCtrl.getJobTitles);
router.get("/api/datasets/majors", dataCtrl.getMajors);

export default router;