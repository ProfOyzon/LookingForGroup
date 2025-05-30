import request from 'supertest';

test('get skills', async () => {
  it('should return the whole list of skills', async () => {
    const response = await request('https://lfg.gccis.rit.edu/api').get('/datasets/skills')
    expect(response.statusCode).toBe(200);
    console.log(response.body);
  });
});
