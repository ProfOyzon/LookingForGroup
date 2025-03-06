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

import { useEffect, useState, useCallback, useMemo, JSX } from 'react';
import { Popup, PopupButton, PopupContent } from '../Popup';
import { GeneralTab } from './tabs/GeneralTab';
import { MediaTab } from './tabs/MediaTab';
import { LinksTab } from './tabs/LinksTab';
import { TeamTab } from './tabs/TeamTab';
import { TagsTab } from './tabs/TagsTab';

//THIS COMPONENT NEEDS TO BE WORKED ON

/*
  This component is in an unfinished state. Not all css styling rules have been implemented/fine-tuned yet, 
  and javascript functionality is at a bare minimum.
  When completed, this component should allow for either editing existing projects or creating new projects entirely,
  accessed via the ‘edit project’ button on project pages or the ‘create’ button on the sidebar, respectively.
*/

export const ProjectCreatorEditor = () => {
  //Creating project?

  //Get project ID from search parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectID = urlParams.get('projectID');

  // project template and default value for variable
  const emptyProject: {
    title: string;
    hook: string;
    description: string;
    purpose: string;
    status: string;
    audience: string;
    project_types: { id: number, project_type: string}[];
    tags: { id: number, position: number, tag: string, type: string}[];
    jobs: { title_id: number; job_title: string; description: string; availability: string; location: string; duration: string; compensation: string; }[];
    members: { first_name: string, last_name: string, job_title: string, profile_image: string, user_id: number}[];
    images: { id: number, image: string, position: number}[];
    socials: { id: number, url: string }[]; // not implemented?
  } = {
    title: '',
    hook: '',
    description: '',
    purpose: '',
    status: '',
    audience: '',
    project_types: [],
    tags: [],
    jobs: [],
    members: [],
    images: [],
    socials: [],
  };

  //=================
  // State variables
  //=================
  const [newProject, setNewProject] = useState(false);                    //tracking if creating a new project or editting existing (empty or populated fields)
  const [projectData, setProjectData] = useState(emptyProject);           //store project data
  const [modifiedProject, setModifiedProject] = useState(emptyProject);   //tracking temporary project changes before committing to a save
  const [failCheck, setFailCheck] = useState(false);                      //check whether or not the data in the popup is valid
  const [currentTab, setCurrentTab] = useState(0);                        //for current tab: 0 - general, 1 - Media, 2 - tags, 3 - team, 4 - links
  const [closePopup, setClosePopup] = useState(true);                     //determine if a popup should close after press (PopupButton)

  // Errors
  const [errorAddMember, setErrorAddMember] = useState('');               //sets error when adding a member to the team
  const [errorAddPosition, setErrorAddPosition] = useState('');           //sets error when adding a position to the team
  const [errorLinks, setErrorLinks] = useState('');

  //=============
  // Uses
  //=============  
  // Get project data on projectID change
  useEffect(() => {
    const getProjectData = async () => {
      const url = `/api/projects/${projectID}`;
      try {
        const response = await fetch(url);

        const projectResponse = await response.json();
        const projectData = projectResponse.data[0];
        console.log('got project data', projectData);

        if (projectData === undefined) {
          return;
        }

        // save project data
        setProjectData(projectData);
        setModifiedProject(projectData);
      } catch (error) {
        console.error(error);
      }
    };
    getProjectData();
    
  }, [projectID]);

  //================
  // Helper Methods
  //================

  // Handle events for tab switch
  useEffect(() => {
    // reset link error
    setErrorLinks('');
  }, [currentTab]);

  //Save project editor changes
  const saveProject = async () => {
    // default to no errors
    setFailCheck(false);

    // save if on link tab
    if (currentTab === 4) updateLinks();

    if (errorAddMember !== '' ||
        errorAddPosition !== '' ||
        errorLinks !== '') {
      console.log('errors present');
      setFailCheck(true);
      return;
    }

    // Send PUT request (editor)
    try {
      console.log(`Sending PUT request to /api/projects/${projectID} for body: `, modifiedProject);
      await fetch(`/api/projects/${projectID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedProject),
      });

      setProjectData(modifiedProject);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
    // window.location.reload();
  };

  // Save links to modifiedProject
  const updateLinks = () => {
    // temp social links
    const newSocials: {id: number, url: string}[] = [];

    // get parent element
    const parentDiv = document.querySelector('#project-editor-link-list');

    // iterate through children
    parentDiv?.childNodes.forEach(element  => {
      // skip element if its the last (add button)
      if (element === parentDiv.lastElementChild) {
        return;
      }

      // get dropdown and input
      const dropdown = (element as HTMLElement).querySelector('select');
      const input = (element as HTMLElement).querySelector('input');

      // get values
      const id = Number(dropdown?.options[dropdown?.selectedIndex].dataset.id);
      const url = input?.value;
      
      // if no values at all, ignore and remove
      if (!id && !url) {
        console.log('empty link found, ignoring');
        return;
      }
      // check for valid id
      if (isNaN(id) || id === -1) {
        setErrorLinks('Select a website in the dropdown');
        return;
      }
      if (!url) {
        setErrorLinks('Enter a URL');
        return;
      }

      // add to list
      newSocials.push({ id: id, url: url });
      
      // remove error
      setErrorLinks('');
  });

    console.log('new socials', newSocials);

    // update socials
    setModifiedProject({ ...modifiedProject, socials: newSocials });
  };

  return (  
    <Popup>
      <PopupButton buttonId="project-info-edit">Edit Project</PopupButton>
      <PopupContent>
        <div id="project-creator-editor">
          <div id="project-editor-tabs">
            <button
              onClick={() => {
                if (currentTab === 4) updateLinks();
                setCurrentTab(0);
              }}
              className={`project-editor-tab ${currentTab === 0 ? 'project-editor-tab-active' : ''}`}
            >
              General
            </button>
            <button
              onClick={() => {
                if (currentTab === 4) updateLinks();
                setCurrentTab(1);
              }}
              className={`project-editor-tab ${currentTab === 1 ? 'project-editor-tab-active' : ''}`}
            >
              Media
            </button>
            <button
              onClick={() => {
                if (currentTab === 4) updateLinks();
                setCurrentTab(2);
              }}
              className={`project-editor-tab ${currentTab === 2 ? 'project-editor-tab-active' : ''}`}
            >
              Tags
            </button>
            <button
              onClick={() => {
                if (currentTab === 4) updateLinks();
                setCurrentTab(3);
              }}
              className={`project-editor-tab ${currentTab === 3 ? 'project-editor-tab-active' : ''}`}
            >
              Team
            </button>
            <button
              onClick={() => {
                if (currentTab === 4) updateLinks();
                setCurrentTab(4);
              }}
              className={`project-editor-tab ${currentTab === 4 ? 'project-editor-tab-active' : ''}`}
            >
              Links
            </button>
          </div>

          <div id="project-editor-content">
            {
              currentTab === 0 ? <GeneralTab isNewProject={newProject} projectData={modifiedProject} setProjectData={setModifiedProject} /> :
              currentTab === 1 ? <MediaTab isNewProject={newProject} projectData={modifiedProject} setProjectData={setModifiedProject} /> :
              currentTab === 2 ? <TagsTab isNewProject={newProject} projectData={modifiedProject} setProjectData={setModifiedProject} /> :
              currentTab === 3 ? <TeamTab isNewProject={newProject} projectData={modifiedProject} setProjectData={setModifiedProject} /> :
              currentTab === 4 ? <LinksTab isNewProject={newProject} projectData={modifiedProject} setProjectData={setModifiedProject} setErrorLinks={setErrorLinks} /> :
              <></>
            }
          </div>

          <PopupButton buttonId="project-editor-save" callback={saveProject} doNotClose={!failCheck}>
            Save Changes
          </PopupButton>
        </div>
      </PopupContent>
    </Popup>
  );
};
