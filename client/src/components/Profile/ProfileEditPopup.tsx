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

import { useState } from 'react';
import { Popup, PopupButton, PopupContent } from "../Popup";
import { SearchBar } from "../SearchBar";
import profileImage from "../../icons/profile-user.png";
import editIcon from "../../icons/edit.png";

const pageTabs = ['About', 'Projects', 'Skills', 'Links'];
const tagTabs = ['Dev Skills', 'Design Skills', 'Soft Skills'];

// Tab Pages
const AboutTab = () => {
  return (
    <div id='project-editor-general'>
      <div id='project-editor-title-input' className='project-editor-input-item'>
        <label>Title*</label>
        <br />
        <input type='text'></input>
      </div>

      <div id='project-editor-status-input' className='project-editor-input-item'>
        <label>Status*</label>
        <br />
        <select>
          <option>In Development</option>
          <option>Finished</option>
        </select>
      </div>

      <div id='project-editor-purpose-input' className='project-editor-input-item'>
        <label>Purpose</label>
        <br />
        <select>
          <option>Passion project</option>
          <option>Academic</option>
        </select>
      </div>

      <div id='project-editor-audience-input' className='project-editor-input-item'>
        <label>Target Audience</label>
        <div className='project-editor-extra-info'>
          Define who this project is intended for--consider age group,
          interest, industry, or specific user needs.
        </div>
        <textarea maxLength={100} />
      </div>

      <div id='project-editor-description-input' className='project-editor-input-item'>
        <label>Short Description*</label>
        <div className='project-editor-extra-info'>
          Share a brief summary of your project.
          This will be displayed in your project's discover card.
        </div>
        <textarea maxLength={300} />
      </div>

      <div id='project-editor-long-description-input' className='project-editor-input-item'>
        <label>About This Project*</label>
        <div className='project-editor-extra-info'>
          Use this space to go into detail about your project! Feel free to share
          it's inspirations and goals, outline key features,
          and describe this impact you hope it brings to others.
        </div>
        <textarea maxLength={2000} />
      </div>
    </div>

  );
}

const SkillsTab = () => {
  const [currentTagsTab, setCurrentTagsTab] = useState(0);
  let tagSearchTabs = tagTabs.map((tag, i) => {
    return <button onClick={() => setCurrentTagsTab(i)} 
    className={`project-editor-tag-search-tab ${currentTagsTab === i ? 'tag-search-tab-active' : ''}`}>
    {tag}
    </button>;
  });

  return (
    <div id='project-editor-tags'>
      <div id='project-editor-type-tags'>
        <div className='project-editor-section-header'>Skills</div>
        <div id='project-editor-type-tags-container'>
          {/* Add type tags here */}
        </div>
      </div>

      <div id='project-editor-selected-tags'>
        <div className='project-editor-section-header'>Selected Tags</div>
        <div className='project-editor-warning'>*At least 1 tag is required</div>
        <div className='project-editor-extra-info'>
          Drag and drop to reorder. The first 2 tags will be displayed on your project's discover card.
        </div>
        <div id='project-editor-selected-tags-container'>
          {/* Add tags here, separate top 2 from others */}
        </div>
      </div>

      <div id='project-editor-tag-search'>
        <SearchBar dataSets={{}} onSearch={() => { }} />
        <div id='project-editor-tag-search-tabs'>
          {tagSearchTabs}
        </div>
        <hr />
        <div id='project-editor-tag-search-container'>
          {/* Insert current tab's tags here */}
        </div>
      </div>
    </div>
  );
}

const LinksTab = () => {
  return (
    <div id='project-editor-links'>
      <label>Social Links</label>
      <div className='project-editor-extra-info'>
        Provide the links to pages you wish to include on your page.
      </div>

      <div id='project-editor-link-list'>
        {/* insert list of link elements/componenets here */}
        <button id='project-editor-add-link'>+ Add Social Profile</button>
      </div>
    </div>
  );
}

export const ProfileEditPopup = () => {
  //State variable denoting current tab
  const [currentTab, setCurrentTab] = useState(0);

  //State variable tracking which tab of tags is currently viewed
  const [currentTagsTab, setCurrentTagsTab] = useState(0);

  //Checks to see which tab we are currently rendering
  let currentTabContent;
  switch (pageTabs[currentTab]) {
    case 'About':
      currentTabContent = <AboutTab />;
      break;
    case 'Projects':
      // currentTabContent = <ProjectsTab/>;
      currentTabContent = <h1>Project tab test</h1>;
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
  let editorTabs; //= document.createElement('div');
  // editorTabs.id = 'project-editor-tabs';
  editorTabs = pageTabs.map((tag, i) => {
    return (<button
      onClick={() => setCurrentTab(i)}
      className={`project-editor-tab ${currentTab === i ? 'project-editor-tab-active' : ''}`}>
      {tag}
    </button>)
  });

  return (
    <Popup>
      <PopupButton buttonId='project-info-edit'>Edit Profile</PopupButton>
      <PopupContent>
        <div id='project-creator-editor'>
          <div id='project-editor-tabs'>
            {editorTabs}
          </div>
          <div id='project-editor-content'>
            {currentTabContent}
          </div>
          <button id='project-editor-save'>Save Changes</button>
        </div>
      </PopupContent>
    </Popup>
  )
}