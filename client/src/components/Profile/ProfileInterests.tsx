import { Tags } from '../Tags';
import { PagePopup, openClosePopup } from '../PagePopup';
import { SearchBar } from '../SearchBar';
import { useState } from 'react';
import { interests } from '../../constants/interests';
import { ThemeIcon } from '../ThemeIcon';
// import ChooseInterests from "../SignupProcess/ChooseInterests";

export const ProfileInterests = ({ user, isUsersProfile }) => {
  // Initialize state with empty array if user interests don't exist
  const [selectedInterests, setSelectedInterests] = useState(user?.interests || []);
  const [showPopup, setShowPopup] = useState(false);
  const [filteredInterests, setFilteredInterests] = useState(interests);

  // Safely generate interests list with null check
  const interestsList = user?.interests?.map((interest) => (
    <Tags key={interest}>{interest}</Tags>
  )) || [];

  // Toggle interest selection
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 4) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Search function for the "edit interests" popup
  const Search = (results) => {
    // If no search results, show all interests
    if (!results || results.length === 0) {
      setFilteredInterests(interests);
      return;
    }
    
    // Filter interests based on search results
    const matchedInterests = results[0].map(result => result.name);
    setFilteredInterests(matchedInterests);
  };

  // Save selected interests
  const saveInterests = async () => {
    try {
      // TODOS: Make an API call to save the interests
      
      // Close the popup after saving
      setShowPopup(false);
      
      // Update the displayed interests (if needed)
      
      console.log("Interests saved:", selectedInterests);
    } catch (error) {
      console.error("Failed to save interests:", error);
    }
  };

  return (
    <div id="profile-interests">
      
      <div className="profile-name-button">
        {/*edit interests button - only show for current user's profile*/}
        <h4>Interests</h4>
       
      </div>
      <div id="profile-interests-list" className="profile-list">
        {interestsList.length > 0 ? interestsList : <p 
        style={{ 
            margin: '0', 
            padding: '0', 
            fontSize: '1rem',
            textAlign: 'left'
          }}>Sorry, no interests here</p>}
      </div>

      <PagePopup
        width={'80vw'}
        height={'80vh'}
        popupId={0}
        zIndex={3}
        show={showPopup}
        setShow={setShowPopup}
      >
        <div id="profile-edit-interests" className="profile-edit">
          <h1>Edit Interests</h1>
          <h3>Select 3 or 4 interests to be highlighted on your page</h3>
          <SearchBar dataSets={[{ data: interests.map(interest => ({ name: interest })) }]} onSearch={Search}></SearchBar>

          <h3>Available Interests:</h3>
          <div id="profile-available-interests" className="interests-selection">
            {filteredInterests.map((interest) => (
              <button
                key={interest}
                className={`interest-tag ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                onClick={() => toggleInterest(interest)}
                disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 4}
              >
                {interest}
              </button>
            ))}
          </div>

          <h3>My Selected Interests: <span className="interest-count">({selectedInterests.length}/4)</span></h3>
          <div id="profile-edit-interests-list" className="profile-list">
            {selectedInterests.length > 0 ? 
              selectedInterests.map(interest => (
                <Tags key={interest} onClick={() => toggleInterest(interest)} className="selected-interest-tag">{interest}</Tags>
              ))
              : <p>No interests selected</p>
            }
          </div>

          <div className="button-row">
            <button className="save-btn" onClick={saveInterests}>Save</button>
            <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      </PagePopup>
    </div>
  );
};
