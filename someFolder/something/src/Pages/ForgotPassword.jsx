import React from 'react';
import '../Css/style.css';
import imagePassword from '../img/passwordLock';

const ForgotPassword = () =>{
    return(
    <div className ="flexColumn10">
    
    <div className="flexRow13">
    <img src={imagePassword} width="64" height="64" alt="LockPassword Icon" />
    </div>

    </div>
    )
}

export default ForgotPassword;