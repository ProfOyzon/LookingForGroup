import util from '../utils/userUtils.js';

/* - - - GETs - - - */

test('GET: Get all users', async () => {
  const r = await util.getUsers();
  
  console.log(r);

    expect(r.status).toBe(200);
    expect(r).toBeDefined();
});

test('GET: Get user id 1', async () => {
  const r = await util.getUsersById(1);

  console.log(r);

    expect(r.status).toBe(200);
    expect(r).toBeDefined();
});

test('GET: Get user by email: Mistah Bones: jjp8541@rit.edu', async () => {
    const r = await util.getUserByEmail('jjp8541@rit.edu');

  console.log(r);

    expect(r.status).toBe(200);
    expect(r.data).toBeDefined();
});

test('GET: Get user by username: Mistah Bones.', async () => {
    const r = await util.getUserByUsername("Mr.Bones");


    expect(r.status).toBe(200);
    expect(r.data).toBeDefined();
});

test('GET: Check if Mistah Bones is in database.', async () => {
    const r = await util.userInDatabase('jjp8541@rit.edu');
    console.log(r);

  expect(r).toBe(true);
});

test('GET: Get account information for id 19 (Mistah Bones), invalid.', async () => {
    const r = await util.getAccountInformation(19);

  console.log(r);

  expect(r).toBe('400'); // because no authorization
  expect(r).toBeDefined();
});

test('GET: Get people user 1 is following.', async () => {
  const r = await util.getUserFollowing(1);

  console.log(r);

    expect(r.status).toBe(200);
    expect(r).toBeDefined();
});

test('GET: Get projects the user is a member of', async () => {
  const r = await util.getVisibleProjects(1);

  console.log(r);

    expect(r.status).toBe(200);
    expect(r).toBeDefined();
});

test('GET: all projects user is following', async () => {
    const r = await util.getProjectFollowing(1);

    console.log(r);

    expect(r.status).toBe(200);
    expect(r).toBeDefined();
});

/* - - - POSTs - - - */

//test user id
// let testId = null;

// test('POST: Test creating new user.', async () => {
//     const email = `newEmail@rit.edu`;

//     const r = await util.createNewUser(
//         'DEV BYPASS',
//         email,
//         'Toby',
//         'Test',
//         'Created test user',
//         'they/them',
//         1,
//         2,
//         '',
//         '',
//         'please work',
//         [],
//         []
//     );

//     console.log(r);

//     expect(r.status).toBe(201);
//     expect(r.user_id).toBeDefined();

//     //get the user ID
//     testId = r.user_id;
// });


/* - - - PUTs - - - */

// test('PUT: Edit data for a user', async () => {
//     //use test ID
//     expect(testId).toBeDefined();

//     const r = await util.editUser(testId, {
//         funFact: 'The edited worked!'
//     });

//     console.log(r);

//     expect(r.status).toBe(201);
// });


/* - - - DELETEs - - - */

// test('DELETE: deletes a user by id', async () => {
//     //use test ID
//     expect(testId).toBeDefined();

//     const r = await util.deleteUser(testId);

//     console.log(r);
//     expect(r.status).toBe(200);

// });


// npm test userUtils.test.js
