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
import { Popup, PopupButton, PopupContent } from '../Popup';
import { SearchBar } from '../SearchBar';
import profileImage from '../../icons/profile-user.png';
import editIcon from '../../icons/edit.png';

const pageTabs = ['About', 'Projects', 'Skills', 'Links'];
const tagTabs = ['Dev Skills', 'Design Skills', 'Soft Skills'];

// Tab Pages
const AboutTab = () => {
  return (
    <div id="profile-editor-about" className="edit-profile-body about">
      <div className="edit-profile-section-1">
        {/* <div id="project-editor-add-image">
          <img src="assets/white/upload_file_white.png" alt="" />
          <div className="project-editor-extra-info">Drop your image here, or browse</div>
          <div className="project-editor-extra-info">Supports: JPEG, PNG</div>
        </div> */}

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
          <div id="profile-editor-firstName-input" className="editor-input-item">
            <label>First Name*</label>
            {/* <br /> */}
            <input type="text"></input>
          </div>
          <div id="profile-editor-lastName-input" className="editor-input-item">
            <label>Last Name*</label>
            {/* <br /> */}
            <input type="text"></input>
          </div>
          <div id="profile-editor-pronouns-input" className="editor-input-item">
            <label>Pronouns</label>
            {/* <br /> */}
            <input type="text"></input>
          </div>
        </div>
        <div className="about-row row-2">
          <div id="profile-editor-role-input" className="editor-input-item">
            <label>Role*</label>
            {/* <br /> */}
            <select>
              <option>UI Designer</option>
              <option>Programmer</option>
            </select>
          </div>
          <div id="profile-editor-major-input" className="editor-input-item">
            <label>Major*</label>
            {/* <br /> */}
            <select>
              <option>Game Design & Development</option>
              <option>New Media Design</option>
            </select>
          </div>
          <div id="profile-editor-year-input" className="editor-input-item">
            <label>Year</label>
            {/* <br /> */}
            <select>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
            </select>
          </div>
        </div>
        <div className="about-row row-3">
          <div id="profile-editor-location-input" className="editor-input-item">
            <label>Location</label>
            {/* <br /> */}
            <input type="text"></input>
          </div>
        </div>
      </div>
      <div className="edit-profile-section-2">
        <div
          id="profile-editor-personal-quote-input"
          className="editor-input-item editor-input-textarea"
        >
          <label>Personal Quote</label>
          <div className="project-editor-extra-info">
            Write a fun and catchy phrase that captures your unique personality!
          </div>
          <span className="character-count">0/100</span>
          <textarea maxLength={100} />
        </div>

        <div id="profile-editor-fun-fact-input" className="editor-input-item editor-input-textarea">
          <label>Fun Fact</label>
          <div className="project-editor-extra-info">
            Share a fun fact about yourself that will surprise others!
          </div>
          <span className="character-count">0/100</span>
          <textarea maxLength={100} />
        </div>
      </div>
      <div className="edit-profile-section-3">
        <div
          id="profile-editor-long-description-input"
          className="editor-input-item editor-input-textarea"
        >
          <label>About You*</label>
          <div className="project-editor-extra-info">
            Share a brief overview of who you are, your interests, and what drives you!
          </div>
          <span className="character-count">0/2000</span>
          <textarea maxLength={2000} />
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
        <SearchBar dataSets={{}} onSearch={() => {}} />
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
  const [currentTagsTab, setCurrentTagsTab] = useState(0);

  //Checks to see which tab we are currently rendering
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
  let editorTabs; //= document.createElement('div');
  // editorTabs.id = 'project-editor-tabs';
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
          <button id="profile-editor-save">Save Changes</button>
        </div>
      </PopupContent>
    </Popup>
  );
};
