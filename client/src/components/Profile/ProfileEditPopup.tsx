//Styles
import '../Styles/credits.css';
import '../Styles/discoverMeet.css';
import '../Styles/emailConfirmation.css';
import '../Styles/general.css';
import '../Styles/loginSignup.css';
import '../Styles/messages.css';
import '../Styles/notification.css';
import '../Styles/profile.css';
import '../Styles/projects.css';
import '../Styles/settings.css';
import '../Styles/pages.css';

import { useState, useEffect } from 'react';
import { Popup, PopupButton, PopupContent } from '../Popup';
import { RoleSelector } from '../RoleSelector';
import { SearchBar } from '../SearchBar';
import { sendPut } from '../../functions/fetch';
import profileImage from '../../icons/profile-user.png';
import editIcon from '../../icons/edit.png';

const pageTabs = ['About', 'Projects', 'Skills', 'Links'];
const tagTabs = ['Dev Skills', 'Design Skills', 'Soft Skills'];
const inputs = [
  'firstName',
  'lastName',
  'pronouns',
  'role',
  'major',
  'academicYear',
  'location',
  'headline',
  'funFact',
  'bio',
  'skills',
  'socials'];

// Convenient Functions
const fetchUserID = async () => {
  const response = await fetch('/api/auth');
  const { data } = await response.json();
  return data;
}

// Functions
const onSaveClicked = async () => {
  // Receive all inputted values
  // Prepare these values for a POST/PUT request
  const getInputValue = (input) => {
    const element = document.getElementById(`profile-editor-${input}`) as HTMLInputElement;
    return element ? element.value : null;
  };

  const data = {
    firstName: getInputValue('firstName'),
    lastName: getInputValue('lastName'),
    headline: getInputValue('headline'),
    pronouns: getInputValue('pronouns'),
    jobTitleId: getInputValue('jobTitle'),
    majorId: getInputValue('major'),
    academicYear: getInputValue('academicYear'),
    location: getInputValue('location'),
    funFact: getInputValue('funFact'),
    bio: getInputValue('bio'),
    skills: getInputValue('skills'),
    socials: getInputValue('socials'),
  }

  console.log(`Data is to save:`);
  console.log(data);


  const userID = await fetchUserID();
  sendPut(`/api/users/${userID}`, data);
}

const setUpInputs = async (data) => {
  let profileData = data[0];

  const setUpFunc = (input, data) => {
    let inputElement = document.getElementById(`profile-editor-${input}`) as HTMLInputElement;
    if (inputElement) {
      if (inputElement.tagName.toLowerCase() === 'input' || inputElement.tagName.toLowerCase() === 'textarea') {
        inputElement.value = data;
      }
    }
  }

  setUpFunc('firstName', profileData.first_name);
  setUpFunc('lastName', profileData.last_name);
  setUpFunc('pronouns', profileData.pronouns);
  setUpFunc('role', profileData.job_title);
  setUpFunc('major', profileData.major);
  setUpFunc('academicYear', profileData.academic_year);
  setUpFunc('location', profileData.location);
  setUpFunc('headline', profileData.headline);
  setUpFunc('funFact', profileData.fun_fact);
}

// Tab Pages
const AboutTab = () => {
  // Effects
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = await fetchUserID();
        const response = await fetch(`/api/users/${id}`);
        const { data } = await response.json();
        await data;
      
        await setUpInputs(data);
      } catch (err) {
        console.log('Error fetching profile: ' + err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div id="profile-editor-about" className="edit-profile-body about">
      <div className="edit-profile-section-1">
        <div id="profile-editor-add-image" className="edit-profile-image">
          {/* TODO: Add image elements/components here based on currently uploaded images */}
          <img src="assets/white/upload_image.png" alt="" />
          <div className="project-editor-extra-info">
            Drop your image here, or {/*TODO: click to upload file<input type="file">*/}browse
            {/*</input>*/}
          </div>
          <div className="project-editor-extra-info">Supports: JPEG, PNG</div>
        </div>

        <div className="about-row row-1">
          <div className="editor-input-item">
            <label>First Name*</label>
            {/* <br /> */}
            <input id="profile-editor-firstName" type="text"></input>
          </div>
          <div className="editor-input-item">
            <label>Last Name*</label>
            {/* <br /> */}
            <input id="profile-editor-lastName" type="text"></input>
          </div>
          <div className="editor-input-item">
            <label>Pronouns</label>
            {/* <br /> */}
            <input id="profile-editor-pronouns" type="text"></input>
          </div>
        </div>
        <div className="about-row row-2">
          {<RoleSelector/>}
          {/* <div className="editor-input-item">
            <label>Role*</label>
            <select id="profile-editor-role">
              <option>UI Designer</option>
              <option>Programmer</option>
            </select>
          </div> */}
          <div className="editor-input-item">
            <label>Major*</label>
            {/* <br /> */}
            <select id="profile-editor-major">
              <option>Game Design & Development</option>
              <option>New Media Design</option>
            </select>
          </div>
          <div className="editor-input-item">
            <label>Year</label>
            {/* <br /> */}
            <select id="profile-editor-academicYear">
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
            </select>
          </div>
        </div>
        <div className="about-row row-3">
          <div className="editor-input-item">
            <label>Location</label>
            {/* <br /> */}
            <input id="profile-editor-location" type="text"></input>
          </div>
        </div>
      </div>
      <div className="edit-profile-section-2">
        <div className="editor-input-item editor-input-textarea">
          <label>Personal Quote</label>
          <div className="project-editor-extra-info">
            Write a fun and catchy phrase that captures your unique personality!
          </div>
          <span className="character-count">0/100</span>
          <textarea id="profile-editor-headline" maxLength={100} />
        </div>

        <div className="editor-input-item editor-input-textarea">
          <label>Fun Fact</label>
          <div className="project-editor-extra-info">
            Share a fun fact about yourself that will surprise others!
          </div>
          <span className="character-count">0/100</span>
          <textarea id="profile-editor-funFact" maxLength={100} />
        </div>
      </div>
      <div className="edit-profile-section-3">
        <div className="editor-input-item editor-input-textarea">
          <label>About You*</label>
          <div className="project-editor-extra-info">
            Share a brief overview of who you are, your interests, and what drives you!
          </div>
          <span className="character-count">0/2000</span>
          <textarea id="profile-editor-bio" maxLength={2000} />
        </div>
      </div>
    </div>
  );
};

const ProjectsTab = () => {
  return (
    <div id="profile-editor-projects">
      <div className="project-editor-section-header">Projects</div>
      <div className="project-editor-extra-info">
        Choose to hide/show projects you've worked on.
      </div>
      <div id="profile-editor-project-selection">
        {/* Insert user projects here, as blocks */}
        <ul>
          <li>You</li>
          <li>Haven't worked</li>
          <li>on a project yet!</li>
        </ul>
      </div>
    </div>
  );
};

const SkillsTab = () => {
  const [currentTagsTab, setCurrentTagsTab] = useState(0);
  let tagSearchTabs = tagTabs.map((tag, i) => {
    return (
      <button
        onClick={() => setCurrentTagsTab(i)}
        className={`project-editor-tag-search-tab ${currentTagsTab === i ? 'tag-search-tab-active' : ''}`}
      >
        {tag}
      </button>
    );
  });

  return (
    <div id="project-editor-tags">
      <div id="project-editor-selected-tags">
        <div className="project-editor-section-header">Selected Tags</div>
        {/* <div className='project-editor-warning'>*At least 1 tag is required</div> */}
        <div className="project-editor-extra-info">Drag and drop to reorder</div>
        <div id="project-editor-selected-tags-container">
          {/* Add tags here, separate top 2 from others */}
        </div>
      </div>

      <div id="project-editor-tag-search">
        <SearchBar dataSets={{}} onSearch={() => { }} />
        <div id="project-editor-tag-search-tabs">{tagSearchTabs}</div>
        <hr />
        <div id="project-editor-tag-search-container">{/* Insert current tab's tags here */}</div>
      </div>
    </div>
  );
};

const LinksTab = () => {
  return (
    <div id="project-editor-links">
      <label>Social Links</label>
      <div className="project-editor-extra-info">
        Provide the links to pages you wish to include on your page.
      </div>

      <div id="project-editor-link-list">
        {/* insert list of link elements/componenets here */}
        <button id="project-editor-add-link">+ Add Social Profile</button>
      </div>
    </div>
  );
};

export const ProfileEditPopup = () => {
  //State variable denoting current tab
  const [currentTab, setCurrentTab] = useState(0);

  //State variable tracking which tab of tags is currently viewed
  // const [currentTagsTab, setCurrentTagsTab] = useState(0);

  let currentTabContent;
  switch (pageTabs[currentTab]) {
    case 'About':
      currentTabContent = <AboutTab />;
      break;
    case 'Projects':
      currentTabContent = <ProjectsTab />;
      // currentTabContent = <h1>Project tab test</h1>;
      break;
    case 'Skills':
      currentTabContent = <SkillsTab />;
      break;
    case 'Links':
      currentTabContent = <LinksTab />;
      break;
    default:
      currentTabContent = <AboutTab />;
      break;
  }

  let editorTabs;
  editorTabs = pageTabs.map((tag, i) => {
    return (
      <button
        onClick={() => setCurrentTab(i)}
        className={`project-editor-tab ${currentTab === i ? 'project-editor-tab-active' : ''}`}
      >
        {tag}
      </button>
    );
  });

  return (
    <Popup>
      <PopupButton buttonId="project-info-edit">Edit Profile</PopupButton>
      <PopupContent>
        <div id="profile-creator-editor">
          <div id="profile-editor-tabs">{editorTabs}</div>
          <div id="profile-editor-content">{currentTabContent}</div>
          <button id="profile-editor-save" onClick={onSaveClicked}>Save Changes</button>
        </div>
      </PopupContent>
    </Popup>
  );
};
