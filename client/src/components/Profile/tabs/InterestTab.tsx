import { useState, useEffect, useMemo, useCallback } from 'react';
import { SearchBar } from '../../SearchBar';
import { interests } from '../../../constants/interests';
import { Tags } from '../../Tags';
import { ProfileData } from '../ProfileEditPopup'
//import { ThemeIcon } from '../../ThemeIcon';

interface Tag {
  tag_id: number;
  label: string;
  type: string;
}
export const InterestTab = (props: { profile: ProfileData}) => {
  // Initialize state with profile data 
  const [modifiedProfile, setModifiedProfile] = useState<ProfileData>(props.profile);
  //const [allInterests, setAllInterests] = useState<Tag[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [filteredInterests, setFilteredInterests] = useState<string[]>(interests);
  const user = useMemo(() => props.profile, [props.profile]);

  useEffect(() => {
  // Force hidden state on initial render unless this is the active tab
  const element = document.getElementById('profile-editor-interests');
  if (element) {
    // Check if interests is the current active tab
    const isActive = document.querySelector(`#profile-tab-Interests.project-editor-tab-active`);
    if (!isActive) {
      element.classList.add('hidden');
    }
  }
}, []);

  // Update data when data is changed
  useEffect(() => {
    setModifiedProfile(props.profile);
    if (props.profile?.interests) {
      const interestStrings = props.profile.interests.map(i => i.interest);  
      setSelectedInterests(interestStrings || []);
    }
  }, [props.profile]);
  
  // Initialize interests from user profile
  useEffect(() => {
    setFilteredInterests(interests);
  }, []);

  useEffect(() => {
    const interestInput = document.getElementById('profile-edit-interests-list') as HTMLInputElement;
    if (interestInput) {
      interestInput.value = selectedInterests.join(', ');
    }
  }, [selectedInterests]);

  // Safely generate interests list with null check
  /*const interestsList = user?.interests?.map((interest) => (
    <Tags key={interest}>{interest}</Tags>
  )) || [];*/

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
    if (!results || results.length === 0) {
      //setTimeout to avoid crashing error
      // If no search results, show all interests  
      setTimeout(() => setFilteredInterests(interests), 0);
      return;
    }
    // Filter interests based on search results
    const matchedInterests = results[0].map(result => result.name || result);
    // setTimeout to avoid crashing error
    setTimeout(() => setFilteredInterests(matchedInterests), 0);
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

  // load interests from API
  /*useEffect(() => {
    const getInterests = async () => {
      const url = `/api/datasets/skills`;

      try {
        const response = await fetch(url);

        const interests = await response.json();
        const interestData = interests.data;

        if (interestData === undefined) {
          return;
        }
        setAllInterests(interestData);

      } catch (error) {
        console.error(error);
      }
    };
    if (allSkills.length === 0) {
      getSkills();
    }
  }, [allSkills]);*/

  
  return (
  <div id="profile-editor-interests" className="profile-edit hidden">
    <input type="hidden" id="profile-edit-interests" name="interests" value={selectedInterests.join(', ')} />
          <div id="project-editor-selected-tags">
        <div className="project-editor-section-header">Selected Tags</div>
        <div className="project-editor-extra-info">
          Drag and drop to reorder
        </div>    
      </div>
      <div id="project-editor-tag-search">
          <SearchBar dataSets={[{ data: interests.map(interest => ({name: interest})) }]} onSearch={Search} />

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
        </div>
  );
}