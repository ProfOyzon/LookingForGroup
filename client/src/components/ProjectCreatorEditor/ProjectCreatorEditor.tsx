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

import { useEffect, useState } from 'react';
import { Popup, PopupButton, PopupContent } from '../Popup';
import { GeneralTab } from './tabs/GeneralTab';
import { MediaTab } from './tabs/MediaTab';
import { LinksTab } from './tabs/LinksTab';
import { TeamTab } from './tabs/TeamTab';
import { TagsTab } from './tabs/TagsTab';

interface Image {
  id: number;
  image: string;
  position: number;
  file: File
}

interface ProjectData {
  audience: string;
  description: string;
  hook: string;
  images: Image[];
  jobs: { title_id: number; job_title: string; description: string; availability: string; location: string; duration: string; compensation: string; }[];
  members: { first_name: string, last_name: string, job_title: string, profile_image: string, user_id: number}[];
  project_id: number;
  project_types: { id: number, project_type: string}[];
  purpose: string;
  socials: { id: number, url: string }[];
  status: string;
  tags: { id: number, position: number, tag: string, type: string}[];
  thumbnail: string;
  title: string;
}

// default value for project data
const emptyProject: ProjectData = {
  audience: '',
  description: '',
  hook: '',
  images: [],
  jobs: [],
  members: [],
  project_id: -1,
  project_types: [],
  purpose: '',
  socials: [],
  status: '',
  tags: [],
  thumbnail: '',
  title: '',
};

/**
 * This component should allow for either editing existing projects or creating new projects entirely,
 * accessed via the ‘edit project’ button on project pages or the ‘create’ button on the sidebar,
 * respectively.
 * 
 * @returns React component Popup
 */
export const ProjectCreatorEditor = () => {
  //Creating project? TODO: create prop to handle if new project or not

  //Get project ID from search parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectID = urlParams.get('projectID');

  // --- Hooks ---
  // tracking if creating a new project or editting existing (empty or populated fields)
  const [newProject, setNewProject] = useState(false);

  // store project data
  const [projectData, setProjectData] = useState(emptyProject);

  // tracking temporary project changes before committing to a save
  const [modifiedProject, setModifiedProject] = useState(emptyProject);

  // check whether or not the data in the popup is valid
  const [failCheck, setFailCheck] = useState(false);

  // for current tab: 0 - general, 1 - Media, 2 - tags, 3 - team, 4 - links
  const [currentTab, setCurrentTab] = useState(0);

  // Errors
  const [errorAddMember, setErrorAddMember] = useState('');
  const [errorAddPosition, setErrorAddPosition] = useState('');
  const [errorLinks, setErrorLinks] = useState('');

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

    // --- Editor ---
    try {
      // Update images
      let dbImages: Image[] = [];
      // Get images on database
      const picturesResponse = await fetch(`/api/projects/${projectID}/pictures`);
      const imagesResponse = await picturesResponse.json();
      const imageData = imagesResponse.data;

      // add images to reference later
      dbImages = imageData;

      // Compare new images to database to find images to delete
      console.log('comparing images to database');
      const imagesToDelete: Image[] = dbImages.filter(
        image => !modifiedProject.images.find( newImage => newImage.image === image.image)
      );

      // Delete images
      await Promise.all(
        imagesToDelete.map(async (image) => {
          // remove image from database
          await fetch(`/api/projects/${projectID}/pictures`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: image.image })
          });
        })
      );

      // Add new images to database
      console.log('adding new images to database');

      // Wrap upload in promise
      const uploadImages = modifiedProject.images.map(async (image) => {
        if (!dbImages.find((dbImage) => dbImage.image === image.image)) {
          // file must be new: recreate file
          const fileResponse = await fetch(image.image);
          const fileBlob = await fileResponse.blob();
          const file = new File([fileBlob], image.image, { type: fileBlob.type });

          // create form data to send
          const formData = new FormData();
          formData.append('image', file);
          formData.append('position', image.position.toString());

          // add image to database
          await fetch(`/api/projects/${projectID}/pictures`, {
            method: 'POST',
            body: formData
          });
        }
      });

      // Wait for all images to upload
      await Promise.all(uploadImages);

      // Reestablish image positions
      console.log('reestablishing image positions');
      await fetch(`/api/projects/${projectID}/pictures`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: modifiedProject.images })
      });

      // Compare thumbnail
      if (modifiedProject.thumbnail !== projectData.thumbnail) {
        // get thumbnail
        const thumbnailResponse = await fetch(`/api/projects/${projectID}/thumbnail`);

        // create file
        const thumbnailBlob = await thumbnailResponse.blob();
        const thumbnailFile = new File([thumbnailBlob], modifiedProject.thumbnail, { type: thumbnailBlob.type });

        const formData = new FormData();
        formData.append('image', thumbnailFile);

        // update thumbnail
        await fetch(`/api/projects/${projectID}/thumbnail`, {
          method: 'PUT',
          body: formData
        });

      }

      // Send PUT request for general project info
      console.log(`Sending PUT request to /api/projects/${projectID} for body: `, modifiedProject);
      await fetch(`/api/projects/${projectID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedProject),
      });

      setProjectData(modifiedProject);

    } catch (error) {
      console.error(error);
      return false;
    }
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
              currentTab === 3 ? <TeamTab isNewProject={newProject} projectData={modifiedProject} setProjectData={setModifiedProject} setErrorMember={setErrorAddMember} setErrorPosition={setErrorAddPosition}/> :
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
