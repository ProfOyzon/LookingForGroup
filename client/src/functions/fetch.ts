/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message: string) => {
  console.log('Error: ', message);
  // const errorElement = document.querySelector('.error');
  // errorElement.textContent = message;
  // errorElement.classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
    entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url: string, data?: {}, handler?: Function): Promise<void> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  await responseHandler(response, handler);
};

/* Sends a PUT request to the server using fetch, converting the body into FormData,
    making it suitable for file data transfer.
    MUST BE CONTAINED in a <form> element, using the encType="multipart/form-data"
*/

const sendFile = async (url: string, data: {}, handler?: Function) => {
  const response = await fetch(url, {
    method: 'PUT',
    body: new FormData(data),
  });
  await responseHandler(response, handler);
};

/* Sends put requests to the server using fetch. Will look for various
    entries in the response JSON object, and will handle them appropriately.
*/
const sendPut = async (url: string, data?: FormData, handler?: Function): Promise<void> => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  await responseHandler(response, handler);
};

const sendDelete = async (url: string, handler?: Function) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  await responseHandler(response, handler);
}

const responseHandler = async (
  response: Response,
  handler?: Function
): Promise<string | void> => {
  const result = await response.json();
  //document.getElementById('errorMessage').classList.add('hidden');
  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
    return result.error;
  }

  if (handler) {
    handler(result);
  }
};

const sendGet = async (url: string, handler?: Function): Promise<void> => {
  console.log(`URL: ${url}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  document.querySelector('error')?.classList.add('hidden');
  console.log(result);

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

// removed errorMessage element from login and signup pages
const hideError = () => {
  document.getElementById('errorMessage')?.classList.add('hidden');
};

const POST = async (url: string, data: FetchData): Promise<any> => {
  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  } catch (err) {
    console.log(err);
  }
};

const GET = async (url: string): Promise<any> => {
  try {
    return await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  } catch (err) {
    console.log(err);
  }
};

const fetchUserID = async (): Promise<any> => {
  const response = await fetch('/api/auth');
  const { data } = await response.json();
  return data;
};

export { 
  POST, GET, 
  handleError, 
  sendGet, 
  sendPost, 
  sendPut, 
  sendFile, 
  sendDelete,
  hideError, 
  fetchUserID, 
};
