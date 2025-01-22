import '../Styles/pages.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from '../../constants/routes';
import { sendPost, sendGet } from '../../functions/fetch.js';
import { ThemeIcon } from '../ThemeIcon';

const Login = ({}) => {
  const navigate = useNavigate(); // Hook for navigation

  // State variables
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error message for missing or incorrect information

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
      } else {
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
  };

  // Function to handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // render the login page
  return (
    <div className="background-cover">
      <div className="login-signup-container" onKeyDown={handleKeyPress}>
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
            <button id="forgot-password" onClick={handleForgotPass}>
              Forgot Password
            </button>

            <div className="mobile-signup">
              <p>No account? </p>
              <p id="signup-btn-mobile" onClick={() => navigate(paths.routes.SIGNUP)}>
                Sign Up
              </p>
            </div>
          </div>
          <button id="main-loginsignup-btn" onClick={handleLogin}>
            Log In
          </button>
        </div>
        {/*************************************************************

                    Welcome Directory

                *************************************************************/}
        <div className="directory column">
          {/* <h1>Welcome!</h1>
                    <p>Don't have an account?</p> */}
          <ThemeIcon
            light={'assets/bannerImages/login_light.png'}
            dark={'assets/bannerImages/login_dark.png'}
          />
          <button onClick={() => navigate(paths.routes.SIGNUP)}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
