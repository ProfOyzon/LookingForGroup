import "./pages.css";
import "../Styles/styles.css";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as paths from "../../constants/routes";
//import * as fetch from "../../functions/fetch";

const EmailConfirmation = (props) => {
    // THINGS TO DO:
    // Add Page Components (info box stating email is confirmed) x
    // Style page to match Figma (both light and dark modes)
    // Auto redirect to discover page (as well as link to discover page if redirect doesn't work) x
    // Include token in link as (react search parameter or query parameter) and work with database to verify users email (grab token and fetch to /api/signup/[insert token here]) x
    const [responseData, setResponseData] = useState(props.responseData);

    //Gets current location
    const location = useLocation();
    //Gets pathname from current location
    const path = location.pathname;

    // Function that fetches to the server so it can check if the authorization token is correct
    // *NOTE*: Was having issues with this function in particular, kept giving me this error:
    // Uncaught (in promise) SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    // Not entirely sure what is causing it, I searched it up, tried solutions, tried fixes myself, but nothing stopped it
    // Seems to originate from the "await response.json()" line
    // My hypothesis is that it isn't working due to me not having a local database
    // I don't know why this would cause it, but when I tried to fetch projects or users it gave the same error
    const getUserCreationStatusCode = async () => {
        const url = `/api/signup/${path.substring(path.lastIndexOf("/")+1, path.length)}`;

        try {
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const responseJSON = await response.json();

            setResponseData(responseJSON);
        } catch (err) {
            console.error(err);
            setResponseData(undefined);
        }
    }

    // Hook for navigation
    const navigate = useNavigate();

    getUserCreationStatusCode();

    // Sets default h1Text and redirect destination
    let h1Text = "Error Fetching";
    let redirectDest = paths.routes.SIGNUP;

    if(responseData != undefined) {
        // Changes h1Text and redirect destination dependent on the status code returned by server
        switch(responseData.status) {
            case 200:
                h1Text = "Your email has been confirmed!";
                redirectDest = paths.routes.HOME;
                break;
        case 400:
                h1Text = responseData.error;
                break;
        }
    }
    

    // Function to handle redirecting from the current page
    const redirect = () => {
        navigate(redirectDest); // Navigate to the home page
    };

    // Function that calls redirect after 5 seconds
    useEffect(() => {
        //const interval = setInterval(() => {redirect()}, 5000);
        //return () => clearInterval(interval);
    });



    return (
        <div id="email-confirmation-page" className="background-cover">
            <div className="confirmation-container">
                <div className="text-container">
                    <h1 id="confirmation-text">{h1Text}</h1><br></br>
                    <h2 id="auto-redirect-text">You will be automatically redirected soon</h2><br></br>
                    <h3 id="manual-redirect-text">If you are not automatically redirected, click <span id="manual-redirect-link" onClick={() => redirect()}><i>here</i></span></h3>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;