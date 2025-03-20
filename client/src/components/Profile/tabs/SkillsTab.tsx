import { useState, useEffect } from 'react';
import { SearchBar } from '../../SearchBar';
import { sendPut, sendFile, fetchUserID } from '../../../functions/fetch';

const tagTabs = ['Dev Skills', 'Design Skills', 'Soft Skills'];

export const SkillsTab = (props: {profile: {}}) => {
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