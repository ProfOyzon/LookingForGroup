import util from '../utils/userUtils';


/* - - - GETs - - - */

test('Get all users', async () => {
    const r = await util.getUsers();

    console.log(r);

    expect(r).not.toBe("400");
    expect(r).toBeDefined();
});

test('Get user id 1', async () => {
    const r = await util.getUsersById(1);

    console.log(r);

    expect(r).not.toBe("400");
    expect(r).toBeDefined();
});

test('Get user by email: Mistah Bones: jdp1701@rit.edu', async () => {
    const r = await util.getUserByEmail('jdp1701@rit.edu');

    console.log(r);

    expect(r).not.toBe("400");
    expect(r).toBeDefined();
})