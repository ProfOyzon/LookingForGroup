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
 * @param {string} apiURL - API to be called, if you are using parameters customize the url
 * @returns response - JSONified data or error code.
 */
const GET = (apiURL) => {
  return fetch(apiURL, {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || '';

      //check if response is JSON
      if (contentType.includes('application/json')) {
        try {
          //return if json
          let obj = await response.json();
          if (response.ok) {
            return obj;
          } else {
            console.log(obj.error);
            return { status: response.status, error: obj.error || 'Network response was not ok' };
            //throw new Error('Network response was not ok');
          }
        } catch (error) {
          console.error('Problem parsing JSON', error);
          return { status: 400, error: 'Invalid JSON repsponse' };
        }
      } else {
        //handle HTML error pages
        const e = await response.text();
        console.error('Expected json but got:', e);
        return {
          status: 400,
          error: 'Received HTML reponse instead of JSON (Likely broken endpoint)',
        };
      }
    })
    .then((data) => {
      //console.log(data);
      return data; //returns get with jsonified data
    })
    .catch((error) => {
      console.error('there was a problem with the fetch operation:', error);
      return { status: 400, error: error.message || 'Unknown error' };
    });
};

/**
 * Basic POST function for utilities
 * @param {string} apiURL - API to be called
 * @param {Object} newData - Data, mapped: eg {key1: 'value1', key2: 'value2'}
 * @returns response - JSONified data or error code.
 */
const POST = (apiURL, newData) => {
  return fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(newData),
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || '';

      //check if response is JSON
      if (contentType.includes('application/json')) {
        try {
          //return if json
          let obj = await response.json();
          if (response.ok) {
            return obj;
          } else {
            console.log(obj.error);
            return { status: response.status, error: obj.error || 'Network response was not ok' };
          }
        } catch (error) {
          console.error('Problem parsing JSON', error);
          return { status: 400, error: 'Invalid JSON repsponse' };
        }
      } else {
        //handle HTML error pages
        const e = await response.text();
        console.error('Expected json but got:', e);
        return {
          status: 400,
          error: 'Received HTML reponse instead of JSON (Likely broken endpoint)',
        };
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      return { status: 400, error: error.message || 'Unknown error' };
    });
};

/**
 * Basic PUT function for utilities
 * @param {string} apiURL - API to be called
 * @param {Object} newData - Data, mapped: eg {key1: 'value1', key2: 'value2'}
 * @returns response - JSONified data or error code.
 */
const PUT = (apiURL, newData) => {
  return fetch(apiURL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(newData),
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || '';

      //check if response is JSON
      if (contentType.includes('application/json')) {
        try {
          let obj = await response.json();
          //return if json
          if (response.ok) {
            return obj;
          } else {
            console.log(obj.error);
            return { status: response.status, error: obj.error || 'Network response was not ok' };
          }
        } catch (error) {
          console.error('Problem parsing JSON', error);
          return { status: 400, error: 'Invalid JSON repsponse' };
        }
      } else {
        //handle HTML error pages
        const e = await response.text();
        console.error('Expected json but got:', e);
        return {
          status: 400,
          error: 'Received HTML reponse instead of JSON (Likely broken endpoint)',
        };
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      return { status: 400, error: error.message || 'Unknown error' };
    });
};

// async function PUT2(apiURL, newData) {
//   try {
//     const response = await fetch(apiURL, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newData),
//     });
//     return await response.json();
//   } catch (error) {
//     console.error('Caught inside PUT:', error);
//     throw error; // Let the caller deal with it
//   }
// }

/**
 * Basic DELETE function for utilities
 * @param {string} apiURL - API to be called
 * @returns response - JSONified data or error code.
 */
const DELETE = (apiURL) => {
  return fetch(apiURL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || '';

      //check if response is JSON
      if (contentType.includes('application/json')) {
        try {
          //return if json
          let obj = await response.json();
          if (response.ok) {
            return obj;
          } else {
            console.log(obj.error);
            return { status: response.status, error: obj.error || 'Network response was not ok' };
          }
        } catch (error) {
          console.error('Problem parsing JSON', error);
          return { status: 400, error: 'Invalid JSON repsponse' };
        }
      } else {
        //handle HTML error pages
        const e = await response.text();
        console.error('Expected json but got:', e);
        return {
          status: 400,
          error: 'Received HTML reponse instead of JSON (Likely broken endpoint)',
        };
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      return { status: 400, error: error.message || 'Unknown error' };
    });
};

/**
 * Takes data and puts it into a standardized JSON reponse
 * @param {any} data - Data to return
 * @param {number} status - HTTP status code
 * @param {string|null} error - Error message
 * @param {string} mimetype - type of the response
 * @returns - object of JSON response
 */
function jsonify(data, status, error, mimetype = 'application/json') {
  return {
    status,
    mimetype,
    data,
    error,
  };
}

/**
 * Standardized JSON response for functions
 * @param {number} _status - HTTP status code
 * @param {any} data  - Data to return
 * @param {any} _error - Error message (if needed)
 * @returns - JSONified status code, data, and error message
 */
const RESPONSE = (_status, data = null, _error = 'none') => {
  const res = [{ data: data }];
  return jsonify(res, _status, _error, 'application/json');
};

export { GET, POST, PUT, DELETE, RESPONSE };
