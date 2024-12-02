import "./pages.css";
import "../Styles/styles.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";

const EmailConfirmation = (props) => {
    // THINGS TO DO:
    // Add Page Components (info box stating email is confirmed)
    // Style page to match Figma (both light and dark modes)
    // Have countdown to redirect to discover page (as well as link to discover page if redirect doesn't work)
    // Include code in link as query parameter and work with database to verify users email

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
        <div id="email-confirmation-page">
            <div id="confirmation-text-box">
                Your email has been confirmed!
                You will be automatically redirected soon
                If you are not automatically redirected, click <span id="manual-redirect-link" onClick={() => redirect()}>here</span>
            </div>
        </div>
    );
};

export default EmailConfirmation;