import { Router } from 'express';
import dataCtrl from '../controllers/datasets.js';

const router = Router();

//Receives list of all skills
router.get('/api/datasets/skills', dataCtrl.getSkills);

//Receives list of all majors
router.get('/api/datasets/majors', dataCtrl.getMajors);

//Receives list of all possible project-types
router.get('/api/datasets/project-types', dataCtrl.getProjectTypes);

//Receives list of all tags
router.get('/api/datasets/tags', dataCtrl.getTags);

//Receives list of all job-titles
router.get('/api/datasets/job-titles', dataCtrl.getJobTitles);

//Receives all socials from datasets
router.get('/api/datasets/socials', dataCtrl.getSocials);

export default router;
