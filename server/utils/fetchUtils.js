/* 
/\/\/\/\/\/\/\/\/\/\/\//\/\/\/\/\/\/\/\
General Fetch API for GET requests

Define apiURL

Make a request
fetch(apiURL)
    .then(response => {
        if (!response.ok) {
            throw a new error
        }
        return response.json();
    }).then(data => {
        you have data
    }).catch(error => {
        console error
    });
/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\
\/\/\/\/\/\/\\\//\/\\/\\\\/\\/\/\/\\/\\/
General Fetch API for POST/PUT/DELETE requests
apiURL
data {};

request options {
    method: post/put/delete
    headers: {
        Content-Type: application/json
    },
    body: JSON.stringify(data),
};

fetch(apiurl, requestOptions)
.then(response)
error catch
return response
send data
catch error

/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

Base apiURL is:
*/

//const apiURL = '';


/**
 * Basic GET function for utilities
 * @param {*} apiURL - API to be called
 * @param {*} newData - Data, mapped: eg {key1: 'value1', key2: 'value2'}
 * @returns response - JSONified data or error code.
 */
function GET(apiURL, newData) {


    fetch(apiURL)
        .then( response => {
            if( response.ok ) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then( data => {
            console.log(data); 
            return data; //returns get with jsonified data
        })
        .catch( error => {
            console.error('there was a problem with the fetch operation:',error);
            return "400";
        })
}

