import { Router } from "express";
import dataCtrl from "../controllers/datasets.js";

const router = Router();

router.get("/api/datasets/skills", dataCtrl.getSkills);
router.get("/api/datasets/majors", dataCtrl.getMajors);
router.get("/api/datasets/project-types", dataCtrl.getProjectTypes);
router.get("/api/datasets/tags", dataCtrl.getTags);
router.get("/api/datasets/job-titles", dataCtrl.getJobTitles);


export default router;