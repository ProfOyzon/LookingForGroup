import React, { useState, useEffect } from 'react';
import { hardSkills, softSkills, proficiencies } from '../../constants/skills';

// list of skills to choose from
// technologies, arts, tools, and soft skills
//combined into one list
const skills = hardSkills.concat(softSkills.concat(proficiencies));

//
// Choose top 5 skills component
//
const ChooseSkills = ({
  show,
  onNext,
  onBack,
  selectedSkills,
  setSelectedSkills,
  mode,
  onClose,
}) => {
  // Function to handle the skill selection
  const handleSkillSelect = (skill) => {
    // get the skill that was selected
    const selected = skill.target.innerHTML;

    // if the skill is already selected, remove it from the selectedSkills array
    if (selectedSkills.includes(selected)) {
      setSelectedSkills(selectedSkills.filter((prof) => prof !== selected));
    }
    // else if the selectedSkills array has less than 5 elements, add the skill to the selectedSkills array
    else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, selected]);
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
          {/* different titles based on the mode */}
          {mode === 'signup' ? (
            <>
              <h1 id="signupProcess-title">Choose Your Top 5 Skills</h1>
              <p>You can add more and edit later</p>
            </>
          ) : (
            <>
              <h1 id="signupProcess-title">Edit Skills</h1>
              <p>
                Add skills using the search bar, then select 5 skills to be highlighted on your page
              </p>
            </>
          )}

          <div id="skill-select">
            {skills.map((skill, index) => (
              <button
                key={index}
                onClick={handleSkillSelect}
                // add the 'active' class to the buttons that were selected
                // doing this inside className so that it's remembered when the user goes back and forth between modals
                className={`skillBtn ${selectedSkills.includes(skill) ? 'active' : ''}`}
              >
                {skill}
              </button>
            ))}
          </div>
          <div id="signupProcess-btns">
            <button id="signup-backBtn" onClick={onBack}>
              Back
            </button>
            <button
              id="signup-nextBtn"
              onClick={onNext}
              // disable the next button if the user has not selected 5 skills
              // this is to prevent the user from moving to the next modal without selecting the required number of skills
              // the user can only move to the next modal when they have selected 5 skills
              disabled={selectedSkills.length !== 5}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseSkills;
