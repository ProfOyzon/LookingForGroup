const request = require('supertest');

describe("GET users", () => {
    it('Should return the whole list of users.', async () => {
        const response = await request('https://lfg.gccis.rit.edu/api').get('/users')
        expect(response.statusCode).toBe(200);
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
