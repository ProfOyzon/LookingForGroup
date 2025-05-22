import { createUser } from '../controllers/users';
import { GET, POST, PUT, DELETE } from './fetchUtils';


/**
 * Creates a new user, and adds them to the signups table.
 * @param token - from url, security token
 * @param email - get signup email if the token is valid. Checks if a user with that email already exists.
 * @returns status - 200 if valid, 400 if not
 */
function createNewUser ( token, email ) {

    

}

/**
 * Gets data on all public users. Does not return private ones
 * @returns result - JSONified data of all users, else if error, '400'.
 */
function getUsers() {
    apiURL = 'lfg.gccis.rit.edu/api/users';
    response = GET(apiURL);
    if( response = "400" ) return "400";

    return response;
}

/**
 * Gets data on one specific user, specified by URL.
 * 
 */




export default {
    createNewUser,
    getUsers,
}