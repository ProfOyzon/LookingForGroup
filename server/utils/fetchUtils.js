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
General Fetch API for POST/PUT requests
apiURL
data {};

request options {
    method: post
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

