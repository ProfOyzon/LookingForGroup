import "./pages/pages.css";
import "./Styles/styles.css";
import { useState } from 'react';
import { Popup, PopupButton, PopupContent } from "./Popup";
import { SearchBar } from "./SearchBar";
import profileImage from "../icons/profile-user.png";

export const ProjectCreatorEditor = () => {

  //State variable denoting current tab
  //0 - general, 1 - Media, 2 - tags, 3 - team, 4 - links
  const [currentTab, setCurrentTab] = useState(0);

  //Tab page elements

  //General
  const generalTab = <>{
    <div id='project-editor-general'>
      <label>Title*</label>
      <input type='text'></input>

      <label>Status*</label>
      <select>
        <option>In Development</option>
        <option>Finished</option>
      </select>

      <label>Purpose</label>
      <select>
        <option>Passion project</option>
        <option>Academic</option>
      </select>

      <label>Target Audience</label>
      <div className='project-editor-extra-info'>
        Define who this project is intended for--consider age group,
        interest, industry, or specific user needs
      </div>
      <textarea/>

      <label>Short Description*</label>
      <div className='project-editor-extra-info'>
        Share a brief summary of your project. 
        This will be displayed in your project's discover card.
      </div>
      <textarea/>

      <label>About This Project*</label>
      <div className='project-editor-extra-info'>
        Use this space to go into detail about your project! Feel free to share 
        it's inspirations and goals, outline key features, 
        and describe this impact you hope it brings to others
      </div>
      <textarea/>
    </div>
  }</>

  const mediaTab = <>{
    <div id='project-editor-media'>
      <label>Project Images</label>
      <div className='project-editor-extra-info'>
        Upload images that showcase your project. 
        Select one image to be used as the main thumbnail on the project's discover card.
      </div>
      <div id='project-editor-image-ui'>
        {/* Add image elements/components here based on currently uploaded images */}
        <div id='project-editor-add-image'>
          <img/>
          <div>Drop your image here, or browse</div>
          <div>Supports: JPEG, PNG</div>
        </div>
      </div>
    </div>
  }</>

  //State variable tracking which tab of tags is currently viewed
  //0 - project type, 1 - genre, 2 - dev skills, 3 - design skills, 4 - soft skills
  const [currentTagsTab, setCurrentTagsTab] = useState(0);

  const tagsTab = <>{
    <div id='project-editor-tags'>
    <div id='project-editor-type-tags'>
      <div className='project-editor-section-header'>Project Type</div>
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
      <SearchBar dataSets={{}} onSearch={() => {}}/>
      <div id='project-editor-tag-search-tabs'>
        <button className={`project-editor-tag-search-tab ${currentTagsTab === 0 ? 'tag-search-tab-active' : ''}`}>Project Type</button>
        <button className={`project-editor-tag-search-tab ${currentTagsTab === 1 ? 'tag-search-tab-active' : ''}`}>Genre</button>
        <button className={`project-editor-tag-search-tab ${currentTagsTab === 2 ? 'tag-search-tab-active' : ''}`}>Developer Skills</button>
        <button className={`project-editor-tag-search-tab ${currentTagsTab === 3 ? 'tag-search-tab-active' : ''}`}>Designer Skills</button>
        <button className={`project-editor-tag-search-tab ${currentTagsTab === 4 ? 'tag-search-tab-active' : ''}`}>Soft Skills</button>
      </div>
      <hr/>
      <div id='project-editor-tag-search-container'>
        {/* Insert current tab's tags here */}
      </div>
    </div>
    </div>
  }</>

  //State variable tracking which team tab is currently being viewed
  //0 - current team, 1 - open positions
  const [currentTeamTab, setCurrentTeamTab] = useState(0);

  const teamTabContent = currentTeamTab === 0 ? <>{
    <div id='project-editor-project-members'>
      {/* List out project members */}
      <Popup>
        <PopupButton buttonId="project-editor-add-member">
          <img src={profileImage}/>Add Member
        </PopupButton>
        <PopupContent>
          <div>Add Member</div>
          <label>Name</label><input type='text'></input>
          <label>Role</label>
          <select>
            <option>role 1</option>
            <option>role 2</option>
          </select>
        </PopupContent>
      </Popup>
    </div>
  }</> : currentTeamTab === 1 ? <>{
    <div id='project-editor-open-positions'>
      <div id='project-editor-open-positions-list'>
        {/* Add open positions here */}
        <button>+ Add Position</button>
      </div>

      <div id='project-editor-open-position-details'>

      </div>
    </div>
  }</> : <></>

  const teamTab = <>{
    <div id='project-editor-team'>
      <div id='project-editor-team-tabs'>
        <button className={`project-editor-team-tab ${currentTeamTab === 0 ? 'team-tab-active':''}`}>Current Team</button>
        <button className={`project-editor-team-tab ${currentTeamTab === 1 ? 'team-tab-active':''}`}>Open Positions</button>
      </div>

      <div id='project-editor-team-content'>
        {teamTabContent}
      </div>
    </div>
  }</>

  return (
    <Popup>
      <PopupButton buttonId='project-info-edit'>Edit Project</PopupButton>
      <PopupContent>
        <div id='project-creator-editor'>
          <div id='project-editor-tabs'>
            <button className={`project-editor-tab ${currentTab === 0 ? 'project-editor-tab-active':''}`}>General</button>
            <button className={`project-editor-tab ${currentTab === 1 ? 'project-editor-tab-active':''}`}>Media</button>
            <button className={`project-editor-tab ${currentTab === 2 ? 'project-editor-tab-active':''}`}>Tags</button>
            <button className={`project-editor-tab ${currentTab === 3 ? 'project-editor-tab-active':''}`}>Team</button>
            <button className={`project-editor-tab ${currentTab === 4 ? 'project-editor-tab-active':''}`}>Links</button>
          </div>

          <div id='project-editor-content'>
            {/* Insert current tab contents here */}
          </div>

          <button id='project-editor-save'>Save Changes</button>
        </div>
      </PopupContent>
    </Popup>
  )
}