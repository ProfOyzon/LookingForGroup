import "./pages.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import { handleError, sendPost, sendGet, hideError } from "../../functions/fetch.js";

const ForgotPassword = ({ theme }) => {
    const navigate = useNavigate(); // Hook for navigation

    // State variables
    const [loginInput, setLoginInput] = useState('');
    const [error, setError] = useState(''); // Error message for missing or incorrect information

    // check theme and set the theme icon
    useEffect(() => {
        const themeIcon = document.getElementsByClassName('theme-icon');
        for (let i = 0; i < themeIcon.length; i++) {
            const icon = themeIcon[i] as HTMLImageElement;
            const src = themeIcon[i].getAttribute('src-' + theme) || 'default-' + theme + '-src.png';
            icon.src = src;
        }
    }, [theme]);

    // Function to handle the login button click
    const handleLogin = () => {
        
        // Check if the loginInput and password are not empty
        if (loginInput === '') {
            setError('Please fill in all information');
        }

        // if the email is valid and associated with an account
        // check if the password is correct

        // if the email is not associated with an account
        // setError('Email not associated with an account');

        // if the email is not a valid email
        // setError('Invalid email');

        else {

            // sendPost('/api/login', { loginInput });

            // Navigate to the Reset Password page
            navigate(paths.routes.RESETPASSWORD);
        }
    };

    // Function to handle the forgot pass button click
    const handleBackToLogin = () => {
        // Navigate to the Forgot Password Page
        navigate(paths.routes.LOGIN);
    }

    // render the login page
    return (
        <div className="background-cover">
            <div className="login-signup-container">
                {/*************************************************************

                    Forgot Password Form inputs

                *************************************************************/}
                <div className="login-form column">
                    <h2>Forgot password?</h2>
                    <p>No worries! We'll send you reset instructions.</p>
                    <div className="login-form-inputs">
                        <div className="error">{error}</div>
                        <span id="errorMessage"></span>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Enter your e-mail"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                        />
                        
                        <button id="forgot-password" onClick={handleBackToLogin}>Back to Login</button>

                        {/* TODO: Not sure what to do here for mobile */}
                        <div className="mobile-signup">
                            <p>No account? </p>
                            <p id="signup-btn-mobile" onClick={() => navigate(paths.routes.SIGNUP)}>Sign Up</p>
                        </div>
                    </div>
                    <button id="main-loginsignup-btn" onClick={handleLogin}>Send</button>
                </div>
                {/*************************************************************

                    Welcome Directory

                *************************************************************/}
                <div className="directory column">
                    {/* <h1>Welcome!</h1>
                    <p>Don't have an account?</p> */}
                    <img src="assets/bannerImages/login_dark.png"
                        src-light="assets/bannerImages/login_light.png"
                        src-dark="assets/bannerImages/login_dark.png"
                        alt=""
                        className="theme-icon" />
                    <button onClick={() => navigate(paths.routes.SIGNUP)}>Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
