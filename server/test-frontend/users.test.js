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
  expect(response.data[3].first_name).toBe('Elouise');
});

/**
 * Testing getUsersById
 * Gets all data on one specific user, specified by ID.
 */
test('Test getUsersById: 1: Test return status 200, 2 and 3: Test recieved user information', async () => {
  const response = await util.getUsersById(28);
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
  expect(response.data[0].username).toBe('Mistah Bones');
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
  expect(response.data[0].first_name).toBe('Mistah');
});

/**
 * Testing getUserByEmail
 * gets data for 1 user, specified by email.
 */
test('Test getUserByEmail: 1: Test status 200, 2: test user information', async () => {
  const response = await util.getUserByEmail('jjp8541@rit.edu');
  expect(response.status).toBe(200);
  expect(response.data[0].username).toBe('MJParson');
});

/**
 * Testing getUserFollowing
 * returns array of users following user.
 */
test('Test getUserFollowing: 1: Test status 200, 2: test user returns', async () => {
  const response = await util.getUserFollowing(1);
  expect(response.status).toBe(200);
  expect(response.data[0].location).toBe('New York');
});

/**
 * Testing getVisibleProjects
 * gets all projects the user is a member of and has set to be public
 */
test('test getVisibleProjects: 1: test status 200, 2: test data recieved', async () => {
  const response = await util.getVisibleProjects(1);
  expect(response.status).toBe(200);
  expect(response.data[0].title).toBe('Cult of the Lamb');
});

/**
 * Testing getProjectFollowing
 * gets array of projects the user is following.
 */
test('test getProjectFollowing: 1: test status 200, 2: test data recieved', async () => {
  const response = await util.getProjectFollowing(1);
  expect(response.status).toBe(200);
  expect(response.data[0].title).toBe('Rock Eater 9000');
});

/**
 * Testing getAccountInformation
 * Gets sensitive account information
 */
test('Test getAccountInformation(INVALID): 1: Tests bad return status', async () => {
  const id = 28;
  const badResponse = await util.getAccountInformation(id);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing POSTs
 */

/**
 * Testing createNewUser
 * Adds a new user into database
 */
test('Test createNewUser(INVALID): 1: Tests bad return status', async () => {
  const data = {
    firstName: 'john',
    lastName: 'testing',
    headline: '',
    pronouns: 'it/its',
    jobTitleId: 1,
    majorId: 1,
    academicYear: 1,
    location: 'NYC',
    funFact: 'test',
    skills: [],
    socials: [],
  };
  const email = 'abc1234@rit.edu';
  const token = '';
  const badResponse = await util.createNewUser(token, email, data);
  expect(badResponse.status).toBe(400);
});

/**
 * Testing addUserFollowing
 * adds a new user following specified user
 */
test('Test addUserFollowing(INVALID): 1: Test bad status response', async () => {
  const id = 28;
  const followid = 6;
  const badResponse = await util.addUserFollowing(id, followid);
  expect(badResponse.status).toBe(400);
});

/**
 * Testing addProjectFollowing
 * Adds a new project following for a user
 */
test('Test addProjectFollowing(INVALID): 1: Test bad status response', async () => {
  const id = 28;
  const projid = 1;
  const badResponse = await util.addProjectFollowing(id, projid);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing PUTs
 */

/**
 * Testing editUser
 * Changes user information in the database
 */
test('Test editUser(INVALID): 1: Tests bad return status', async () => {
  const data = {
    firstName: 'joan',
  };
  const id = 28;
  const badResponse = await util.editUser(id, data);
  expect(badResponse.status).toBe(400);
});

/**
 * Testing updateProfilePicture
 * Changes profile picture in the database
 */
test('Test updateProfilePicture(INVALID): Tests bad return status', async () => {
  const image = new File([], 'image.png');
  const id = 28;
  const badResponse = await util.updateProfilePicture(id, image);
  expect(badResponse.status).toBe(401);
});

/**
 * Testing updateEmail
 * Changes Email in the database
 */
test('Test updateEmail(INVALID): Tests bad return status', async () => {
  const email = 'cba4321@rit.edu';
  const id = 28;
  const badResponse = await util.updateEmail(id, email, email, '');
  expect(badResponse.status).toBe(400);
});

/**
 * Test updateUsername
 * Changes username for user
 */
test('Test updateUsername(INVALID): Tests bad return status', async () => {
  const id = 28;
  const username = 'jtest';
  const password = 'password123';
  const badResponse = await util.updateUsername(id, username, username, password);
  expect(badResponse.status).toBe(400);
});

/**
 * Test updateUserVisibility
 * Changes userVisibility for user.
 */
test('Test updateUserVisibility(INVALID): Tests bad return status', async () => {
  const id = 28;
  const badResponse = await util.updateUserVisibility(id);
  expect(badResponse.status).toBe(400);
});

/**
 * Test updateProjectVisibility
 * Changes project visibility for specific project
 */
test('Test updateProjectVisibility: 1: Tests bad return status', async () => {
  const id = 28;
  const projid = 1;
  const visibility = 'public';
  const badResponse = await util.updateProjectVisibility(id, projid, visibility);
  expect(badResponse.status).toBe(400);
});

/**
 * Testing DELETEs
 */

/**
 * Test deleteUserFollowing
 * Unfollows person for a user
 */
test('Test deleteUserFollowing(INVALID): Tests bad return status', async () => {
  const id = 28;
  const unfollowid = 6;
  const badResponse = await util.deleteUserFollowing(id, unfollowid);
  expect(badResponse.status).toBe(400);
});

/**
 * Test deleteProjectFollowing
 * Unfollows a project for a user
 */
test('Test deleteProjectFollowing(INVALID): Tests bad return status', async () => {
  const id = 28;
  const unfollowid = 1;
  const badResponse = await util.deleteProjectFollowing(id, unfollowid);
  expect(badResponse.status).toBe(400);
});
