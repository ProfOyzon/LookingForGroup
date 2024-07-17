import React from "react";
import "./styles.css";

const FooterHomePage = () => {
    return (
        <div className="FooterContainer">
            <div className="FooterTitle">
            <h1>Looking For Group </h1>
            <h2>Create Connect Something</h2>
            <button className="navBarButtons">
            Sign Up
            </button>
            </div>

            <div className="FooterList">
            <ul>
            <li>Projects</li>
            <li>Developers</li>
            <li>Designers</li>
            <li>Mentors</li>
            </ul>
            
            </div>
        </div>
    )
}

export default FooterHomePage