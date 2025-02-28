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
import { LinksTab, getSocials } from '../tabs/LinksTab';
import { RoleSelector } from '../RoleSelector';
import { MajorSelector } from '../MajorSelector';
import { SearchBar } from '../SearchBar';
import { ImageUploader } from '../ImageUploader';
import { sendPut, sendFile, fetchUserID } from '../../functions/fetch';
// import profileImage from '../../icons/profile-user.png';
// import editIcon from '../../icons/edit.png';

const pageTabs = ['About', 'Projects', 'Skills', 'Links'];
const tagTabs = ['Dev Skills', 'Design Skills', 'Soft Skills'];

// Functions
const onSaveClicked = async (e : Event) => {
  e.preventDefault(); // prevents any default calls
  // Receive all inputted values
  // Prepare these values for a POST/PUT request
  const getInputValue = (input : string) => {
    const element = document.getElementById(`profile-editor-${input}`) as HTMLInputElement;
    return element ? element.value : ''; // null
  };
  const data = {
    firstName: getInputValue('firstName'),
    lastName: getInputValue('lastName'),
    headline: getInputValue('headline'),
    pronouns: getInputValue('pronouns'),
    jobTitleId: parseInt(getInputValue('jobTitle')),
    majorId: parseInt(getInputValue('major')),
    academicYear: getInputValue('academicYear'),
    location: getInputValue('location'),
    funFact: getInputValue('funFact'),
    bio: getInputValue('bio'),
    skills: getInputValue('skills'),
    socials: getSocials(),
  };
  console.log(data);

  const userID = await fetchUserID();
  await sendPut(`/api/users/${userID}`, data);
  await saveImage(userID, e.target);

  window.location.reload(); // reload page
};

const saveImage = (userID, data) => {
  // saves the profile pic if there has been a change
  const formElement = document.getElementById('profile-creator-editor') as HTMLFormElement;
  sendFile(`/api/users/${userID}/profile-picture`, formElement);
};

const setUpInputs = async (data) => {
  const profileData = data[0];
  let roles, majors;

  const getRolesAndMajors = async () => {
    const roleResponse = await fetch(`/api/datasets/job-titles`);
    const majorResponse = await fetch(`/api/datasets/majors`);

    roles = await roleResponse.json();
    majors = await majorResponse.json();
    roles = roles.data;
    majors = majors.data;
  };

  const setUpFunc = (input, data) => {
    const inputElement = document.getElementById(`profile-editor-${input}`) as HTMLInputElement;
    if (inputElement) {
      // if (inputElement.tagName.toLowerCase() === 'input' || inputElement.tagName.toLowerCase() === 'textarea') {
      //   inputElement.value = data;
      // }
      inputElement.value = data;
    }
  };

  await getRolesAndMajors();

  setUpFunc('firstName', profileData.first_name);
  setUpFunc('lastName', profileData.last_name);
  setUpFunc('pronouns', profileData.pronouns);
  setUpFunc('jobTitle', roles.find((r) => r.label === profileData.job_title).title_id);
  setUpFunc('major', majors.find((r) => r.label === profileData.major).major_id);
  setUpFunc('academicYear', profileData.academic_year);
  setUpFunc('location', profileData.location);
  setUpFunc('headline', profileData.headline);
  setUpFunc('funFact', profileData.fun_fact);
  setUpFunc('bio', profileData.bio);
};

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
          <ImageUploader />
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
          {<RoleSelector />}
          {<MajorSelector />}
          <div className="editor-input-item">
            <label>Year</label>
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
    <div id="profile-editor-projects" className="hidden">
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
  const tagSearchTabs = tagTabs.map((tag, i) => {
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
    <div id="profile-editor-skills" className="hidden">
      <div id="project-editor-selected-tags">
        <div className="project-editor-section-header">Selected Tags</div>
        {/* <div className='project-editor-warning'>*At least 1 tag is required</div> */}
        <div className="project-editor-extra-info">Drag and drop to reorder</div>
        <div id="project-editor-selected-tags-container">
          {/* Add tags here, separate top 2 from others */}
        </div>
      </div>

      <div id="project-editor-tag-search">
        <SearchBar dataSets={{}} onSearch={() => {}} />
        <div id="project-editor-tag-search-tabs">{tagSearchTabs}</div>
        <hr />
        <div id="project-editor-tag-search-container">{/* Insert current tab's tags here */}</div>
      </div>
    </div>
  );
};

export const ProfileEditPopup = () => {
  let currentTab = 0;
  const [profile, setProfile] = useState(); // Profile Data holder

  useEffect(() => {
    const setUpProfileData = async () => {
      // Pick which socials to use based on type
      // fetch for profile on ID
      const userID = await fetchUserID();
      const response = await fetch(`api/users/${userID}`);
      const { data } = await response.json(); // use data[0]
      console.log(data[0]);
      
      setProfile(data[0]);
    };
    setUpProfileData();
  }, []);

  let TabContent = () => {
    return (
      <div id="profile-editor-content">
        <AboutTab />
        <ProjectsTab />
        <SkillsTab />
        <LinksTab type={'profile'}/>
      </div>
    );
  };

  const switchTab = (tabIndex) => {
    // Toggle the visibility for the previous Tab
    const previousTabIndex = pageTabs[currentTab].toLowerCase();
    const prevElement = document.querySelector(`#profile-editor-${previousTabIndex}`);
    const prevTab = document.querySelector(`#profile-tab-${pageTabs[currentTab]}`);
    if (prevElement) {
      prevElement.classList.toggle('hidden');
    }
    if (prevTab) {
      prevTab.classList.toggle('project-editor-tab-active');
    }
    currentTab = tabIndex;

    // Get current tab
    let currentElement;
    const currTab = document.querySelector(`#profile-tab-${pageTabs[currentTab]}`);
    switch (pageTabs[currentTab]) {
      case 'About':
        currentElement = document.querySelector(`#profile-editor-about`);
        break;
      case 'Projects':
        currentElement = document.querySelector(`#profile-editor-projects`);
        break;
      case 'Skills':
        currentElement = document.querySelector(`#profile-editor-skills`);
        break;
      case 'Links':
        currentElement = document.querySelector(`#profile-editor-links`);
        break;
      default:
        currentElement = document.querySelector(`#profile-editor-about`);
        break;
    }
    // Toggle its visibility
    if (currentElement) {
      currentElement.classList.toggle('hidden');
    }
    if (currTab) {
      currTab.classList.toggle('project-editor-tab-active');
    }
  };

  let editorTabs = pageTabs.map((tag, i) => {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          switchTab(i);
        }}
        id={`profile-tab-${tag}`}
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
        <form id="profile-creator-editor" encType="multipart/form-data">
          {/* <div id="profile-creator-editor"> */}
          <div id="profile-editor-tabs">{editorTabs}</div>
          <TabContent />
          {/* <button id="profile-editor-save" onClick={onSaveClicked}>Save Changes</button> */}
          <input
            type="submit"
            id="profile-editor-save"
            onClick={onSaveClicked}
            value={'Save Changes'}
          />
          {/* </div> */}
        </form>
      </PopupContent>
    </Popup>
  );
};
