import util from '../utils/userUtils';

/* - - - GETs - - - */

test('Get all users', async () => {
  const r = await util.getUsers();

  console.log(r);

  expect(r).not.toBe('400');
  expect(r).toBeDefined();
});

test('Get user id 1', async () => {
  const r = await util.getUsersById(1);

  console.log(r);

  expect(r).not.toBe('400');
  expect(r).toBeDefined();
});

test('Get user by email: Mistah Bones: jdp1701@rit.edu', async () => {
  const r = await util.getUserByEmail('jdp1701@rit.edu');

  console.log(r);

  expect(r).not.toBe('400');
  expect(r).toBeDefined();
});

test('Get user by username: Mistah Bones.', async () => {
  const r = await util.getUserByUsername('Mistah Bones');

  console.log(r);

  expect(r).not.toBe('400');
  expect(r).toBeDefined();
});

test('Check if Mistah Bones is in database.', async () => {
  const r = await util.userInDatabase('jdp1701@rit.edu');

  console.log(r);

  expect(r).toBe(true);
});

test('Get account information for id 28 (Mistah Bones), invalid.', async () => {
  const r = await util.getAccountInformation(28);

  console.log(r);

  expect(r).toBe('400'); // because no authorization
  expect(r).toBeDefined();
});
// test('Get account information for id 28 (Mistah Bones), valid.', async () => {

// });

test('Get people user 1 is following.', async () => {
  const r = await util.getUserFollowing(1);

  console.log(r);

  expect(r).not.toBe('400');
  expect(r).toBeDefined();
});

/* - - - POSTs - - - */

// test('Test creating new user.', async () => {

// });

/* - - - PUTs - - - */

/* - - - DELETEs - - - */
