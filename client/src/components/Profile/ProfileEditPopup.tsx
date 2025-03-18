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
import { AboutTab } from '../tabs/AboutTab';
import { LinksTab, getSocials } from '../tabs/LinksTab';
import { ProjectsTab } from '../tabs/ProjectsTab';
import { SkillsTab } from '../tabs/SkillsTab';
import { RoleSelector } from '../RoleSelector';
import { MajorSelector } from '../MajorSelector';
import { ImageUploader } from '../ImageUploader';
import { sendPut, sendFile, fetchUserID } from '../../functions/fetch';
// import profileImage from '../../icons/profile-user.png';
// import editIcon from '../../icons/edit.png';

const pageTabs = ['About', 'Projects', 'Skills', 'Links'];

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
  console.log('Saving data...');
  console.log(data);

  const userID = await fetchUserID();
  await sendPut(`/api/users/${userID}`, data);
  await saveImage(userID);

  // window.location.reload(); // reload page
};

const saveImage = async (userID) => {
  // saves the profile pic if there has been a change
  const formElement = document.getElementById('profile-creator-editor') as HTMLFormElement;
  await sendFile(`/api/users/${userID}/profile-picture`, formElement);
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
        <AboutTab setUpInputs={setUpInputs} />
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

    // Update Current Tab
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
      <PopupContent callback={()=>{switchTab(0);}}>
        <form id="profile-creator-editor" encType="multipart/form-data">
          <div id="profile-editor-tabs">{editorTabs}</div>
          <TabContent />
          <input
            type="submit"
            id="profile-editor-save"
            onClick={onSaveClicked}
            value={'Save Changes'}
          />
        </form>
      </PopupContent>
    </Popup>
  );
};
