import React, { useState, useEffect } from 'react';

// list of skills to choose from
// technologies, arts, tools, and soft skills
const skills = ["UI/UX", "Figma", "JavaScript", "Photoshop", "Illustrator", "HTML", "CSS", "Java", "React", "Web Development", "Game Development", "Graphic Design", "3D Design", "2D Design", , "Video Editing", "C#", "Python", "Unity", "Machine Learning", "Artificial Intelligence", "Cybersecurity", "Virtual Reality", "Augmented Reality", "Game Design", "Front End", "Back End", "Design", "Database", "Adaptable", "Dependable", "Creative", "Organized", "Communication", "Teamwork", "Leadership", "Passionate", "Problem Solving", "Critical Thinking", "Time Management", "Detail Oriented", "Self Motivated", "Collaboration", "Innovative", "Resourceful", "Analytical", "Adaptable", "Dependable", "Creative", "Organized", "Communication", "Teamwork", "Leadership", "Passionate", "Problem Solving", "Critical Thinking", "Time Management", "Detail Oriented", "Self Motivated", "Collaboration", "Innovative", "Resourceful", "Analytical"];

//
// Choose top 5 skills component
//
const ChooseSkills = ({ show, onNext, onBack }) => {
    // State variables
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // State variable for the selected skills

    // Function to handle the skill selection
    const handleSkillSelect = (skill) => {
        // Check if selectedSkills has a length of 5
        // if it doesn't, highlight the button by adding the 'active' class, and add the skill to the selectedSkills array
        if (selectedSkills.length < 5) {
            if (!selectedSkills.includes(skill.target.innerHTML)) {
                skill.target.classList.add('active');

                // creating a new array to both update the state and check the length 
                // of selectedSkills after the addition of a new skill
                const newSkills = [...selectedSkills, skill.target.innerHTML];
                setSelectedSkills(newSkills);
            }
            // else remove the skill from the selectedSkills array and remove the 'active' class from the button
            else {
                skill.target.classList.remove('active');
                setSelectedSkills(selectedSkills.filter((prof) => prof !== skill.target.innerHTML));
            }
        }
        // if selectedSkills has a length of 5
        else {
            // if the skill is already selected, remove it from the selectedSkills array and remove the 'active' class from the button
            if (selectedSkills.includes(skill.target.innerHTML)) {
                skill.target.classList.remove('active');
                setSelectedSkills(selectedSkills.filter((prof) => prof !== skill.target.innerHTML));
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
                        <button id="signup-nextBtn" onClick={onNext} disabled={selectedSkills.length !== 5} >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ChooseSkills;