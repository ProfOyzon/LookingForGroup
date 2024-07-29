import React, { useState, useEffect } from 'react';

// list of interests to choose from
// types of projects the user is interested in
const interests = ["Website", "UI/UX", "Video Game", "3D Game", "2D Game", "Mobile App", "Web App", "Animation", "3D Modeling", "Database", "Social Media", "AI", "Machine Learnine", "Cybersecurity", "Virtual Reality", "Augmented Reality", "Small Team", "Medium Team", "Large Team", "Flexible Times", "Beginner Friendly", "Advanced Skills", "Fast-paced", "Casual", "Non-profit", "For-profit", "Local", "Global", "Short-term", "Long-term", "Mentorship"];

//
// Choose at least 3 interests component
//
const ChooseInterests = ({ show, onNext, onBack, selectedInterests, setSelectedInterests }) => {
    // Function to handle the interest selection
    const handleInterestSelect = (interest) => {
        // get the interest that was selected
        const selected = interest.target.innerHTML;

        // if the interest is already selected, remove it from the selectedInterests array
        if (selectedInterests.includes(selected)) {
            setSelectedInterests(selectedInterests.filter((prof) => prof !== selected));
        }
        // else add the skill to the selectedSkills array 
        else {
            setSelectedInterests([...selectedInterests, selected]);
        }
    };

    // if the modal is not shown, return null
    if (!show) {
        return null;
    }

    // render the page
    return (
        <div className="signupProcess-background">
            <div className="signupProcess-modal">
                <div className="ChooseInterests">

                    <h1 id="signupProcess-title">Choose At Least 3 Project Interests</h1>
                    <p>You can add more and edit later</p>

                    <div id="interest-select">
                        {interests.map((interest, index) => (
                            <button
                                key={index}
                                onClick={handleInterestSelect}
                                // add the 'active' class to the buttons that were selected
                                // doing this inside className so that it's remembered when the user goes back and forth between modals
                                className={`interestBtn ${selectedInterests.includes(interest) ? 'active' : ''}`}
                            >{interest}</button>
                        ))}


                    </div>
                    <div id='signupProcess-btns'>
                        <button id="signup-backBtn" onClick={onBack}>
                            Back
                        </button>
                        <button
                            id="signup-nextBtn"
                            onClick={onNext}
                            // disable the next button if the user has not selected at least 3 interests
                            // this is to prevent the user from moving to the next modal without selecting the required number of interests
                            // the user can only move to the next modal when they have selected at least 3 interests
                            disabled={selectedInterests.length < 3}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ChooseInterests;