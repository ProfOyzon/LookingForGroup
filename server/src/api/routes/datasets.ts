import { Router } from 'express';
import getJobTitlesController from '#controllers/datasets/get-job-titles.ts';

const router = Router();

//Receives list of all job-titles
router.get('/job-titles', getJobTitlesController);

//Receives list of all skills

//Receives list of all majors

//Receives list of all possible project-types

//Receives list of all tags

//Receives all socials from datasets

export default router;
