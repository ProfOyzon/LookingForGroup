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
