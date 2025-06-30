import { Router } from 'express';
import getJobTitlesController from '#controllers/datasets/get-job-titles.ts';
import getSkillsController from '#controllers/datasets/get-skills.ts';

const router = Router();

//Receives list of all job-titles
router.get('/job-titles', getJobTitlesController);

//Receives list of all skills
router.get('/skills', getSkillsController);

//Receives list of all majors
//router.get('/majors', getMajorsController);

//Receives list of all possible project-types
//router.get('/project-types', getProjectTypesController);

//Receives list of all tags
//router.get('/tags', getTagsController);

//Receives all socials from datasets
//router.get('/socials', getSocialsController);

export default router;
