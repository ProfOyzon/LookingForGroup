//Styles
import './Styles/credits.css';
import './Styles/discoverMeet.css';
import './Styles/emailConfirmation.css';
import './Styles/general.css';
import './Styles/loginSignup.css';
import './Styles/messages.css';
import './Styles/notification.css';
import './Styles/profile.css';
import './Styles/projects.css';
import './Styles/settings.css';
import './Styles/pages.css';

import { useState } from 'react';
import { Popup, PopupButton, PopupContent } from './Popup';
import { SearchBar } from './SearchBar';
import profileImage from '../icons/profile-user.png';
import editIcon from '../icons/edit.png';

//THIS COMPONENT NEEDS TO BE WORKED ON

/*
  This component is in an unfinished state. Not all css styling rules have been implemented/fine-tuned yet, 
  and javascript functionality is at a bare minimum.
  When completed, this component should allow for either editing existing projects or creating new projects entirely,
  accessed via the ‘edit project’ button on project pages or the ‘create’ button on the sidebar, respectively.
*/

export const ProjectCreatorEditor = () => {
  //State variable denoting current tab
  //0 - general, 1 - Media, 2 - tags, 3 - team, 4 - links
  const [currentTab, setCurrentTab] = useState(0);

  //Tab page elements

  //General
  const generalTab = (
    <>
      {
        <div id="project-editor-general">
          <div id="project-editor-title-input" className="project-editor-input-item">
            <label>Title*</label>
            <input type="text" className="title-input"></input>
          </div>

          <div id="project-editor-status-input" className="project-editor-input-item">
            <label>Status*</label>
            <select>
              <option>In Development</option>
              <option>Finished</option>
            </select>
          </div>

          <div id="project-editor-purpose-input" className="project-editor-input-item">
            <label>Purpose</label>
            <select>
              <option>Passion project</option>
              <option>Academic</option>
            </select>
          </div>

          <div id="project-editor-audience-input" className="project-editor-input-item">
            <label>Target Audience</label>
            <div className="project-editor-extra-info">
              Define who this project is intended for--consider age group, interest, industry, or
              specific user needs.
            </div>
            <span className="character-count">0/100</span>{' '}
            {/*FIXME: update counter to use realtime entry*/}
            <textarea maxLength={100} />
          </div>

          <div id="project-editor-description-input" className="project-editor-input-item">
            <label>Short Description*</label>
            <div className="project-editor-extra-info">
              Share a brief summary of your project. This will be displayed in your project's
              discover card.
            </div>
            <span className="character-count">0/300</span>{' '}
            {/*FIXME: update counter to use realtime entry*/}
            <textarea maxLength={300} />
          </div>

          <div id="project-editor-long-description-input" className="project-editor-input-item">
            <label>About This Project*</label>
            <div className="project-editor-extra-info">
              Use this space to go into detail about your project! Feel free to share it's
              inspirations and goals, outline key features, and describe this impact you hope it
              brings to others.
            </div>
            <span className="character-count">0/2000</span>{' '}
            {/*FIXME: update counter to use realtime entry*/}
            <textarea maxLength={2000} />
          </div>
        </div>
      }
    </>
  );

  const mediaTab = (
    <>
      {
        <div id="project-editor-media">
          <label>Project Images</label>
          <div className="project-editor-extra-info">
            Upload images that showcase your project. Select one image to be used as the main
            thumbnail on the project's discover card.
          </div>
          <div id="project-editor-image-ui">
            {/* TODO: Add image elements/components here based on currently uploaded images */}
            <div id="project-editor-add-image">
              <img src="assets/white/upload_file_white.png" alt="" />
              <div className="project-editor-extra-info">
                Drop your image here, or {/*TODO: click to upload file<input type="file">*/}browse
                {/*</input>*/}
              </div>
              <div className="project-editor-extra-info">Supports: JPEG, PNG</div>
            </div>
          </div>
        </div>
      }
    </>
  );

  //State variable tracking which tab of tags is currently viewed
  //0 - project type, 1 - genre, 2 - dev skills, 3 - design skills, 4 - soft skills
  const [currentTagsTab, setCurrentTagsTab] = useState(0);

  const tagsTab = (
    <>
      {
        <div id="project-editor-tags">
          <div id="project-editor-type-tags">
            <div className="project-editor-section-header">Project Type</div>
            <div className="error">*At least 1 type is required</div>{' '}
            {/* FIXME: determine error from project information*/}
            <div id="project-editor-type-tags-container">{/* TODO: Add type tags here */}</div>
          </div>

          <div id="project-editor-selected-tags">
            <div className="project-editor-section-header">Selected Tags</div>
            <div className="project-editor-extra-info">
              Drag and drop to reorder. The first 2 tags will be displayed on your project's
              discover card.
            </div>
            <div className="error">*At least 1 tag is required</div>{' '}
            {/* FIXME: determine error from project information*/}
            <hr id="selected-tag-divider" />
            <div id="project-editor-selected-tags-container">
              {/* TODO: Add tags here, separate top 2 from others */}
            </div>
          </div>

          <div id="project-editor-tag-search">
            <SearchBar dataSets={{}} onSearch={() => {}} />
            <div id="project-editor-tag-wrapper">
              <div id="project-editor-tag-search-tabs">
                <button
                  onClick={() => setCurrentTagsTab(0)}
                  className={`project-editor-tag-search-tab ${currentTagsTab === 0 ? 'tag-search-tab-active' : ''}`}
                >
                  Project Type
                </button>
                <button
                  onClick={() => setCurrentTagsTab(1)}
                  className={`project-editor-tag-search-tab ${currentTagsTab === 1 ? 'tag-search-tab-active' : ''}`}
                >
                  Genre
                </button>
                <button
                  onClick={() => setCurrentTagsTab(2)}
                  className={`project-editor-tag-search-tab ${currentTagsTab === 2 ? 'tag-search-tab-active' : ''}`}
                >
                  Developer Skills
                </button>
                <button
                  onClick={() => setCurrentTagsTab(3)}
                  className={`project-editor-tag-search-tab ${currentTagsTab === 3 ? 'tag-search-tab-active' : ''}`}
                >
                  Designer Skills
                </button>
                <button
                  onClick={() => setCurrentTagsTab(4)}
                  className={`project-editor-tag-search-tab ${currentTagsTab === 4 ? 'tag-search-tab-active' : ''}`}
                >
                  Soft Skills
                </button>
              </div>
              <hr id="tag-search-divider" />
            </div>
            <div id="project-editor-tag-search-container">
              {/* TODO: Insert current tab's tags here */}
            </div>
          </div>
        </div>
      }
    </>
  );

  //State variable tracking which team tab is currently being viewed
  //0 - current team, 1 - open positions
  const [currentTeamTab, setCurrentTeamTab] = useState(0);

  //State variable tracking whether position view is in edit mode or not
  const [editMode, setEditMode] = useState(false);

  const positionViewWindow = (
    <>
      {
        <>
          <div id="project-editor-position-title">Title</div>
          <button onClick={() => setEditMode(true)} id="project-editor-position-edit">
            <img src={editIcon} alt="" />
          </button>
          <div id="project-editor-position-description">
            <div id="position-description-header">What we are looking for:</div>
            <div id="position-description-content">Description text etc. etc.</div>
          </div>
          <div id="position-details">
            <div id="position-availability">
              <span className="position-detail-indicator">Availability: </span>bleh
            </div>
            <div id="position-duration">
              <span className="position-detail-indicator">Duration: </span>bleh
            </div>
            <div id="position-location">
              <span className="position-detail-indicator">Location: </span>bleh
            </div>
            <div id="position-compensation">
              <span className="position-detail-indicator">Compensation: </span>bleh
            </div>
          </div>
          <div id="position-contact">
            if interested, please contact:{' '}
            <span
              /* onClick={() => navigate(`${paths.routes.PROFILE}?userID=${projectLead.user_id}`)} */ id="position-contact-link"
            >
              <img />
              user name
            </span>
          </div>
          <button id="delete-position-button">delete</button>
        </>
      }
    </>
  );

  const savePosition = () => {
    //Save current inputs in position editing window
    setEditMode(false);
  };

  const positionEditWindow = (
    <>
      {
        <>
          <label>Role*</label>
          <select>
            <option>option 1</option>
            <option>option 2</option>
          </select>

          <button onClick={savePosition} id="position-edit-save">
            Save
          </button>
          <button onClick={() => setEditMode(false)} id="position-edit-cancel">
            Cancel
          </button>

          <label>Role Description*</label>
          <textarea></textarea>

          <label>Availability</label>
          <select>
            <option>option 1</option>
            <option>option 2</option>
          </select>

          <label>Duration</label>
          <select>
            <option>option 1</option>
            <option>option 2</option>
          </select>

          <label>Location</label>
          <select>
            <option>option 1</option>
            <option>option 2</option>
          </select>

          <label>Compensation</label>
          <select>
            <option>option 1</option>
            <option>option 2</option>
          </select>

          <label>Main Contact</label>
          <select>
            <option>option 1</option>
            <option>option 2</option>
          </select>
        </>
      }
    </>
  );

  const positionWindow = editMode === true ? positionEditWindow : positionViewWindow;

  const teamTabContent = currentTeamTab === 0 ? <>{
    <div id='project-editor-project-members'>
      {/* List out project members */}
      {/* Temporary hard-coded members */}
      <div id='project-editor-project-member'>
        <img className='project-member-image' src='/assets/creditProfiles/JF.png' alt=''/>
        <div id='project-editor-project-member-info'>
          <div id='project-editor-project-member-name'>Lily Carter</div>
          <div id='project-editor-project-member-role' className='project-editor-extra-info'>Project Lead</div>
        </div>
        <button className='edit-project-member-button'><img className='edit-project-member-icon' src='/images/icons/pencil.png' alt='' /></button>
      </div>
      <div id='project-editor-project-member'>
        <img className='project-member-image' src='/assets/creditProfiles/JF.png' alt=''/>
        <div id='project-editor-project-member-info'>
          <div id='project-editor-project-member-name'>Maya Bennett</div>
          <div id='project-editor-project-member-role' className='project-editor-extra-info'>2D Artist</div>
        </div>
        <button className='edit-project-member-button'><img className='edit-project-member-icon' src='/images/icons/pencil.png' alt='' /></button>
      </div>
      <div id='project-editor-project-member'>
        <img className='project-member-image' src='/assets/creditProfiles/JF.png' alt=''/>
        <div id='project-editor-project-member-info'>
          <div id='project-editor-project-member-name'>Aiden Brooks</div>
          <div id='project-editor-project-member-role' className='project-editor-extra-info'>Video Game Developer</div>
        </div>
        <button className='edit-project-member-button'><img className='edit-project-member-icon' src='/images/icons/pencil.png' alt='' /></button>
      </div>
      <div id='project-editor-project-member'>
        <img className='project-member-image' src='/assets/creditProfiles/JF.png' alt=''/>
        <div id='project-editor-project-member-info'>
          <div id='project-editor-project-member-name'>Aiden Brooks</div>
          <div id='project-editor-project-member-role' className='project-editor-extra-info'>Video Game Developer</div>
        </div>
        <button className='edit-project-member-button'><img className='edit-project-member-icon' src='/images/icons/pencil.png' alt='' /></button>
      </div>
      {/* Add member button */}
      <Popup>
        <PopupButton buttonId="project-editor-add-member">
          <img id='project-team-add-member-image' src={profileImage} alt=''/>
          <div id='project-team-add-member-text'>Add Member</div>
        </PopupButton>
        <PopupContent>
          <div id=''>Add Member</div>
          <label>Name</label><input type='text'></input>
          <label>Role</label>
          <select>
            <option>role 1</option>
            <option>role 2</option>
          </select>
        </PopupContent>
      </Popup>
    </div>
    }</> : currentTeamTab === 1 ? (
    <>{
    <div id='project-editor-open-positions'>
      <div id='project-editor-open-positions-list'>
        {/* Add open positions here */}
        <button>+ Add Position</button>
      </div>

            <div id="project-editor-open-position-details">{positionWindow}</div>
          </div>
        }
      </>
    ) : (
      <></>
    );

  const teamTab = (
    <>
      {
        <div id="project-editor-team">
          <div id="project-editor-team-tabs">
            <button
              onClick={() => setCurrentTeamTab(0)}
              className={`project-editor-team-tab ${currentTeamTab === 0 ? 'team-tab-active' : ''}`}
            >
              Current Team
            </button>
            <button
              onClick={() => setCurrentTeamTab(1)}
              className={`project-editor-team-tab ${currentTeamTab === 1 ? 'team-tab-active' : ''}`}
            >
              Open Positions
            </button>
          </div>

          <div id="project-editor-team-content">{teamTabContent}</div>
        </div>
      }
    </>
  );

  const linksTab = (
    <>
      {
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
      }
    </>
  );

  //Checks to see which tab we are currently rendering
  let currentTabContent;
  switch (currentTab) {
    case 0:
      currentTabContent = generalTab;
      break;
    case 1:
      currentTabContent = mediaTab;
      break;
    case 2:
      currentTabContent = tagsTab;
      break;
    case 3:
      currentTabContent = teamTab;
      break;
    case 4:
      currentTabContent = linksTab;
      break;
    default:
      currentTabContent = generalTab;
  }

  return (
    <Popup>
      <PopupButton buttonId="project-info-edit">Edit Project</PopupButton>
      <PopupContent>
        <div id="project-creator-editor">
          <div id="project-editor-tabs">
            <button
              onClick={() => setCurrentTab(0)}
              className={`project-editor-tab ${currentTab === 0 ? 'project-editor-tab-active' : ''}`}
            >
              General
            </button>
            <button
              onClick={() => setCurrentTab(1)}
              className={`project-editor-tab ${currentTab === 1 ? 'project-editor-tab-active' : ''}`}
            >
              Media
            </button>
            <button
              onClick={() => setCurrentTab(2)}
              className={`project-editor-tab ${currentTab === 2 ? 'project-editor-tab-active' : ''}`}
            >
              Tags
            </button>
            <button
              onClick={() => setCurrentTab(3)}
              className={`project-editor-tab ${currentTab === 3 ? 'project-editor-tab-active' : ''}`}
            >
              Team
            </button>
            <button
              onClick={() => setCurrentTab(4)}
              className={`project-editor-tab ${currentTab === 4 ? 'project-editor-tab-active' : ''}`}
            >
              Links
            </button>
          </div>

          <div id="project-editor-content">{currentTabContent}</div>

          <button id="project-editor-save">Save Changes</button>
        </div>
      </PopupContent>
    </Popup>
  );
};
