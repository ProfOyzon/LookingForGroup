import React from 'react';
import '../Css/style.css';
import imagePassword from '../img/passwordLock.png';

const ForgotPassword = () => {
    return (
        <div className="flexColumn10">

            <div className="flexRow13">
                <img src={imagePassword} width="64" height="64" alt="LockPassword Icon" />
            </div>

            <div className = "flexRow14">
            <h1>Forgot Password?</h1>
            <h2>Enter your Email address to get the </h2>
            </div>

        </div>
    )
}

export default ForgotPassword;