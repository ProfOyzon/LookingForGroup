/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').classList.remove('hidden');
    //document.getElementById('bitMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
    entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    //document.getElementById('bitMessage').classList.add('hidden');
    //document.getElementById('errorMessage').classList.add('hidden');
    console.log(result);

    if(result.redirect) {
        window.location = result.redirect;
    }

    if(result.error) {
        handleError(result.error);
    }

    if(handler) {
        handler(result);
    }
};

const hideError = () => {
    document.getElementById('errorMessage').classList.add('hidden');
};

const POST = async (url, data) => {
    try {
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
}

const GET = async (url) => {
    try {
        return await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                return data;
            });
    } catch (err) {
        console.log(err);
    }
}

export { POST, GET, handleError, sendPost, hideError };