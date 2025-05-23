import { GET, PUT, POST, DELETE } from './fetchUtils';

/**
 * Creates a new project and adds it to the database. All params default to null.
 * @param userId - int | ID of the user creating the project
 * @param title - string | Name of the project
 * @param hook - string | The short description of the project
 * @param desc - string | The long description of the project
 * @param purpose - string | The purpose selected for this project
 * @param status - string | The status of the project
 * @param audience - string | The project's intended audience
 * @param pTypes - array[object] | List of project types
 * @param pTags - array[object] | List of project tags
 * @param jobs - array[object] | List of roles being recruited for
 * @param members  - array[object] | List of project members
 * @param socials - array[object] | List of relevant social media pages
 * @returns 200 if valid, 400 if not
 */
const createNewProject = (_userId, _title, _hook, _desc, _purpose, _status, _audience, _pTypes, _pTags, _jobs, _members, _socials) => {
    const apiURL = `lfg.gccis.rit.edu/api/projects`;

    const data = {
        userId: _userId,
        title: _title,
        hook: _hook,
        description: _desc,
        purpose: _purpose,
        status: _status,
        audience: _audience,
        projectTypes: _pTypes,
        tags: _pTags,
        jobs: _jobs,
        members: _members,
        socials: _socials,
    }

    let response = POST(apiURL, data);
    if(response === "400"){
        console.log("Error creating new project.");
        return "400";
    }
    console.log(`Created project names "${_title}"`);
    return "200";
}

/**
 * Gets all projects in the database
 * @returns Array of all projects if valid, 400 if not
 */
const getProjects = () => {
    const apiURL = `lfg.gccis.rit.edu/api/projects`;
    let response = GET(apiURL);
    return response;
}

/**
 * Retrieves data of a project by its ID
 * @param ID -  ID of project to retrieve
 * @returns - A project object if valid, 400 if not
 */
const getByID = (ID) => {
    const apiURL = `lfg.gccis.rit.edu/api/projects/${ID}`;
    let response = GET(apiURL);
    return response;
}

/**
 * Updates data of an existing project
 * @param ID - ID of the project to update
 * @param data - Mapped data for update
 * @returns Response status
 */
const updateProject = (ID, data) => {
    const apiURL = `lfg.gccis.rit.edu/api/projects/${ID}`;
    let response = PUT(apiURL, data);
    return response;
}

/**
 * Deletes an existing project
 * @returns Response status
 */
const deleteProject = () => {
    const apiURL = `lfg.gccis.rit.edu/api/projects/${ID}`;
    let response = DELETE(apiURL);
    return response;
}

const updateThumbnail = () => {
    // TODO
}

const getPics = () => {
    // TODO
}

const addPic = () => {
    // TODO
}

const updatePicPositions = () => {
    // TODO
}

const deletePic = () => {
    // TODO
}

const addMember = () => {
    // TODO
}

const updateMember = () => {
    // TODO
}

const deleteMember = () => {
    // TODO
}

export default{
    createNewProject,
    getProjects,
    getByID,
    updateProject,
    deleteProject,
    updateThumbnail,
    getPics,
    addPic,
    updatePicPositions,
    deletePic,
    addMember,
    updateMember,
    deleteMember,
}