import React, { useState, useEffect } from 'react';


// list of interests to choose from
const interests = ["Website", "UI/UX", "Video Game", "3D Game", "2D Game", "Mobile App", "Web App", "Animation", "3D Modeling", "Database", "Social Media"];

//
// Choose at least 3 interests component
//
const ChooseInterests = ({ show, onNext, onBack }) => {
    // State variables
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // State variable for the selected interests

    // Function to handle the interest selection
    const handleInterestSelect = (interest) => {

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
                            <button key={index} onClick={handleInterestSelect} className='interestBtn'>{interest}</button>
                        ))}


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

export default ChooseInterests;