const request = require('supertest');

describe('API Testing, GET all projects.', () => {
  it('Should return all projects.', async () => {
    const response = await request('https://lfg.gccis.rit.edu/api').get('projects');
    expect(response.statusCode).toBe(200);
    console.log(response.body);
  });
});
