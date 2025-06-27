import util from '../../client/src/api/projects.js';
import { expect, test } from 'vitest';

/**
 * Testing GETs
 */

/**
 * Testing getProjects
 * Gets all data on all projects
 */
test('Test getProjects: 1: Test return status 200, 2: Test recieve user information', async () => {
  const response = await util.getProjects();
  expect(response.status).toBe(200);
  expect(response.data[0].title).toBe('Cult of the Lamb');
});

/**
 * Testing getByID
 * Gets data on specific project through ID
 */
test('Test getByID: 1: Test return status 200, 2: Test return status incorrect, 3: Test recieve project information', async () => {
  const correctResponse = await util.getByID(1);
  expect(correctResponse.status).toBe(200);
  const incorrectResponse = await util.getByID(400);
  expect(incorrectResponse.status).toBe(400);
  expect(correctResponse.data[0].title).toBe('Cult of the Lamb');
});

/**
 * Testing getPics
 * Gets profile pictures of target project
 */
test('Test getPics: 1: Test return status 200, 2: Test return status incorrect, 3: Test recieved project information', async () => {
  const correctResponse = await util.getPics(1);
  expect(correctResponse.status).toBe(200);
  const incorrectResponse = await util.getPics(400);
  expect(incorrectResponse.status).toBe(401);
  expect(correctResponse.data[0].image).toBe('1picture1731360414990.webp');
});

/**
 * Testing POSTs
 */

/**
 * Testing createNewProject
 * Create a new project in the lfg database
 * Requires Shibboleth
 */
test('Test createNewProject(INVALID): 1: Test bad return status', async () => {
  const badResponse = await util.createNewProject(28, '', '', '', '', '', '', [], [], [], [], []);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing addPic
 * Adds a picture to a project's carousel (in the lfg database)
 * Requires Shibboleth
 */
test('Test addPic(INVALID): 1: Test bad return status', async () => {
  const id = 5;
  const image = new File([], 'image.png');
  const position = 1;
  const badResponse = await util.addPic(id, image, position);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing addMember
 * Adds a member to a project
 * Requires Shibboleth
 */
test('Test addMember(INVALID): 1: Test bad return status', async () => {
  const id = 5;
  const userid = 28;
  const title = 1;
  const perm = 1;
  const badResponse = await util.addMember(id, userid, title, perm);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing PUTs
 */

/**
 * Testing updateProject
 * Updates data of an existing project
 * Requires Shibboleth
 */
test('Testing updateProject(INVALID): 1: Test bad response status', async () => {
  const id = 5;
  const data = {
    title: 'Mr. bones test',
  };
  const badResponse = await util.updateProject(id, data);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing updateThumbnail
 * Updates the thumbnail image for a project
 * Requires Shibboleth
 */
test('Testing updateThumbnail(INVALID): 1: Test bad response status', async () => {
  const id = 5;
  const image = new File([], '');
  const badResponse = await util.updateThumbnail(id, image);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing updatePicPositions
 * Updates the position order of a project's carousel pictures
 * Requires Shibboleth
 */
test('Testing updatePicPositions(INVALID): 1: Test bad response status', async () => {
  const id = 5;
  const images = [
    {
      id: 1,
      position: 2,
    },
    {
      id: 2,
      position: 1,
    },
  ];
  const badResponse = await util.updatePicPositions(id, images);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing updateMember
 * Updates an existing member in a project
 * Requires Shibboleth
 */
test('Testing updateMember(INVALID): 1: Test bad response status', async () => {
  const id = 5;
  const userid = 28;
  const title = 1;
  const perm = 0;
  const badResponse = await util.updateMember(id, userid, title, perm);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing DELETEs
 */

/**
 * Testing deleteProject
 * Deletes an existing project from lfg database.
 * Also deletes user/member associations with that project.
 * Requires Shibboleth
 */
test('Testing deleteProject(INVALID): 1: test bad response status', async () => {
  const id = 5;
  const badResponse = await util.deleteProject(id);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing deletePic
 * Deletes a picture in a project carousel
 * Moves all other pictures up to fill carousel
 * Requires Shibboleth
 */
test('Testing deletePic(INVALID): 1: test bad response status', async () => {
  const id = 5;
  const image = '';
  const badResponse = await util.deletePic(id, image);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing deleteMember
 * Deletes a member from a project
 * Requires Shibboleth
 */
test('Testing deleteMember(INVALID): 1: test bad response status', async () => {
  const id = 5;
  const userid = 28;
  const badResponse = await util.deleteMember(id, userid);
  expect(badResponse.status).toBe(401);
});
