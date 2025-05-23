import { createUser } from '../controllers/users';
import { GET, POST, PUT, DELETE } from './fetchUtils';


/**
 * Creates a new user, and adds them to the signups table. All data params default to null.
 * @param token - from url, security token
 * @param email - get signup email if the token is valid. Checks if a user with that email already exists.
 * @param firstName - string, first name of user
 * @param lastName - string, last name of user
 * @param headline - string, headline on a user profile
 * @param pronouns - string, pronouns of the user
 * @param jobTitleId - int, the job/role the user has proficiency in
 * @param majorId - int, Major the user is in
 * @param academicYear - String or int, academic year the user is in up to 10th. accepts 1st, 2nd... or 1,2,...
 * @param location - string, Location of the user.
 * @param funFact - string, fun fact about the user
 * @param bio - string, summary of the user
 * @param skills - array[objects], list of skills. Skill = {int id, int position}
 * @param socials - array[objects] List of socials. Socials = {int id, string url}
 * @returns status - 200 if valid, 400 if not
 */
function createNewUser ( token, email, _firstName, _lastName, _headline, _pronouns, _jobTitleId, _majorId, _academicYear, _location, _funFact, _bio, _skills, _socials ) {

    //check if token is valid
    apiURL = `lfg.gccis.rit.edu/api/signup/${token}`
    response = GET(apiURL);
    if(response == "400") {
        console.log("Token does not exist.");
        return "400";
    }
    //else, token valid and check if a user with that email already exists.
    if( userInDatabase(email) ) {
        console.log("User is already in database, create fails");
        return "400"
    } else {
        //user is not in database, add them. 
        const data = {
            firstName: _firstName,
            lastName: _lastName,
            headline: _headline,
            pronouns: _pronouns,
            jobTitleId: _jobTitleId,
            majorId: _majorId,
            academicYear: _academicYear,
            location: _location,
            funFact: _funFact,
            bio: _bio,
            skills: _skills,
            socials: _socials
        };

        response = POST( apiURL, data);
        if ( response = "400" ) {
            console.log("Error creating a new user.");
            return "400";
        }
        console.log(`User ${email, _firstName, _lastName} created.`);
        return "200";
    }

}


/**
 * Checks if a User is already within database through RIT email
 * @param email - RIT email, string
 * @returns result - boolean, true if they exist within database, false if not.
 */
function userInDatabase(email) {
    apiURL = `lfg.gccis.rit.edu/api/users/search-email/${email}`;
    response = GET(apiURL);
    if( response = "400" ) {
        console.log("No user with that email in the database.");
        return false;
    } else {
        console.log("User found with email",email);
        return true;
    }
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
 * Get account information of a user through ID
 * @param user_id - int, id of the user
 * @returns data - JSONified data from account information. 400 if not valid.
 * @returns user_id, primary_email, rit_email, username, visibility
 */
function getAccountInformation ( id ) {
    apiURL = `lfg.gccis.rit.edu/api/users/${id}/account`;
    response = GET(apiURL);
    if( response = "400" ) {
        return "400";
    }

    console.log("User accound information recieved")
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


/**
 * Update Profile Picture for a user's id.
 * @param id - int, the user_id to change
 * @param image - file, the picture to put into the user's profile
 * @return status, 200 if successful, 400 if not, and data. data=array[object] with the profile_image, string, name of the file
 */
function updateProfilePicture( id, _image ) {
    apiURL = `lfg.gccis.rit.edu/api/users/${id}/profile-picture`;
    data = {image: _image};
    response = PUT(apiURL, data);
    if( response = "400" ){
        console.log("error updating profile picture.");
        return "400";
    }
    console.log("Updated Profile Picture for user.")
    return "200";
}

/**
 * Update email for a user
 * @param id = user_id for the profile wishing to change email.
 * @param email - email to change to
 * @param confirm_email - secondary entering of email to confirm
 * @param password - the user's current password.
 * @returns response, 200 if valid, 400 if not, 401 if emails do not match.
 */
function updateEmail ( id, _email, _confirm_email, _password) {
    apiURL = `lfg.gccis.rit.edu/api/users/${id}/email`;
    if( _email != _confirm_email) {
        console.log("Not the same email, try again.");
        return "401";
    }
    data = {
        email: _email,
        confirm: _confirm_email,
        password: _password
    };

    response = PUT(apiURL, data);
    if( response = "400" ){
        console.log("error updating email.");
        return "400";
    }
    console.log("Updated primary email for user.")
    return "200";
}

/**
 * Update username through id.
 * @param username - username to change to
 * @param confirm_user - secondary entering of username to confirm
 * @param password - the user's current password.
 * @returns response, 200 if valid, 400 if not, 401 if users do not match.
 */
function updateUsername( id, _username, _confirm_user, _password ) {
    apiURL = `lfg.gccis.rit.edu/api/users/${id}/username`;
    if(_username != _confirm_user) {
        console.log("Usernames are not the same.");
        return "401";
    }
    data = {
        username: _username,
        confirm_user: _confirm_user,
        password: _password
    };

    response = PUT(apiURL, data);
    if( response = "400" ){
        console.log("error updating username.");
        return "400";
    }
    console.log("Updated primary username for user.")
    return "200";
}

export default {
    createNewUser,
    getUsers,
    editUser,
    deleteUser,
    userInDatabase,
    updateProfilePicture,
    getAccountInformation,
    updateEmail,
    updateUsername,
}