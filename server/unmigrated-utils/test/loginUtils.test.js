import utils from '../utils/loginUtils.js';

/* - - - POSTs - - -*/
//Login as the user.

//create a new user (prompt email). in dev environment, returns token.
test('Add user information to database, set up for account activation', async () => {
  const response = await utils.sendSignup(
    'testaccount',
    'password123',
    'password123',
    'jjp8541@rit.edu',
    'John',
    'Testing',
  );

  expect(response).toBeDefined();

  //check if defined for ts checking
  if (!response) {
    throw new Error('sendSignup response is undefined');
  }

  console.log('Sign up: ', response);

  expect(response.status).toBe(201);

  console.log('proposed token _______________ ', response.data);
});

test('Logs in user with using username and password', async () => {
  const response = await utils.login('testaccount', 'password123');

  //check if defined for ts checking
  if (!response) {
    throw new Error('login response is undefined');
  }

  console.log('Login: ', response);

  expect(response.status).toBe(400); //because user is not in database
});
