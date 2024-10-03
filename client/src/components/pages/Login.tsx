import "./pages.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import { handleError, sendPost, hideError } from "../../functions/fetch.js";

const Login = (props) => {
    const navigate = useNavigate(); // Hook for navigation

    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Error message for missing or incorrect information

    // Function to handle the login button click
    const handleLogin = () => {
        //hideError();
        // Check if the email and password are not empty
        if (email === '' || password === '') {
            setError('Please fill in all information');
            //handleError('Username or password is empty!');
        } 

        // Check if the email is a valid email
        // and if it's associated with an account

        // if this is only for RIT students, check that it's an RIT email

        // if the email is valid and associated with an account
        // check if the password is correct

        // if the password is incorrect
        // setError('Incorrect password');

        // if the email is not associated with an account
        // setError('Email not associated with an account');

        // if the email is not a valid email
        // setError('Invalid email');
        
        else {
            // Navigate to the home page
            navigate(paths.routes.HOME);
        }
    };

    // render the login page
    return (
        <div className="background-cover">
            <div className="login-signup-container">
                {/*************************************************************

                    Welcome Directory

                *************************************************************/}
                <div className="directory column">
                    <h1>Welcome!</h1>
                    <p>Don't have an account?</p>
                    <button onClick={() => navigate(paths.routes.SIGNUP)}>Sign Up</button>
                </div>

                {/*************************************************************

                    Login Form inputs

                *************************************************************/}
                <div className="login-form column">
                    <h2>Log In</h2>
                    <div className="login-form-inputs">
                    <div className="error">{error}</div>
                    <span id="errorMessage"></span>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="School Email or Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button id="forgot-password">Forgot Password</button>
                        
                        <div className="mobile-signup">
                            <p>No account? </p>
                            <p id="signup-btn-mobile" onClick={() => navigate(paths.routes.SIGNUP)}>Sign Up</p>
                        </div>
                    </div>
                    <button id="main-loginsignup-btn" onClick={handleLogin}>Log In</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
