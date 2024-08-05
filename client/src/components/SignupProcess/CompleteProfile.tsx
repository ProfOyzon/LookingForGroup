import React, { useState, useEffect } from 'react';

//
// Complete profile component
//
const CompleteProfile = ({ show, onNext, onBack, avatarImage, userInfo, bio, pronouns, setBio, setPronouns }) => {
    // make each skill tag a different color
    // matches the colors in the design/background
    const tagColors = ['#9FACFF', '#97E5AB', '#99E6EA', '#F18067', '#239EF7'];

    // set the bio and pronouns when the user types in the input boxes
    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handlePronounsChange = (e) => {
        setPronouns(e.target.value);
    };

    // if the modal is not shown, return null
    if (!show) {
        return null;
    }

    // render the page
    return (
        <div className="signupProcess-background">
            <div className="signupProcess-modal">
                <div className="CompleteProfile">

                    <h1 id="signupProcess-title">Complete Your Profile</h1>
                    <p>You can add more and edit later</p>

                    <div id="profile-details" >
                        <div className="row">
                            {/* Profile picture container */}
                            <div id="profile-pic" style={{ width: 160, height: 160 }}>
                                <img src={avatarImage} alt="profile-pic" />
                            </div>

                            <div className="name-username-pronouns-container">
                                <div className="signup-fullname">
                                    {/* First and Last Name */}
                                    <h2>{userInfo.firstName} {userInfo.lastName} </h2>

                                    {/* Username */}
                                    <p>@{userInfo.username}</p>
                                </div>

                                {/* Pronouns */}
                                <input
                                    id="pronouns-input"
                                    type="text"
                                    autoComplete='off'
                                    placeholder="Add Pronouns"
                                    onChange={handlePronounsChange}
                                    value={pronouns}
                                />
                            </div>
                        </div>

                        {/* Input Box for Bio */}
                        <textarea
                            id="bio-input"
                            autoComplete='off'
                            placeholder="Add A Bio"
                            onChange={handleBioChange}
                            value={bio}
                        ></textarea>

                        {/* Skills */}
                        <div id="signup-profile-skill" >
                            {userInfo.skills.map((skill, index) => (
                                <div key={index} style={{ border: `2px solid ${tagColors[index % 5]}` }} >{skill}</div>
                            ))}
                        </div>

                    </div>
                    <div id='signupProcess-btns'>
                        <button id="signup-backBtn" onClick={onBack}>
                            Back
                        </button>
                        <button id="signup-nextBtn" onClick={onNext} >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompleteProfile;