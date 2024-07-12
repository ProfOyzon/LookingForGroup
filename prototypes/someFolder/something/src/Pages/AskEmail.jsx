import React from 'react';
import '../Css/style.css';
import imagePassword from '../img/passwordLock.png';

const AskEmail = () =>{
    return(
        <div className='centerContent'>
        <div className="flexColumn10">

            <div className="flexRow13">
                <img src={imagePassword} width="64" height="64" alt="LockPassword Icon" />
            </div>

            <div className="flexRow14">
                <h1>Forgot Password?</h1>
                <p>Enter your email address to receive reset instructions</p>

            </div>

            <div className='flexRowEmail'>
                <input type="text" id="username email" name="username" placeholder="Email" /><br/>
            </div>

            <div className=''>
            
            </div>
        </div>
    </div>
    )
}

export default AskEmail;