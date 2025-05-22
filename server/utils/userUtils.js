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
 * Gets all data on all public users. Does not return private ones
 * @returns result - JSONified data of all users, else if error, '400'.
 */
function getUsers() {
    apiURL = 'lfg.gccis.rit.edu/api/users';
    response = GET(apiURL);
    if( response = "400" ) return "400";

    return response;
}

/**
 * Gets all data on one specific user, specified by URL.
 * @param id - user_id for user
 * @returns result - JSONified data of specified user.
 */
function getUsers(id) {
    apiURL = `lfg.gccis.rit.edu/api/users/${id}`;
    response = GET(apiURL);
    if( response = "400" ) return "400"; //error

    return response;
}

/**
 * Edit information for one user, specified by URL.
 * @param id- user_id for user
 * @param data - mapped(eg {data1:'value1', data2:'value2'}) data to change for user
 * @returns response data
 */
function editUser(id, data) {
    apiURL = `lfg.gccis.rit.edu/api/users/${id}`;
    response = PUT(apiURL, data);
    if( response = "400" ) return "400";

    return response;
}


/**
 * Removes a user specified by URL.
 * @param id - user_id to be deleted
 * @returns response data
 */
function deleteUser(id) {
    apiURL = `lfg.gccis.rit.edu/api/users/${id}`;
    response = DELETE(apiURL);
    if( response = "400" ) return "400";

    return response;
}

export default {
    createNewUser,
    getUsers,
    editUser,
    deleteUser,
}