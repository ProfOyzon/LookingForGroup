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
    })
});