import "./pages.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import { handleError, sendPost, sendGet, hideError } from "../../functions/fetch.js";

const ResetPassword = ({ theme }) => {
    const navigate = useNavigate(); // Hook for navigation

    // State variables
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
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
        if (loginInput === '' || password === '') {
            setError('Please fill in all information');
        }

        // if the email is valid and associated with an account
        // check if the password is correct

        // if the password is incorrect
        // setError('Incorrect password');

        // if the email is not associated with an account
        // setError('Email not associated with an account');

        // if the email is not a valid email
        // setError('Invalid email');

        else {

            // sendPost('/api/login', { loginInput, password });

            // Navigate to the home page
            navigate(paths.routes.HOME);
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
            <div className="login-form column">
                <h2>Set new password</h2>
                <div className="login-form-inputs">
                    <div className="error">{error}</div>
                    <span id="errorMessage"></span>
                    <input
                        className="login-input"
                        type="text"
                        placeholder="Username or e-mail"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button id="forgot-password" onClick={handleBackToLogin}>Back to Login</button>
                </div>
                <button id="main-loginsignup-btn" onClick={handleLogin}>Set</button>
            </div>
        </div>
    );
};

export default ResetPassword;
