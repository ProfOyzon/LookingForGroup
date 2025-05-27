

const request = require('supertest');



describe('API Testing, GET all users.', () => {
    it('Should return all users.', async () => {
        const response = await request('https://lfg.gccis.rit.edu').get('/api/users');
        expect(response.statusCode).toBe(200);
        console.log(response.body);
    });
});


