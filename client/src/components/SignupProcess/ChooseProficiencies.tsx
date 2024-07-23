import React, { useState, useEffect } from 'react';

// list of proficiencies to choose from
const proficiencies = ["Full Stack Developer", "Front End Developer", "Back End Developer", "UI/UX Designer", "Graphic Designer", "Graphic Artist", "Game Developer", "Game Designer", "Web Designer", "Web Editor", "Product Designer", "Mobile Developer", "Software Developer", "Cloud Developer", "Database Developer", "PHP Developer", "BlockChain Developer", "AR/VR Developer", "IT", "Mentor"];

//
// Choose top 3 proficiencies component
//
const ChooseProficiencies = ({ show, onNext, onBack }) => {
    // State variables
    const [selectedProficiencies, setSelectedProficiencies] = useState<string[]>([]); // State variable for the selected proficiencies

    // Function to handle the proficiency selection
    const handleProficienciesSelect = (proficiency) => {
        // Check if selectedProficiencies has a length of 3
        // if it doesn't, highlight the button by adding the 'active' class, and add the proficiency to the selectedProficiencies array
        if (selectedProficiencies.length < 3) {
            if (!selectedProficiencies.includes(proficiency.target.innerHTML)) {
                proficiency.target.classList.add('active');

                // creating a new array to both update the state and check the length 
                // of selectedProficiencies after the addition of a new proficiency
                const newProficiencies = [...selectedProficiencies, proficiency.target.innerHTML];
                setSelectedProficiencies(newProficiencies);
            }
            // else remove the proficiency from the selectedProficiencies array and remove the 'active' class from the button
            else {
                proficiency.target.classList.remove('active');
                setSelectedProficiencies(selectedProficiencies.filter((prof) => prof !== proficiency.target.innerHTML));
            }
        }
        // if selectedProficiencies has a length of 3
        else {
            // if the proficiency is already selected, remove it from the selectedProficiencies array and remove the 'active' class from the button
            if (selectedProficiencies.includes(proficiency.target.innerHTML)) {
                proficiency.target.classList.remove('active');
                setSelectedProficiencies(selectedProficiencies.filter((prof) => prof !== proficiency.target.innerHTML));
            }
            else {
                return;
            }
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
                <div className="ChooseProficiencies">

                    <h1 id="signupProcess-title">Choose Your Top 3 Proficiencies</h1>
                    <p>You can add more and edit later</p>

                    <div id="proficiency-select">
                        {proficiencies.map((proficiency, index) => (
                            <button key={index} onClick={handleProficienciesSelect} className='proficiencyBtn'>{proficiency}</button>
                        ))}


                    </div>
                    <div id='signupProcess-btns'>
                        <button id="signup-backBtn" onClick={onBack}>
                            Back
                        </button>
                        <button id="signup-nextBtn" onClick={onNext} disabled={selectedProficiencies.length !== 3} >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ChooseProficiencies;