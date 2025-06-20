import { GET, POST, PUT, DELETE, RESPONSE } from './index'
import { User, Skill, Social, ApiResponse } from './types';

const root = import.meta.env.MODE === 'development'
    ? 'http://localhost:8081/api'
    : 'https://lfg.gccis.rit.edu/api';


/* USER CRUD */


export interface CreateUserData {
    firstName: string;
    lastName: string;
    headline: string;
    pronouns: string;
    jobTitleId: number;
    majorId: number;
    academicYear: number;
    location: string;
    funFact: string;
    skills: Skill[];
    socials: Social[];
}

//This probably with change with shibbolth???
/**
 * Creates a new user, and adds them to the signups table. All data params default to null.
 * @param token - from url, security token
 * @param email - get signup email if the token is valid. Checks if a user with that email already exists.
 * @param userData - data for creating a user
 * @returns status - 200 if valid, 400 if not
 */
export const createNewUser = async (
    token: string,
    email: string,
    userData: CreateUserData
): Promise<ApiResponse> => {
    //check if token is valid
    const apiURL = `${root}/signup/${token}`;

    //token validation
    const tokenRes = await GET(apiURL);
    if (tokenRes.status === 400) {
        console.log('Token does not exist.');
        return { status: 400, error: 'Token does not exist.' };
    }

    const userExist = await userInDatabase(email);
    if (userExist) {
        return RESPONSE(400, 'User is already in database')
    }

    const response = await POST(apiURL, userData);
    if (response.status === 400) {
        console.log('Error creating a new user.');
        return { status: 400, error: 'Error creating a new user.' };
    }
    console.log(`User ${email} created.`);
    console.log(response);
    return response;
}

/**
 * Gets all data on all public users. Does not return private ones
 * @returns result - JSONified data of all users, else if error, '400'.
 */
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
    const apiURL = `${root}/users`;
    return await GET(apiURL);
}

/**
 * Gets all data on one specific user, specified by URL.
 * @param id - user_id for user
 * @returns result - JSONified data of specified user.
 */
export const getUsersById = async (id: number): Promise<ApiResponse> => {
    const apiURL = `${root}/users/${id}`;
    return await GET(apiURL);
}

/**
 * Edit information for one user, specified by URL.
 * @param id - user_id for user
 * @param data - mapped(eg {data1:'value1', data2:'value2'}) data to change for user
 * @returns response data
 */
export const editUser = async (id: number, data: Partial<User>): Promise<ApiResponse> => {
    const apiURL = `${root}/api/users/${id}`;
    return await PUT(apiURL, data);
}

/**
 * Removes a user specified by URL.
 * @param id - user_id to be deleted
 * @returns response data
 */
export const deleteUser = async (id: number): Promise<ApiResponse> => {
    const apiURL = `${root}/users/${id}`;
    return await DELETE(apiURL);
}



/* USER VERIFICATION */

/**
 * Checks if a User is already within database through RIT email
 * @param email - RIT email, string
 * @returns result - boolean, true if they exist within database, false if not.
 */
export const userInDatabase = async (email: string): Promise<boolean> => {
    const apiURL = `${root}/users/search-email/${email}`;
    const response = await GET(apiURL);

    if (response.status === 400) {
        console.log('Error fetching email.');
        return false;
    } else {
        if (!response.data || response.data.length === 0) {
            console.log(response.data);
            return false;
        }
        console.log('User found with email', email);
        return true;
    }
}

//NEED TO DO//

/* PROFILE MANAGMENT */

/**
 * Update Profile Picture for a user's id.
 * @param id - int, the user_id to change
 * @param image - file, the picture to put into the user's profile
 * @return status, 200 if successful, 400 if not, and data. data=array[object] with the profile_image, string, name of the file
 */
export const updateProfilePicture = async (id: number, image: File): Promise<ApiResponse> => {
    const apiURL = `${root}/users/${id}/profile-picture`;

    const data = { image: image };
    const response = await PUT(apiURL, data);
    if (response.status === 400) {
        console.log('error updating profile picture.');
        return { status: 400, error: 'Error updating profile picture.' };
    }
    console.log('Updated Profile Picture for user.');
    return response;
}

/**
 * Update email for a user
 * @param id = user_id for the profile wishing to change email.
 * @param _email - email to change to
 * @param _confirm_email - secondary entering of email to confirm
 * @param _password - the user's current password.
 * @returns response, 200 if valid, 400 if not, 401 if emails do not match.
 */
export const updateEmail = async (id: number, _email: string, _confirm_email: string, _password: string): Promise<ApiResponse> => {

    if (_email != _confirm_email) {
        console.log('Not the same email, try again.');
        return { status: 401, error: 'Emails do not match' };
    }
    const apiURL = `${root}/users/${id}/email`;
    const data = {
        email: _email,
        confirm: _confirm_email,
        password: _password,
    };

    const response = await PUT(apiURL, data);
    if (response.status === 400) {
        console.log('error updating email.');
        return { status: 400, error: 'Error updating email.' };
    }
    console.log('Updated primary email for user.');

    return response;
}

/**
 * Update username through id.
 * @param id
 * @param _username - username to change to
 * @param _confirm_user - secondary entering of username to confirm
 * @param _password - the user's current password.
 * @returns response, 200 if valid, 400 if not, 401 if users do not match.
 */
export const updateUsername = async (id: number, _username: string, _confirm_user: string, _password: string): Promise<ApiResponse> => {
    if (_username != _confirm_user) {
        console.log('Usernames are not the same.');
        return { status: 401, error: 'Usernames are not the same.' };
    }
    const apiURL = `${root}/users/${id}/username`;
    const data = {
        username: _username,
        confirm_user: _confirm_user,
        password: _password,
    };

    const response = await PUT(apiURL, data);
    if (response.status === 400) {
        console.log('error updating username.');
        return { status: 400, error: 'Error updating username.' };
    }
    console.log('Updated primary username for user.');
    return { status: 400, data: response.data };
}

/**
 * NEEDS TO CHNAGE FOR SHIBBOLETH
 * Update Password for user specified with user_id
 * @param id = int, user id for the user wishing to change
 * @param _newPassword = string, new password
 * @param _password_confirm - string, confirm password to be the same as the new password
 * @param _password - string, user's current password
 * @param _token
 */
export const updatePassword = async (id: number, _newPassword: string, _password_confirm: string, _password: string, _token: string): Promise<ApiResponse> => {
    if (!_newPassword || !_password_confirm) {
        console.log('Missing passwords.');
        return { status: 400, error: 'Missing passwords.' };
    }
    if (_newPassword != _password_confirm) {
        console.log('Password and confirmation are not the same.');
        return { status: 400, error: 'Password and confirmation are not the same.' };
    }
    console.log('Token accepted, email verified.');



    //get email if token is valid
    let url = `${root}/resets/password/${_token}`;
    let authCheck = await GET(url);
    if (!authCheck.data.email) {
        console.log('Your token has expired.');
        return authCheck;
    }
    console.log('Token accepted, email verified.');

    //update user password
    url = `${root}/users/${id}/password`;
    const data = {
    };
    const response = await PUT(url, data);
    if (response.status === 400) {
        console.log('Error putting new password.');
        return { status: 400, error: response.error };
    }

    console.log('User password updated successfully.');
    return { status: 201, data: response.data };

}

/**
 * Updates user visibility, between 0 (private) and 1 (public). just a switch.
 * @param id - user_id for the user
 * @returns 400 if error, 200 if valid
 */
export const updateUserVisibility = async (id: number): Promise<ApiResponse> => {
    let url = `${root}/users/${id}`;
    let userResponse = await GET(url);
    if (userResponse.status !== 200) {
        return RESPONSE(400, 'Unable to fetch user data')
    }

    const vis = userResponse.data.visibility;
    let data: { visibility: number };

    if (vis == 1) {
        data = {
            visibility: 0,
        };
    } else if (vis == 0) {
        data = {
            visibility: 1,
        };
    } else {
        return RESPONSE(400, "Invalid visibility error")
    }
    const result = await editUser(id, data);
    if (result.status === 400) {
        console.log('Error editing user.');
        return { status: 400, error: 'Error editing user.' };
    }
    return RESPONSE(200, null, result.data)
}


/* ACCOUNT INFO/ PASSWORD RESET*/

//getAccountInformation
//requestPasswordReset


/* LOOKUP USER */

//getUserByUsername
//getUserByEmail


/* USER FOLLOWINGS */

//getUserFollowing
//addUserFollowing
//deleteUserFollowing


/* PROJECT FOLLOWINGS/VISIBILITY */

//getVisibleProjects
//updateProjectVisibility
//getProjectFollowing
//addProjectFollowing
//deleteProjectFollowing



export default {
    createNewUser,
    getUsers,
    getUsersById,
    editUser,
    deleteUser,
    userInDatabase,
    updateProfilePicture,
    //getAccountInformation,
    updateEmail,
    updateUsername,
    updatePassword,
    updateUserVisibility,
    // requestPasswordReset,
    // getUserByUsername,
    // getUserByEmail,
    // getUserFollowing,
    // getVisibleProjects,
    // updateProjectVisibility,
    // getProjectFollowing,
    // addProjectFollowing,
    // deleteProjectFollowing,
    // addUserFollowing,
    // deleteUserFollowing,

};

