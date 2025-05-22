import { Router } from 'express';
import dataCtrl from '../controllers/datasets.js';

const router = Router();

//Recieves list of all skills
router.get('/api/datasets/skills', dataCtrl.getSkills);

//Recieves list of all majors
router.get('/api/datasets/majors', dataCtrl.getMajors);

//Recieves list of all possible project-types
router.get('/api/datasets/project-types', dataCtrl.getProjectTypes);

//Recieves list of all tags
router.get('/api/datasets/tags', dataCtrl.getTags);

//Recieves list of all job-titles
router.get('/api/datasets/job-titles', dataCtrl.getJobTitles);

//Recieves all socials from datasets
router.get('/api/datasets/socials', dataCtrl.getSocials);

export default router;
