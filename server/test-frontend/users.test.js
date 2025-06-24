import util from '../../client/src/api/users.js';
import { expect, test } from 'vitest';

/**
 * Testing GETs
 */

/**
 * Testing getUsers
 * Gets all data on all public users.
 */
test('Test getUsers: 1: Test return status 200, 2 and 3: Test recieve user information', async () => {
  const response = await util.getUsers();
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
  expect(response.data.data[3].first_name).toBe('Elouise');
});

/**
 * Testing getUsersById
 * Gets all data on one specific user, specified by ID.
 */
test('Test getUsersById: 1: Test return status 200, 2 and 3: Test recieved user information', async () => {
  const response = await util.getUsersById(28);
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
  expect(response.data.data[0].username).toBe('Mistah Bones');
});

/**
 * Testing userInDatabase
 * returns true if email exists in database, false if not.
 */
test('Test userInDatabase: 1: Test in database, 2: Test if not.', async () => {
  let response = await util.userInDatabase('jjp8541@rit.edu');
  expect(response).toBe(true);
  response = await util.userInDatabase('abc1234@rit.edu');
  expect(response).toBe(false);
});

/**
 * Testing getUserByUsername
 * gets data for 1 user, specified by username.
 */
test('Test getUserByUsername: 1: Test status 200, 2: test user information', async () => {
  const response = await util.getUserByUsername('Mistah Bones');
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
  expect(response.data.data[0].first_name).toBe('Mistah');
});

/**
 * Testing getUserByEmail
 * gets data for 1 user, specified by email.
 */
test('Test getUserByEmail: 1: Test status 200, 2: test user information', async () => {
  const response = await util.getUserByEmail('jjp8541@rit.edu');
  expect(response.status).toBe(200);
  expect(response.data.data[0].username).toBe('MJParson');
});

/**
 * Testing getUserFollowing
 * returns array of users following user.
 */
test('Test getUserFollowing: 1: Test status 200, 2: test user returns', async () => {
  const response = await util.getUserFollowing(1);
  expect(response.status).toBe(200);
  expect(response.data.data[0].location).toBe('New York');
});

/**
 * Testing getVisibleProjects
 * gets all projects the user is a member of and has set to be public
 */
test('test getVisibleProjects: 1: test status 200, 2: test data recieved', async () => {
  const response = await util.getVisibleProjects(1);
  expect(response.status).toBe(200);
  expect(response.data.data[0].title).toBe('Cult of the Lamb');
});

/**
 * Testing getProjectFollowing
 * gets array of projects the user is following.
 */
test('test getProjectFollowing: 1: test status 200, 2: test data recieved', async () => {
  const response = await util.getProjectFollowing(1);
  expect(response.status).toBe(200);
  expect(response.data.data[0].title).toBe('Rock Eater 9000');
});
