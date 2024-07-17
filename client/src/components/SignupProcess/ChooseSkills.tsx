import React, { useState, useEffect } from 'react';
// import './styles.css';

// list of skills to choose from
const skills = ["UI/UX", "Figma", "JavaScript", "Photoshop", "Illustrator", "HTML", "CSS", "Java", "React", "Web Development", "Game Development", "Graphic Design", "Machine Learning", "Artificial Intelligence", "Cybersecurity", "Virtual Reality", "Augmented Reality", "Game Design", "Front End", "Back End", "Design"];

//
// Choose top 5 skills component
//
const ChooseSkills = ({ show, onNext, onBack }) => {
    // State variables
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // State variable for the selected skills

    // Function to handle the skill selection
    const handleSkillSelect = (skill) => {  
        // Check if the skill is already selected
        if (selectedSkills.includes(skill)) {
            // Remove the skill from the selected skills
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            // Check if the user has already selected 5 skills
            if (selectedSkills.length < 5) {
                // Add the skill to the selected skills
                setSelectedSkills([...selectedSkills, skill]);
            }
        }
    };

    // if the modal is not shown, return null
    if (!show) {
        return null;
    }

    // render the page
    return (
        <div className="signupProcess-modal">
            <div className="ChooseSkills">

                <h1 id="signupProcess-title">Choose Your Top 5 Skills</h1>
                <p>You can add more and edit later</p>

                <div id="skill-select">
                    {skills.map((skill, index) => (
                        <button key={index} onClick={handleSkillSelect} >{skill}</button>
                    ))}

                    
                </div>
                <div className='signupProcess-btns'>
                        <button id="signup-backBtn" onClick={onBack}>
                            Back
                        </button>
                        <button id="signup-nextBtn" onClick={onNext}>
                            Next
                        </button>
                    </div>

            </div>
        </div>
    );
}

export default ChooseSkills;