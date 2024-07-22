import React, { useState, useEffect } from 'react';

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
        // // Check if the skill is already selected
        // if (selectedSkills.includes(skill)) {
        //     // Remove the skill from the selected skills
        //     setSelectedSkills(selectedSkills.filter(s => s !== skill));
        //     // remove active class
        //     skill.target.classList.remove('active');
        // } else {
        //     // Check if the user has already selected 5 skills
        //     // if not add the skill to the selected skills
        //     if (selectedSkills.length < 5) {
        //         // Add the skill to the selected skills
        //         setSelectedSkills([...selectedSkills, skill]);
        //         // add active class
        //         skill.target.classList.add('active');

        //         // check if 5 skills are selected
        //         const activeSkills = document.querySelectorAll('.active');
        //         if (activeSkills.length === 5) {
        //             const signupNextBtn = document.getElementById('signup-nextBtn') as HTMLButtonElement | null;
        //             if (signupNextBtn) { // Check if the element exists
        //                 signupNextBtn.disabled = false;
        //             }
        //         }

        //         // enable the next button if 5 skills are selected
        //         // if 5 skills are not selected, disable the next button
        //         const signupNextBtn = document.getElementById('signup-nextBtn') as HTMLButtonElement | null; 
        //         if (signupNextBtn) { // Check if the element exists
        //             signupNextBtn.disabled = activeSkills.length !== 5;
        //         }

        //         // if 5 skills are selected, disable the other skills
        //         // when a skill is unselected, remove the 'active' class and enable the other skills
        //         document.querySelectorAll('skillBtn').forEach((button) => {
        //             const skillButton = button as HTMLButtonElement; // Type assertion
        //             if (activeSkills.length === 5) {
        //                 skillButton.disabled = !skillButton.classList.contains('active');
        //             } else {
        //                 skillButton.disabled = false;
        //             }
        //         });
        //     }
        // }

        // enable the next button if 5 skills are selected
        // if 5 skills are not selected, disable the next button
        // if (document.querySelectorAll('.active').length === 5) {
        //     document.getElementById('signup-nextBtn').disabled = false;
        // }
        // else {
        //     document.getElementById('signup-nextBtn').disabled = true;
        // }

        // if 5 skills are selected, disable the other skills
        // when a skill is unselected, remove the 'active' class and enable the other skills
        // if (document.querySelectorAll('.active').length === 5) {
        //     document.querySelectorAll('button').forEach((button) => {
        //         if (!button.classList.contains('active')) {
        //             button.disabled = true;
        //         }
        //     });
        // }
        // else {
        //     document.querySelectorAll('button').forEach((button) => {
        //         button.disabled = false;
        //     });
        // }

    };

    // if the modal is not shown, return null
    if (!show) {
        return null;
    }

    // render the page
    return (
        <div className="signupProcess-background">
            <div className="signupProcess-modal">
                <div className="ChooseSkills">

                    <h1 id="signupProcess-title">Choose Your Top 5 Skills</h1>
                    <p>You can add more and edit later</p>

                    <div id="skill-select">
                        {skills.map((skill, index) => (
                            <button key={index} onClick={handleSkillSelect} className='skillBtn'>{skill}</button>
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

export default ChooseSkills;