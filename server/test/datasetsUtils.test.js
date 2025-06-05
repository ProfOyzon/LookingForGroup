import request from 'supertest';

const api = 'https://lfg.gccis.rit.edu/api';

// test('get skills', async () => {
//
//     const response = await request(https://lfg.gccis.rit.edu/api).get('/datasets/skills')
//     expect(response.statusCode).toBe(200);
//     console.log(response.body);
//
// });

//same test for all
function dataTest(data, show = false) {
    test(`GET ${data} data`, async () => {

        const response = await request(api).get(`/datasets/${data}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();

        //for console logging
        if (show === true) {
            console.log(response.body);
        }
    });
}

describe('GET all datasets', () => {
    //GET skills
    dataTest('skills');
    //GET tags
    dataTest('tags');
    //GET job titles
    dataTest('job-titles');
    //GET majors
    dataTest('majors');
    //GET project types
    dataTest('projecy-types');
    //GET socials
    dataTest('socials', true);

});