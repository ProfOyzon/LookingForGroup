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
    /*const getUserCreationStatusCode = async () => {
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
            return;
        } catch (err) {
            console.error(err);
            setResponseData(undefined);
        }
    }*/

    useEffect(() => {
        const getUserCreationStatus = async () => {
            const url = `/api/signup/${path.substring(path.lastIndexOf("/")+1, path.length)}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(`Status: ${data.status}`);
                if(data.error) {
                console.log(`Error: ${data.error}`);
                }
                setResponseData(data);
            } catch(err) {
                console.error(err)
            }
        };
        getUserCreationStatus();
    }, [props.reloadResponseData]);

    // Hook for navigation
    const navigate = useNavigate();

    //getUserCreationStatusCode();

    // Sets default h1Text and redirect destination
    let h1Text = "Error Fetching";

    if(responseData != undefined) {
        // Changes h1Text and redirect destination dependent on the status code returned by server
        switch(responseData.status) {
            case 200:
                h1Text = "Your LFG account has been activated!";
                break;
            case 400:
                h1Text = responseData.error;
                break;
        }
    }
    

    // Function to handle redirecting from the current page
    const redirect = () => {
        navigate(paths.routes.HOME); // Navigate to the home page
    };

    // Function that calls redirect after 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {redirect()}, 5000);
        return () => clearInterval(interval);
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