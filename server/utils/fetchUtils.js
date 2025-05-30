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

//const apiURL = 'lfg.gccis.rit.edu/api/...';

/**
 * Basic GET function for utilities
 * @param {*} apiURL - API to be called, if you are using parameters customize the url
 * @returns response - JSONified data or error code.
 */
function GET(apiURL) {
  return fetch(apiURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then((data) => {
      //console.log(data);
      return data; //returns get with jsonified data
    })
    .catch((error) => {
      console.error('there was a problem with the fetch operation:', error);
      return '400';
    });
}

/**
 * Basic POST function for utilities
 * @param {*} apiURL - API to be called
 * @param {*} newData - Data, mapped: eg {key1: 'value1', key2: 'value2'}
 * @returns response - JSONified data or error code.
 */

function POST(apiURL, newData) {
  return fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      return '400';
    });
}

/**
 * Basic PUT function for utilities
 * @param {*} apiURL - API to be called
 * @param {*} newData - Data, mapped: eg {key1: 'value1', key2: 'value2'}
 * @returns response - JSONified data or error code.
 */
function PUT(apiURL, newData) {
  return fetch(apiURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      return '400';
    });
}

/**
 * Basic DELETE function for utilities
 * @param {*} apiURL - API to be called
 * @returns response - JSONified data or error code.
 */
function DELETE(apiURL) {
  return fetch(apiURL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      return '400';
    });
}

export { GET, POST, PUT, DELETE };
