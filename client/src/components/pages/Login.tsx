import "./pages.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import { sendPost, sendGet } from "../../functions/fetch.js";

const Login = ({ theme }) => {
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
    const handleLogin = async () => {

        // Check if the loginInput and password are not empty
        if (loginInput === '' || password === '') {
            setError('Please fill in all information');
            return;
        }

        // Check if the login credentials are associated with an account
        // search input as email
        if (loginInput.includes('@') && loginInput.includes('.')) {
            try {   
                const response = await fetch(`/api/users/search-email/${loginInput}`);
                const data = await response.json();
                if (data) {
                    // try login
                    try {
                        const response = await sendPost('/api/login', { loginInput, password });
                        
                        const data = await response.json();
                        if (data.error) {
                            setError(data.error);
                            return false;
                        }
                    } catch (err) {
                        setError('An error occurred during login');
                        console.log(err);
                        return false;
                    }
                }
            } catch (err) {
                setError('An error occurred during login');
                console.log(err);
                return false;
            }
        }
        // search input as username
        try {
            const response = await fetch(`/api/users/search-username/${loginInput}`);
            const data = await response.json();
            if (data) {
                // try login
                try {
                    const response = await sendPost('/api/login', { loginInput, password });
                    setError(response);
                } catch (err) {
                    setError('An error occurred during login');
                    console.log(err);
                    return false;
                }
            }
        } catch (err) {
            setError('An error occurred during login');
            console.log(err);
            return false;
        }

        // no errors, send login request
        try {
            // Success message
            setError('Trying to log in');
            const response = await sendPost('/api/login', { loginInput, password });
            if (response.error) {
                setError(response.error);
            }
            else {
                // Success message
                setError('Logging in');
            }
        } catch (err) {
            setError('An error occurred during login');
            console.log(err);
            return false;
        }
    };

    // Function to handle the forgot pass button click
    const handleForgotPass = () => {
        // remove error message
        setError('');
        // Navigate to the Forgot Password Page
        navigate(paths.routes.FORGOTPASSWORD);
    }

    // render the login page
    return (
        <div className="background-cover">
            <div className="login-signup-container">
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
                        <button id="forgot-password" onClick={handleForgotPass}>Forgot Password</button>

                        <div className="mobile-signup">
                            <p>No account? </p>
                            <p id="signup-btn-mobile" onClick={() => navigate(paths.routes.SIGNUP)}>Sign Up</p>
                        </div>
                    </div>
                    <button id="main-loginsignup-btn" onClick={handleLogin}>Log In</button>
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

export default Login;
