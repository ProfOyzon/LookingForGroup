//import util from '../utils/userUtils';
const request = require('supertest');

describe("GET users", () => {
    it('Should return the whole list of users.', async () => {
        const response = await request('https://lfg.gccis.rit.edu/api').get('/users')
        expect(response.statusCode).toBe(200);
        console.log(response.body);
    });
    it('Should return a single user at id=1.', async () => {
        const response = await request('https://lfg.gccis.rit.edu/api').get('/users/1');
        expect(response.statusCode).toBe(200);
    });
    it('Should return single user data by username', async () => {
        const username = 'userLily';
        const response = await request('https://lfg.gccis.rit.edu/api').get(`/users/search-username/${username}`);
        expect(response.statusCode).toBe(200);
    });
     it('Should return single user data by email', async () => {
        const email = 'jmh4687@g.rit.edu'; //returns empty because no account is attatched to it
        const response = await request('https://lfg.gccis.rit.edu/api').get(`/users/search-email/${email}`);
        expect(response.statusCode).toBe(200);
        //console.log(response.body.data);
    });
});

describe("Check if user exists in database through email.", () => {
    it('Should return false since email jmh4687@g.rit.edu doesnt exist.', async () => {
        const email = 'jmh4687@g.rit.edu';
        const response = await request('https://lfg.gccis.rit.edu/api').get(`/users/search-email/${email}`);
        expect(response.statusCode).toBe(200);
    })
});

describe("Get user account information through a user id.", () => {
    it('Returns status 200 and undefined data, not authorized.', async () => {
        const id = 1;
        const response = await request('https://lfg.gccis.rit.edu/api').get(`users/${id}/account`);
        expect(response.statusCode).toBe(200);
    })
});


describe("Create a new user (John Testing)", () => {
    it('Should create a user, need token, email, first name, last name', async () => {
        //const _token =
        const data = {
            firstName: "John",
            lastName: "Testing",
            email: "literallyaflower@gmail.com",
        };
        const response = await request('https://lfg.gccis.rit.edu/api').post(`signup/`);
        expect(response.statusCode).toBe(200);
    });
    it('Should recieve user information from John Testing.', async () => {
        const response = await request('https://lfg.gccis.rit.edu/api').get(`users/search-email/literallyaflower@gmail.com`);
        expect(response.statusCode).toBe(200);
    })
});

//doesn't work because user isn't created yet 
// describe("Edit user account information through data.", () => {
//     it("Returns status 200 and response data.", async () => {
//         const data = {
//             firstName: "Johann"
//         };
//         const response = await request('https://lfg.gccis.rit.edu/api').put('/users/24');
//         expect(response.statusCode).toBe(200);
//     })
//})