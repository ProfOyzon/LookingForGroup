import "./pages.css";
import "../Styles/styles.css";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as paths from "../../constants/routes";
import * as fetch from "../../functions/fetch";

const EmailConfirmation = (props) => {
    // THINGS TO DO:
    // Add Page Components (info box stating email is confirmed) x
    // Style page to match Figma (both light and dark modes)
    // Auto redirect to discover page (as well as link to discover page if redirect doesn't work) x
    // Include token in link as (react search parameter or query parameter) and work with database to verify users email (grab token and fetch to /api/signup/[insert token here]) x

    //Gets current location
    const location = useLocation();
    //Gets pathname from current location
    const path = location.pathname;

    //Retrieves the token from the path using substring
    //Sends a get request to server to "/api/signup/[token]"
    fetch.sendGet(`/api/signup/'${path.substring(path.lastIndexOf("/")+1, path.length)}`);

    // Hook for navigation
    const navigate = useNavigate();

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
                    <h1 id="confirmation-text">Your email has been confirmed!</h1><br></br>
                    <h2 id="auto-redirect-text">You will be automatically redirected soon</h2><br></br>
                    <h3 id="manual-redirect-text">If you are not automatically redirected, click <span id="manual-redirect-link" onClick={() => redirect()}><i>here</i></span></h3>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;