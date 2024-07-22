import React, { useState, useEffect } from 'react';

//
// Complete profile component
//
const CompleteProfile = ({ show, onNext, onBack, avatarImage }) => {
    // State variables

    // placeholder data
    // will be replaced with actual data from the previous steps
    const info = {
        firstName: 'John',
        lastName: 'Doe',
        username: '@johndoe',
        skills: ['UI/UX', 'Figma', 'JavaScript', 'Photoshop', 'Illustrator'],
    }

    // if the modal is not shown, return null
    if (!show) {
        return null;
    }

    // render the page
    return (
        <div className="signupProcess-modal">
            <div className="CompleteProfile">

                <h1 id="signupProcess-title">Complete Your Profile</h1>
                <p>You can add more and edit later</p>

                <div id="profile-details" >
                    <div className="row">
                        {/* Profile picture container */}
                        <div id="profile-pic">
                            <img src={avatarImage} alt="profile-pic" />
                        </div>

                        <div className="column">
                            <div className="row">
                                <div className="column">
                                    {/* First and Last Name */}
                                    <h2>{info.firstName} {info.lastName} </h2>

                                    {/* Username */}
                                    <p>{info.username}</p>
                                </div>

                                {/* Pronouns */}
                                <input id="pronouns-input" type="text" placeholder="Add Pronouns" />
                            </div>

                            {/* Skills */}
                            <div id="display-skills">
                                {/* {info.skills.map((skill, index) => (
                                    <button key={index} className='skillBtn'>{skill}</button>
                                ))} */}
                            </div>
                        </div>
                    </div>

                    {/* Input Box for Bio */}
                    <textarea id="bio-input" placeholder="Add A Bio"></textarea>

                </div>
                <div className='signupProcess-btns'>
                    <button id="signup-backBtn" onClick={onBack}>
                        Back
                    </button>
                    <button id="signup-nextBtn" onClick={onNext} >
                        Finish
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CompleteProfile;