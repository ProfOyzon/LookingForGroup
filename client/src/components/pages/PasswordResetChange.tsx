import "./pages.css";
import "../Styles/styles.css";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as paths from "../../constants/routes";
//import * as fetch from "../../functions/fetch";

const PasswordReset = (props) => {
    //State variables
    const [password, setPassword] = useState(''); // Variable for entered password
    const [confirm, setConfirm] = useState(''); // Variable for re-entered password
    const [message, setMessage] = useState(''); // Variable for any necessary messages
    const [responseData, setResponseData] = useState(props.responseData); // Variable for returned response

    // Location used for retrieving url path
    // Used for getting token to attach to fetch url
    const location = useLocation();
    const path = location.pathname;

    // Navigate used for redirection
    const navigate = useNavigate();

    // SendNewPass Function - constructs the url and sends a post request
    // To the server containing the password and confirmation password
    // Awaits the returned data and sets it
    const sendNewPass = () => {
        useEffect(() => {
            const postPass = async () => {
                const url = `/api/resets/password/${path.substring(path.lastIndexOf("/")+1, path.length)}`;

                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            password: password,
                            confirm: confirm,
                        }),
                    });
                    const data = await response.json();
                    setResponseData(data);
                } catch(err) {
                    console.error(err);
                }
            };
            postPass();
        }, [props.reloadResponseData]);
    };

    // HandleSubmit Function, called from pressing submit button
    // Checks if passwords are both valid
    const handleSubmit = () => {
        if (password === '' || confirm === '') {
            setMessage('Please fill in all information');
            return false;
        } else if (password !== confirm) {
            setMessage('Passwords do not match');
            return false;
        }

        sendNewPass();
    };

    // onChange Function for responseData
    // When responseData gets changed by what is returned from the server
    // Sets h1Text according to the returned status code
    // Creates redirect function that redirects to login page and calls it after 5 seconds
    // returns div containing message to the user
    responseData.onChange(() => {
        let h1Text = "Error Fetching";

        if(responseData != undefined) {
            switch(responseData.status) {
                case 201:
                    h1Text = "Your password has been reset!";
                    break;
                case 400:
                    h1Text = responseData.error;
                    break;
            }
        }

        const redirect = () => {
            navigate(paths.routes.LOGIN);
        };

        useEffect(() => {
            const interval = setInterval(() => {redirect()}, 5000);
            return () => clearInterval(interval);
        });    

        return (
            <div className="background-cover">
                <div className="confirmation-container">
                    <div className="text-container">
                        <h1 id="confirmation-text">{h1Text}</h1><br></br>
                        <h2 id="auto-redirect-text">You will be automatically redirected in 5s</h2><br></br>
                        <h3 id="manual-redirect-text">If you are not automatically redirected, click <span id="manual-redirect-link" onClick={() => redirect()}><i>here</i></span></h3>
                    </div>
                </div>
            </div>
        );
    })

    return (
        <div className="background-cover">
            <div className="pass-reset-container">
                <div className="pass-reset-form-inputs">
                    <div className="error">{message}</div>
                    <input
                        className="signup-input"
                        autoComplete="off"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="signup-input"
                        autoComplete="off"
                        type="password"
                        placeholder="Re-enter Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </div>

                <button id="main-loginsignup-btn" onClick={handleSubmit}>Reset Password</button>
            </div>
        </div>
    );
};

export default PasswordReset;