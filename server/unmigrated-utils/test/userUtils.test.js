import { rawListeners } from 'process';
import util from '../utils/userUtils.js';

/* - - - GETs - - - */

test('GET: Get all users', async () => {
  const r = await util.getUsers();

  //console.log(r);

  expect(r.status).toBe(200);
  expect(r).toBeDefined();
});

test('GET: Get user id 19 (mistah bones)', async () => {
  const r = await util.getUsersById(19);

  //console.log(r.data);

  expect(r.status).toBe(200);
  expect(r).toBeDefined();
});

test('GET: Get account information for id 19 (Mistah Bones), invalid (unauthorized).', async () => {
  const r = await util.getAccountInformation(19);

  //console.log(r.data);

  expect(r.status).toBe(401); // because no authorization
  expect(r).toBeDefined();
});

test('GET: Get user by email: Mistah Bones: jjp8541@rit.edu', async () => {
  const r = await util.getUserByEmail('jjp8541@rit.edu');

  //console.log(r.data);

  expect(r.status).toBe(200);
  expect(r.data).toBeDefined();
});

test('GET: Get user by username: Mistah Bones.', async () => {
  const r = await util.getUserByUsername('Mr.Bones');

  //console.log(r.data);

  expect(r.status).toBe(200);
  expect(r.data).toBeDefined();
});

test('GET: Check if Mistah Bones is in database.', async () => {
  const r = await util.userInDatabase('jjp8541@rit.edu');
  //console.log('In database: ', r);

  expect(r).toBe(true);
});

test('GET: Get people user 19 is following.', async () => {
  const r = await util.getUserFollowing(19);

  //console.log(r.data);

  expect(r.status).toBe(200);
  expect(r).toBeDefined();
});

test('GET: Get projects the user is a member of', async () => {
  const r = await util.getVisibleProjects(19);

  //console.log(r.data);

  expect(r.status).toBe(200);
  expect(r).toBeDefined();
});

test('GET: all projects user is following', async () => {
  const r = await util.getProjectFollowing(19);

  //console.log(r.data);

  expect(r.status).toBe(200);
  expect(r).toBeDefined();
});

/* - - - POSTs - - - */

test('POST: Create new user.', async () => {
  const r = await util.createNewUser(
    '',
    'jjp8541@g.rit.edu',
    'John',
    'Testing',
    'Test Account',
    'It/Its',
    1,
    2,
    1,
    '',
    '',
    'hoping and praying',
    [],
    [],
  );

  console.log('create new user:', r);

  expect(r.status).toBe(200);
  expect(r).toBeDefined();
});

/* - - - PUTs - - - */

test('PUT: change user (mistah bones), first name to mr.', async () => {
  let user_id = 19;
  let data = [
    {
      firstName: 'mr.',
    },
  ];
  const r = await util.editUser(user_id, data);

  console.log('edit user:', r);

  const change = await util.getUsersById(19);
  const first = change.data.firstName;
  console.log('edit user, first name:', first);
  expect(first).toBe('mr.');
});

test('PUT: make mistah bones follow project id 5 (wild ride)', async () => {
  let user_id = 19;
  let project_id = 5;
  const r = await util.addProjectFollowing(user_id, project_id);

  console.log(r);

  const change = await util.getProjectFollowing(user_id);
  const wildride = change.data[0];
  console.log('presumed wildride:', wildride);
  expect(wildride).toBeDefined();
});

/* - - - DELETEs - - - */

test('DELETE: deletes a user by id, invalid', async () => {
  //use test ID
  expect(20).toBeDefined();

  const r = await util.deleteUser(20);

  console.log('delete by id: ', r);
  expect(r.status).toBe(401);
});

// npm test userUtils.test.js
