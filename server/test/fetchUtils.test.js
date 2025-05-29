import { GET, POST, PUT, DELETE } from '../utils/fetchUtils';

const api = 'http://lfg.gccis.rit.edu/api/users';
let newUserId = null;

describe('API Testing, GET all users.', () => {
    it('GET: Should return all users.', async () => {
        const r = await GET(api);

        expect(r).not.toBe('400');
        expect(r.status).toBe(200);

        //is array?
        expect(Array.isArray(r.data)).toBe(true);

        //log one user
        console.log(r.data[1])


    });
});


//IM FIXING THIS STILL
// describe('API Testing: GET, POST, PUT, DELETE for users', () => {

//     //POST
//     it('POST: create new user', async () => {
//         const newUser = {
//             first_name: "Tracy",
//             last_name: "Test",
//             profile_image: null,
//             headline: 'Testing this user',
//             pronouns: 'they/them',
//             job_title: null,
//             major: null,
//             academic_year: null,
//             location: 'Testalvania',
//             fun_fact: 'This is a test',
//             skills: []
//         }

//         const r = await POST(api, newUser);
//         expect(r).not.toBe('400');
//         expect(r.first_name).toBe('Tracy');

//         //record userId for future tests
//         newUserId = r.user_id;
//         //console.log('Test user:', r);

//         console.log(await res.json());

//     });

//     //PUT
//     it('PUT: update creates users name', async () => {
//         const updateUser = {
//             first_name: 'Ursala',
//             last_name: 'Update'
//         }

//         const r = await PUT(`${api}/${newUserId}`, updateUser);
//         expect(r).not.toBe('400');
//         //console.log('Test user:', r);

//         console.log(await res.json());
//     });


//     //GET
//     it('GET: get updated test user by ID', async () => {
//         const r = await GET(`${api}/${newUserId}`);
//         expect(r).not.toBe('400');
//        // expect(r.first_name).toBe('Ursala');
//         console.log('Test user:', r);
//     });

//     //DELETE
//     it('DELETE: delete new created user', async () => {
//         const r = await DELETE(`${api}/${newUserId}`);
//         expect(r).not.toBe('400');
//         console.log('Test user:', r);
//     });

// });