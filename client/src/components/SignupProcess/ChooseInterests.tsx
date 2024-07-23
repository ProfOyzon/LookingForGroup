import React, { useState, useEffect } from 'react';


// list of interests to choose from
// types of projects the user is interested in
const interests = ["Website", "UI/UX", "Video Game", "3D Game", "2D Game", "Mobile App", "Web App", "Animation", "3D Modeling", "Database", "Social Media", "AI", "Machine Learnine", "Cybersecurity", "Virtual Reality", "Augmented Reality", "Small Team", "Medium Team", "Large Team", "Flexible Times", "Beginner Friendly", "Advanced Skills", "Fast-paced", "Casual", "Non-profit", "For-profit", "Local", "Global", "Short-term", "Long-term", "Mentorship"];

//
// Choose at least 3 interests component
//
const ChooseInterests = ({ show, onNext, onBack }) => {
    // State variables
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // State variable for the selected interests

    // Function to handle the interest selection
    const handleInterestSelect = (interest) => {
        // check if the interest is already selected
        // if it is, remove it from the selectedInterests array and remove the 'active' class from the button
        if (selectedInterests.includes(interest.target.innerHTML)) {
            interest.target.classList.remove('active');
            setSelectedInterests(selectedInterests.filter((prof) => prof !== interest.target.innerHTML));
        }
        // else add the interest to the selectedInterests array and highlight the button by adding the 'active' class
        else {
            interest.target.classList.add('active');
            const newInterests = [...selectedInterests, interest.target.innerHTML];
            setSelectedInterests(newInterests);
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
                            <button key={index} onClick={handleInterestSelect} className='interestBtn'>{interest}</button>
                        ))}


                    </div>
                    <div id='signupProcess-btns'>
                        <button id="signup-backBtn" onClick={onBack}>
                            Back
                        </button>
                        <button id="signup-nextBtn" onClick={onNext} disabled={selectedInterests.length < 3} >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ChooseInterests;