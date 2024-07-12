import "./pages.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";

const Signup = (props) => {
    const navigate = useNavigate(); // Hook for navigation

    // State variables
    const [firstName, setFirstName] = useState(''); // State variable for the user's first name
    const [lastName, setLastName] = useState(''); // State variable for the user's last
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle the login button click
    const handleSignup = () => {
        // Check if the email and password are not empty
        if (email === '' || password === '' || firstName === '' || lastName === '' || username === '') {
            setError('Please fill in all information');
        } else {
            // check if email is valid

            // check if username is unique (??? depends on if we want unique usernames)

            // check if the passwords match
            if (password !== checkPassword) {
                setError('Passwords do not match');
            } else {
                // Navigate to the home page
                navigate(paths.routes.HOME);
            }
        }
    };

    return (
        <div className="background-cover">
            <div className="login-signup-container">
                <div className="directory column">
                    <h1>Welcome!</h1>
                    <h4>Already have an account?</h4>
                    <button onClick={() => navigate(paths.routes.LOGIN)}>Log In</button>
                </div>
                <div className="signup-form column">
                    <h2>Sign Up</h2>

                    <div className="error">{error}</div>
                    <div className="row">
                        <input
                            className="signup-name-input"
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            className="signup-name-input"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <input
                        className="signup-input"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="signup-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="signup-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="signup-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={checkPassword}
                        onChange={(e) => setCheckPassword(e.target.value)}
                    />
                    <button onClick={handleSignup}>Sign Up</button>

                </div>
            </div>
        </div>
    );
};

export default Signup;
