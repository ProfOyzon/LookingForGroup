import util from '../../client/src/api/projects.js';
import { expect, test } from 'vitest';

/**
 * Testing GETs
 */

/**
 * Testing getProjects
 * Gets all data on all projects
 */
test('Test getProjects: 1: Test return status 200, 2 and 3: Test recieve user information', async () => {
  const response = await util.getProjects();
  expect(response.status).toBe(200);
  console.log(response);
});
