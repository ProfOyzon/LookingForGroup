import '../Styles/pages.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as paths from "../../constants/routes";
import { handleError, sendPost, sendGet, hideError } from "../../functions/fetch.js";

const ResetPassword = ({ theme }) => {
    const navigate = useNavigate(); // Hook for navigation
    const location = useLocation(); 

    // State variables
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmInput, setConfirmInput] = useState('');
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

    // Function to handle the Set button click
    const handleResetPassword = async () => {

        // Check if the loginInput and password are not empty
        if (passwordInput === '' || confirmInput === '') {
            setError('Please fill in all information');
            return;
        }

        // Check if the passwords match
        else if(passwordInput !== confirmInput){
            setError('The passwords do not match');
            return;
        }
        else {
            // Success message
            setError('Updating password...');
            // Login for the user
            const path = location.pathname;
            const token = path.substring(path.lastIndexOf("/")+1, path.length);
            const data = { password: passwordInput, confirm: confirmInput };
            console.log(data);
            const response = await sendPost(`/api/resets/password/${token}`, data);
            if (response.error) {
                setError(response.error);
            }
            else {
                // Success message
                setError('Logging in');
            }

            // Navigate to the home page
            // navigate(paths.routes.HOME);
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
                        type="password"
                        placeholder="New password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                    />
                    <button id="forgot-password" onClick={handleBackToLogin}>Back to Login</button>
                </div>
                <button id="main-loginsignup-btn" onClick={handleResetPassword}>Set</button>
            </div>
        </div>
    );
};

export default ResetPassword;
