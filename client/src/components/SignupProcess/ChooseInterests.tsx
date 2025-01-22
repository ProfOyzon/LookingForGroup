import React, { useState, useEffect } from 'react';

// list of interests to choose from
// types of projects the user is interested in
import { interests } from '../../constants/interests';

//
// Choose at least 3 interests component
//
const ChooseInterests = ({
  show,
  onNext,
  onBack,
  selectedInterests,
  setSelectedInterests,
  mode,
  onClose,
}) => {
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

  let backgroundClassName = '';
  if (mode === 'signup') {
    // if the mode is signup, set the page background to the colorful image
    // else just have the transparent background
    backgroundClassName = 'signupProcess-background';
  } else {
    backgroundClassName = 'no-background';
  }

  // render the page
  return (
    <div className={backgroundClassName}>
      <div className="signupProcess-modal">
        <div className="ChooseInterests">
          {/* different titles based on the mode */}
          {mode === 'signup' ? (
            <>
              <h1 id="signupProcess-title">Choose At Least 3 Project Interests</h1>
              <p>You can add more and edit later</p>
            </>
          ) : (
            <>
              {/* Edit has "x" button to also close */}
              <div className="avatar-close-btn" onClick={onClose}>
                <img src="images/icons/cancel.png" alt="close" />
              </div>

              <h1 id="signupProcess-title">
                Edit Preferences/Project Interests
                <p>
                  Add interests using the search bar, then select 3 or 4 interests to be highlighted
                  on your profile
                </p>
              </h1>
            </>
          )}

          <div id="interest-select">
            {mode === 'signup' ? (
              <>
                {/* For signup, user chooses from provided interests */}
                {interests.map((interest, index) => (
                  <button
                    key={index}
                    onClick={handleInterestSelect}
                    // add the 'active' class to the buttons that were selected
                    // doing this inside className so that it's remembered when the user goes back and forth between modals
                    className={`interestBtn ${selectedInterests.includes(interest) ? 'active' : ''}`}
                  >
                    {interest}
                  </button>
                ))}
              </>
            ) : (
              <div className="edit-interest-container">
                {/* For editing, user sees what they preciously chose */}
                {/* There is a search bar to add their own interest */}

                {/* Search bar */}
                {/*
                 *   NEEDED FUNCTIONALITY:
                 *   - Search for interests
                 *   - Add interests to the list
                 */}
                <div className="row" style={{ alignSelf: 'center' }}>
                  <label htmlFor="interest-search">
                    <img
                      src="images/icons/search.png"
                      alt="search"
                      style={{ width: '30px', marginRight: '10px' }}
                    />
                  </label>
                  <input type="text" placeholder="Search for interests" id="interest-search" />
                </div>

                <h4>My Interests: </h4>
                {/*
                 *   NEEDED FUNCTIONALITY:
                 *   - Ability to remove interests (x button (always present or only on hover?))
                 *   - Highlighted interests are the ones that will be shown on the profile
                 *   - Interests already shown on the profile are highlighted
                 *   - Any new interests added should eventually  influence suggested projects
                 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {interests.map((interest, index) => (
                    <button
                      key={index}
                      onClick={handleInterestSelect}
                      // add the 'active' class to the buttons that were selected
                      // doing this inside className so that it's remembered when the user goes back and forth between modals
                      className={`interestBtn ${selectedInterests.includes(interest) ? 'active' : ''}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div id="signupProcess-btns">
            {mode === 'signup' ? (
              <>
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
              </>
            ) : (
              <>
                <button id="signup-backBtn" onClick={onClose}>
                  Cancel
                </button>
                <button
                  id="signup-nextBtn"
                  onClick={() => {
                    setSelectedInterests([]);
                    onClose();
                  }}
                  // disable the next button if the user has not selected at least 3 interests
                  // this is to prevent the user from moving to the next modal without selecting the required number of interests
                  // the user can only move to the next modal when they have selected at least 3 interests
                  disabled={selectedInterests.length < 3}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseInterests;
