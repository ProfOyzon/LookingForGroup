import React from 'react';
import '../Css/Button.css';

const Button = () =>{
    return(
        <button className="buttonOne" type="button" onClick={() => window.location.href = '/Login'}>Login</button>
    )
}

export default Button