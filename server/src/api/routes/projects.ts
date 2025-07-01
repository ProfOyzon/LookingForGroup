import { Router } from 'express';
import getProjects from '#controllers/projects/get-projects.ts';

const router = Router();

//Receive all projects
router.get('/', getProjects);

//Create a new project

//Get a specific project
//router.get('/api/projects/:id', getProjectById);

//Edits a project through a specific id

//Deletes project through a specific id

//Edits a project thumbnail through a specific id

//Receives picture from project through id
//router.get('/api/projects/:id/pictures', getPictures);

//Creates a new picture for a project

//Changes a picture for a project

//Removes picture from a project

//Adds member to a specific project through id

//Edits a member of a specific project through id

//Removes a member from a specific project through project and user ID

export default router;
