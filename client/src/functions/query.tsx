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

export { POST, GET };