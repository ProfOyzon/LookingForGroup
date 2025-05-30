import {login} from '../controllers/users';

// Add Shibboleth login here. Functions are set out in controllers/users.js to login, these are not utilized.


/**
 * Takes sign up data to send confirmation email. The email is then stored in database temporarily
 * 
 * @param {*} _username 
 * @param {*} _password 
 * @param {*} _confirmPassword 
 * @param {*} _email 
 * @param {*} _firstName 
 * @param {*} _lastName 
 * @returns res.status - 201 if success, else status:400, error. Returns token if in dev mode.
 */
async function sendSignup(_username, _password, _confirmPassword, _email, _firstName, _lastName) {
    
}