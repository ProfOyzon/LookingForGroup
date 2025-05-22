import { createUser } from '../controllers/users';


/**
 * Creates a new user, and adds them to the signups table.
 * @param token - from url, security token
 * @param email - get signup email if the token is valid. Checks if a user with that email already exists.
 * @returns status - 200 if valid, 400 if not
 */
function createNewUser ( token, email ) {

    

}