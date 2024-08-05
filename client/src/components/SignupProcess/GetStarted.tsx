import React, { useState, useEffect } from 'react';

//
// Get Started component
// choose to start a new project or join an existing project
//
const GetStarted = ({ show, onBack, onCreateProject, onJoinProject }) => {

    // if the modal is not shown, return null
    if (!show) {
        return null;
    }

    // render the page
    return (
        <div className="signupProcess-background">
            <div className="signupProcess-modal">
                <div className="GetStarted">
                    <h1 id="signupProcess-title">Let's Get Started</h1>
                    <p>Choose one</p>

                    <div id="getStarted-select">
                        <button id="new-project-btn" onClick={onCreateProject}>
                            Create Project
                            <img src="images/icons/nav/projects.png" alt="folder" />
                        </button>
                        <button id="join-project-btn" onClick={onJoinProject}>
                            Join Project
                            <img src="images/icons/nav/discover.png" alt="compass" />
                        </button>
                    </div>

                    <div id='signupProcess-btns'>
                        <button id="signup-backBtn" onClick={onBack}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetStarted;