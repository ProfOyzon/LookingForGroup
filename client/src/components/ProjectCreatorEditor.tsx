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

  //Media
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

  //Tags

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

  // Team tab

  //State variable tracking which team tab is currently being viewed
  //0 - current team, 1 - open positions
  const [currentTeamTab, setCurrentTeamTab] = useState(0);

  //State variable tracking whether position view is in edit mode or not
  const [editMode, setEditMode] = useState(false);

  // Open position display
  const positionViewWindow = (
    <>
      {
        <>
          <button className="edit-project-member-button">
            <img className="edit-project-member-icon" src="/images/icons/pencil.png" alt="" />
          </button>
          <div className="positions-popup-info-title">
            {/* {displayedProject.jobs[viewedPosition].job_title} */}
            Video Game Developer
          </div>
          <div className="positions-popup-info-description">
            <div id="position-description-content">
              {/* {displayedProject.jobs[viewedPosition].description} */}
              We are looking for game developers familiar with Unreal Engine 5
            </div>
          </div>
          <div id="open-position-details">
            <div id="open-position-details-left">
              <div id="position-availability">
                <span className="position-detail-indicator">Availability: </span>
                {/* {displayedProject.jobs[viewedPosition].availability} */}
                Full-time
              </div>
              <div id="position-location">
                <span className="position-detail-indicator">Location: </span>
                {/* {displayedProject.jobs[viewedPosition].location} */}
                On-site
              </div>
              <div id="open-position-contact">
                <span className="position-detail-indicator">Contact: </span>
                <span
                  // onClick={() =>
                  //   navigate(`${paths.routes.PROFILE}?userID=${projectLead.user_id}`)
                  // }
                  id="position-contact-link"
                >
                  <img src="/assets/creditProfiles/JF.png" alt=""/>
                  {/* {projectLead.first_name} {projectLead.last_name} */}
                  Lily Carter
                </span>
              </div>
            </div>
            <div id="open-position-details-right">
              <div id="position-duration">
                <span className="position-detail-indicator">Duration: </span>
                {/* {displayedProject.jobs[viewedPosition].duration} */}
                Short-term
              </div>
              <div id="position-compensation">
                <span className="position-detail-indicator">Compensation: </span>
                {/* {displayedProject.jobs[viewedPosition].compensation} */}
                Paid
              </div>
            </div>
          </div>
          <button id="delete-position-button">
            <img src="/images/icons/delete.svg" alt="trash can" />
          </button>
        </>
      }
    </>
  );

  const savePosition = () => {
    //Save current inputs in position editing window
    setEditMode(false);
  };

  // Edit open position
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

  // Check if team tab is in edit mode
  const positionWindow = editMode === true ? positionEditWindow : positionViewWindow;

  const teamTabContent = currentTeamTab === 0 ? <>{
    <div id="project-editor-project-members">
      {/* List out project members */}
      {/* Temporary hard-coded members */}
      <div className="project-editor-project-member">
        <img className="project-member-image" src="/assets/creditProfiles/JF.png" alt=""/>
        <div className="project-editor-project-member-info">
          <div className="project-editor-project-member-name">Lily Carter</div>
          <div className="project-editor-project-member-role project-editor-extra-info">Project Lead</div>
        </div>
        {/* Edit member popup */}
        <Popup>
          <PopupButton className="edit-project-member-button">
            <img className="edit-project-member-icon" src="/images/icons/pencil.png" alt="" />
          </PopupButton>
          <PopupContent>
            <div id="project-team-edit-member-title">Edit Member</div>
            <div id="project-team-edit-member-card" className="project-editor-project-member">
              <img className="project-member-image" src="/assets/creditProfiles/JF.png" alt=""/>
              <div className="project-editor-project-member-name">Lily Carter</div>
            </div>
            <div id="project-team-add-member-role">
              <label>Role</label>
              <select>
                <option disabled selected>Select</option>
                <option>role 1</option>
                <option>role 2</option>
              </select>
            </div>
            {/* Action buttons */}
            <div className="project-editor-button-pair">
              {/* TODO: save team member to project */}
              <button id="team-edit-member-save-button">Save</button>
              <Popup>
                <PopupButton className="delete-button">Delete</PopupButton>
                <PopupContent>
                  <div id="project-team-delete-member-title">Delete Member</div>
                  <div id="project-team-delete-member-text" className="project-editor-extra-info">
                    {/* TODO: get member name dynamically */}
                    Are you sure you want to delete <span className="project-info-highlight">Lily Carter</span> from the project? This action cannot be undone.
                  </div>
                  <div className="project-editor-button-pair">
                    <button className="delete-button">Delete</button>
                    <PopupButton buttonId="team-delete-member-cancel-button">Cancel</PopupButton>
                  </div>
                </PopupContent>
              </Popup>
            </div>
            <PopupButton buttonId="team-edit-member-cancel-button">Cancel</PopupButton>
          </PopupContent>
        </Popup>
      </div>
      {/* Add member button */}
      <Popup>
        <PopupButton buttonId="project-editor-add-member">
          <img id="project-team-add-member-image" src={profileImage} alt=""/>
          <div id="project-team-add-member-text">Add Member</div>
        </PopupButton>
        <PopupContent>
          <div id="project-team-add-member-title">Add Member</div>
          <div id="project-team-add-member-name">
            <label>Name</label><input type="text"></input>
          </div>
          <div id="project-team-add-member-role">
            <label>Role</label>
            <select>
              <option disabled selected>Select</option>
              <option>role 1</option>
              <option>role 2</option>
            </select>
          </div>
          {/* Action buttons */}
          <div className="project-editor-button-pair">
            {/* TODO: add team member to project */}
            <button id="team-add-member-add-button">Add</button>
            <PopupButton buttonId="team-add-member-cancel-button">Cancel</PopupButton>
          </div>
        </PopupContent>
      </Popup>
    </div>
    }</> : currentTeamTab === 1 ? (
    <>{
      <div id="project-team-open-positions-popup">
        <div className="positions-popup-list">
          <div id="team-positions-popup-list-header">Open Positions</div>
          <div id="team-positions-popup-list-buttons">
            {/* {displayedProject.jobs.map((job, index) => (
              <button
                className={`positions-popup-list-item ${index === viewedPosition ? 'positions-popup-list-item-active' : ''}`}
                onClick={() => setViewedPosition(index)}
                key={index}
              >
                {job.job_title}
              </button>
            ))} */}
            <div className="team-positions-button">
              <img src="/images/icons/drag.png" alt=""/>
              <button className="positions-popup-list-item" id="team-positions-active-button">Video Game Developer</button>
            </div>
            <div className="team-positions-button">
              <img src="/images/icons/drag.png" alt=""/>
              <button className="positions-popup-list-item">2D Artist</button>
            </div>
            <div className="team-positions-button">
              <button className="project-editor-extra-info">&#43; Add Position</button>
            </div>
          </div>
        </div>
        <div className="positions-popup-info">
          {positionWindow}
        </div>
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

  //Links
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
