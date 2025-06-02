import utils from "../utils/loginUtils";

/* - - - POSTs - - -*/
//create a new user (prompt email). in dev environment, returns token.
test('Add user information to database, set up for account activtion', async () => {
    const r = await utils.sendSignup('testaccount','password123','password123','jjp8541@rit.edu','John','Testing');

    console.log('Return code: ',r.status);
    console.log('Error: ', r.error);

    expect(r.status).toBe(201);

    console.log('proposed token _______________ ',r.data);
});