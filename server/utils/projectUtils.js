import envConfig from '../config/env.js';
import { GET, PUT, POST, DELETE } from './fetchUtils.js';

const root =
  envConfig.env === 'development' || envConfig.env === 'test'
    ? `http://localhost:8081/api`
    : `https://lfg.gccis.rit.edu/api`;

/**
 * Creates a new project and adds it to the database. All params default to null.
 * @param {number} _userId - ID of the user creating the project
 * @param {string} _title - Name of the project
 * @param {string} _hook - The short description of the project
 * @param {string} _desc - The long description of the project
 * @param {string} _purpose - The purpose selected for this project
 * @param {string} _status - The status of the project
 * @param {string} _audience - The project's intended audience
 * @param {Array<object>} _pTypes - List of project types
 * @param {Array<object>} _pTags - List of project tags
 * @param {Array<object>} _jobs - List of roles being recruited for
 * @param {Array<object>} _members  - List of project members
 * @param {Array<object>} _socials - List of relevant social media pages
 * @returns "200" if valid, "400" if not
 */
const createNewProject = async (
  _userId,
  _title,
  _hook,
  _desc,
  _purpose,
  _status,
  _audience,
  _pTypes,
  _pTags,
  _jobs,
  _members,
  _socials
) => {
  const apiURL = `${root}/projects`;

  const data = {
    userId: _userId,
    title: _title,
    hook: _hook,
    description: _desc,
    purpose: _purpose,
    status: _status,
    audience: _audience,
    project_types: _pTypes,
    tags: _pTags,
    jobs: _jobs,
    members: _members,
    socials: _socials,
  };

  let response = await POST(apiURL, data);
  if (response === '400') {
    console.log('Error creating new project.');
    return '400';
  }
  console.log(`Created project named "${_title}"`);
  return '200';
};

/**
 * Gets all projects in the database
 * @returns Array of all projects if valid, "400" if not
 */
const getProjects = async () => {
  const apiURL = `${root}/projects`;

  let response = await GET(apiURL);

  if (response === '400') {
    return '400';
  }
  return response.data;
};

/**
 * Retrieves data of a project by its ID
 * @param {number} ID -  ID of project to retrieve
 * @returns - A project object if valid, "400" if not
 */
const getByID = async (ID) => {
  const apiURL = `https://lfg.gccis.rit.edu/api/projects/${ID}`;
  let response = await GET(apiURL);
  if (response === '400') {
    return '400';
  }
  return response.data;
};

/**
 * Updates data of an existing project
 * @param {number} ID - ID of the project to update
 * @param {Object} data - Mapped data for update
 * @returns Response status
 */
const updateProject = async (ID, data) => {
  const apiURL = `${root}/projects/${ID}`;
  let response = await PUT(apiURL, data);
  if (response === '400') {
    return '400';
  }
  return '200';
};

/**
 * Deletes an existing project
 * @param {number} ID - ID of the project to delete
 * @returns Response status
 */
const deleteProject = async (ID) => {
  const apiURL = `${root}/projects/${ID}`;
  let response = await DELETE(apiURL);
  if (response === '400') {
    return '400';
  }
  return '200';
};

/**
 * Updates the thumbnail image for a project
 * @param {number} ID - ID of the project to update
 * @param {File|string} _image - Image file of new thumbnail
 * @returns The filename of the thumbnail image if valid, "400" if not
 */
const updateThumbnail = async (ID, _image) => {
  const apiURL = `${root}/projects/${ID}/thumbnail`;
  const data = { image: _image };
  let response = await PUT(apiURL, data);
  if (response === '400') {
    return '400';
  }
  return response.data;
};

/**
 * Gets the pictures used in a project's carousel
 * @param {number} ID - ID of the target project
 * @returns Array of image objects if valid, "400" if not
 */
const getPics = async (ID) => {
  const apiURL = `${root}/projects/${ID}/pictures`;
  let response = await GET(apiURL);
  if (response === '400') {
    return '400';
  }
  return response.data;
};

/**
 * Adds a picture to a project's carousel
 * @param {number} ID - ID of the target project
 * @param {File|string} _image - Image file to be added
 * @param {number} _position - Position of the image in the carousel
 * @returns Response status
 */
const addPic = async (ID, _image, _position) => {
  const apiURL = `${root}/projects/${ID}/pictures`;
  const data = {
    image: _image,
    position: _position,
  };
  let response = await POST(apiURL, data);
  if (response === '400') {
    return '400';
  }
  return '200';
};

/**
 * Updates position order of a project's carousel pictures
 * @param {number} ID - ID of the target project
 * @param {Array<Object>} images - Array of objects, which contain the image "id" and new "position"
 * @returns Response status
 */
const updatePicPositions = async (ID, images) => {
  const apiURL = `${root}/projects/${ID}/pictures`;
  let response = await PUT(apiURL, images);
  if (response === '400') {
    return '400';
  }
  return '200';
};

/**
 * Deletes a picture in a project
 * @param {number} ID - ID of the target project
 * @param {string} image - Filename of the image to delete
 * @returns Response status
 */
const deletePic = async (ID, image) => {
  //FIX ROUTE FOR DELETING PICTURE
  //NEEDS TO SPECIFY WHAT PICTURE IS BEING DELETED BY IMAGE NAME
  const apiURL = `${root}/projects/${ID}/pictures`;
  let response = await DELETE(apiURL);
  if (response === '400') {
    return '400';
  }
  return '200';
};

/**
 * Adds a member to a project
 * @param {number} ID - ID of the target project
 * @param {number} _userId - ID of the user to add
 * @param {number} _titleId - ID of the user's role
 * @param {number} _permission - The user's access level
 * @returns Response status
 */
const addMember = async (ID, _userId, _titleId, _permission) => {
  const apiURL = `${root}/projects/${ID}/members`;
  const data = {
    userId: _userId,
    titleId: _titleId,
    permission: _permission,
  };
  let response = await POST(apiURL, data);
  if (response === '400') {
    return '400';
  }
  return '200';
};

/**
 * Updates an existing member in a project
 * @param {number} ID - ID of the target project
 * @param {number} _userId - ID of the user to update
 * @param {number} _titleId - ID of the user's role
 * @param {number} _permission - The user's access level
 * @returns Response status
 */
const updateMember = async (ID, _userId, _titleId, _permission) => {
  const apiURL = `${root}/projects/${ID}/members`;
  const data = {
    userId: _userId,
    titleId: _titleId,
    permission: _permission,
  };
  let response = await PUT(apiURL, data);
  if (response === '400') {
    return '400';
  }
  return '200';
};

/**
 * Removes a member from a project
 * @param {number} ID - ID of the target project
 * @param {number} userId - ID of the target user
 * @returns Response status
 */
const deleteMember = async (ID, userId) => {
  const apiURL = `${root}/projects/${ID}/members/${userId}`;
  let response = await DELETE(apiURL);
  if (response === '400') {
    return '400';
  }
  return '200';
};

export default {
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
};
