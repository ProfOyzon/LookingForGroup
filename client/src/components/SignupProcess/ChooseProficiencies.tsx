import React, { useState, useEffect } from 'react';

// list of proficiencies to choose from
const proficiencies = ["Full Stack Developer", "Front End Developer", "Back End Developer", "UI/UX Designer", "Graphic Designer", "Game Developer", "Game Designer", "Web Designer", "Product Designer", "Mobile Developer"];

//
// Choose top 3 proficiencies component
//
const ChooseProficiencies = ({ show, onNext, onBack }) => {
    // State variables
    const [selectedProficiencies, setSelectedProficiencies] = useState<string[]>([]); // State variable for the selected proficiencies

    // Function to handle the proficiency selection
    const handleProficienciesSelect = (proficiency) => {


    };

    // if the modal is not shown, return null
    if (!show) {
        return null;
    }

    // render the page
    return (
        <div className="signupProcess-modal">
            <div className="ChooseProficiencies">

                <h1 id="signupProcess-title">Choose Your Top 3 Proficiencies</h1>
                <p>You can add more and edit later</p>

                <div id="proficiency-select">
                    {proficiencies.map((proficiency, index) => (
                        <button key={index} onClick={handleProficienciesSelect} className='proficiencyBtn'>{proficiency}</button>
                    ))}


                </div>
                <div className='signupProcess-btns'>
                    <button id="signup-backBtn" onClick={onBack}>
                        Back
                    </button>
                    <button id="signup-nextBtn" onClick={onNext} >
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ChooseProficiencies;