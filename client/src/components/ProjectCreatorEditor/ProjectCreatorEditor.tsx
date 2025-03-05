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
import profileImage from '../../icons/profile-user.png';
import { GeneralTab } from './tabs/GeneralTab';
import { MediaTab } from './tabs/MediaTab';
import { LinksTab } from './tabs/LinksTab';
import { TagsTab } from './tabs/TagsTab';
import { TeamTab } from './tabs/TeamTab';

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

  //===================
  // Tab page elements
  //===================
  // Team tab
  // Open position display
  // const positionViewWindow = (
  //   <>
  //     {
  //       <>
  //         <button
  //           className="edit-project-member-button"
  //           onClick={() => {
  //             setCurrentJob(getProjectJob(currentRole));
  //             setEditMode(true);
  //           }}
  //         >
  //           <img className="edit-project-member-icon" src="/images/icons/pencil.png" alt="" />
  //         </button>
  //         <div className="positions-popup-info-title">{getProjectJob(currentRole).job_title}</div>
  //         <div className="positions-popup-info-description">
  //           <div id="position-description-content">{getProjectJob(currentRole).description}</div>
  //         </div>
  //         <div id="open-position-details">
  //           <div id="open-position-details-left">
  //             <div id="position-availability">
  //               <span className="position-detail-indicator">Availability: </span>
  //               {getProjectJob(currentRole).availability}
  //             </div>
  //             <div id="position-location">
  //               <span className="position-detail-indicator">Location: </span>
  //               {getProjectJob(currentRole).location}
  //             </div>
  //             <div id="open-position-contact">
  //               <span className="position-detail-indicator">Contact: </span>
  //               <span
  //                 // onClick={() =>
  //                 //   navigate(`${paths.routes.PROFILE}?userID=${projectLead.user_id}`)
  //                 // }
  //                 id="position-contact-link"
  //               >
  //                 <img src="/assets/creditProfiles/JF.png" alt="" />
  //                 {/* {projectLead.first_name} {projectLead.last_name} */}
  //                 Lily Carter
  //               </span>
  //             </div>
  //           </div>
  //           <div id="open-position-details-right">
  //             <div id="position-duration">
  //               <span className="position-detail-indicator">Duration: </span>
  //               {getProjectJob(currentRole).duration}
  //             </div>
  //             <div id="position-compensation">
  //               <span className="position-detail-indicator">Compensation: </span>
  //               {getProjectJob(currentRole).compensation}
  //             </div>
  //           </div>
  //         </div>
  //         <Popup>
  //           <PopupButton className="delete-position-button button-reset">
  //             <img src="/images/icons/delete.svg" alt="trash can" />
  //           </PopupButton>
  //           <PopupContent useClose={false}>
  //             <div id="project-team-delete-member-title">Delete Position</div>
  //             <div id="project-team-delete-member-text" className="project-editor-extra-info">
  //               Are you sure you want to delete{' '}
  //               <span className="project-info-highlight">
  //                 {getProjectJob(currentRole).job_title}
  //               </span>{' '}
  //               from the project? This action cannot be undone.
  //             </div>
  //             <div className="project-editor-button-pair">
  //               {/* TODO: make delete button work */}
  //               <PopupButton className="delete-button" callback={() => deletePosition()}>
  //                 Delete
  //               </PopupButton>
  //               <PopupButton buttonId="team-delete-member-cancel-button">Cancel</PopupButton>
  //             </div>
  //           </PopupContent>
  //         </Popup>
  //       </>
  //     }
  //   </>
  // );

  // // Edit open position or creating new position
  // const positionEditWindow = (
  //   <>
  //     <div id="edit-position-role">
  //       {/* TODO: add place for error message (setErrorAddPosition) */}
  //       <label>Role*</label>
  //       <select
  //         key={currentRole}
  //         onChange={(e) => {
  //           const selectedTitle = allJobs.find((j) => j.label === e.target.value);
  //           if (selectedTitle)
  //             setCurrentJob({
  //               ...currentJob,
  //               title_id: selectedTitle.title_id,
  //               job_title: selectedTitle.label,
  //             });
  //         }}
  //       >
  //         <option disabled selected={newPosition}>
  //           Select
  //         </option>
  //         {allJobs.map((job: { title_id: number; label: string }) => (
  //           <option
  //             key={job.title_id}
  //             selected={newPosition ? false : job.title_id === currentRole}
  //             onClick={() => {
  //               const updatedJobs = modifiedProject.jobs.map((j) =>
  //                 j.title_id === job.title_id ? { ...j, job_title: job.label } : j
  //               );
  //               setModifiedProject({ ...modifiedProject, jobs: updatedJobs });
  //             }}
  //           >
  //             {job.label}
  //           </option>
  //         ))}
  //       </select>
  //       <div id="edit-position-buttons">
  //         <div id="edit-position-button-pair">
  //           <button onClick={savePosition} id="position-edit-save">
  //             Save
  //           </button>
  //           <button
  //             onClick={() => {
  //               addPositionCallback();
  //             }}
  //             id="position-edit-cancel"
  //             className="button-reset"
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //         <div className="error">{errorAddPosition}</div>
  //       </div>
  //     </div>

  //     <div id="edit-position-description">
  //       <label>Role Description*</label>
  //       <textarea
  //         onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
  //       >
  //         {newPosition ? '' : getProjectJob(currentRole).description}
  //       </textarea>
  //     </div>

  //     <div id="edit-position-details">
  //       <div id="edit-position-details-left">
  //         <label className="edit-position-availability">Availability</label>
  //         <select
  //           className="edit-position-availability"
  //           onChange={(e) => setCurrentJob({ ...currentJob, availability: e.target.value })}
  //         >
  //           <option disabled selected={newPosition}>
  //             Select
  //           </option>
  //           {availabilityOptions.map((o) => (
  //             <option
  //               key={o}
  //               selected={newPosition ? false : getProjectJob(currentRole).availability === o}
  //             >
  //               {o}
  //             </option>
  //           ))}
  //         </select>
  //         <label className="edit-position-location">Location</label>
  //         <select
  //           className="edit-position-location"
  //           onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
  //         >
  //           <option disabled selected={newPosition}>
  //             Select
  //           </option>
  //           {locationOptions.map((o) => (
  //             <option
  //               selected={newPosition ? false : getProjectJob(currentRole).location === o}
  //             >
  //               {o}
  //             </option>
  //           ))}
  //         </select>
  //         <label className="edit-position-contact">Main Contact</label>
  //         <select className="edit-position-contact">{/* Put project lead here */}</select>
  //       </div>
  //       <div id="edit-position-details-right">
  //         <label className="edit-position-duration">Duration</label>
  //         <select
  //           className="edit-position-duration"
  //           onChange={(e) => setCurrentJob({ ...currentJob, duration: e.target.value })}
  //         >
  //           <option disabled selected={newPosition}>
  //             Select
  //           </option>
  //           {durationOptions.map((o) => (
  //             <option
  //               selected={newPosition ? false : getProjectJob(currentRole).duration === o}
  //             >
  //               {o}
  //             </option>
  //           ))}
  //         </select>
  //         <label className="edit-position-compensation">Compensation</label>
  //         <select
  //           className="edit-position-compensation"
  //           onChange={(e) => setCurrentJob({ ...currentJob, compensation: e.target.value })}
  //         >
  //           <option disabled selected={newPosition}>
  //             Select
  //           </option>
  //           {compensationOptions.map((o) => (
  //             <option
  //               selected={newPosition ? false : getProjectJob(currentRole).compensation === o}
  //             >
  //               {o}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
  //     </div>
  //   </>
  // );

  // // Check if team tab is in edit mode
  // const positionWindow = editMode === true ? positionEditWindow : positionViewWindow;

  // const teamTabContent =
  //   currentTeamTab === 0 ? (
  //     <>
  //       {
  //         <div id="project-editor-project-members">
  //           {/* List out project members */}
  //           {modifiedProject.members.map((m) => (
  //             <div className="project-editor-project-member">
  //               {/* <img className="project-member-image" src="/assets/creditProfiles/JF.png" alt="" /> */}
  //               <img
  //                 className="project-member-image"
  //                 src={`/images/profiles/${m.profile_image}`}
  //                 alt=""
  //               />
  //               <div className="project-editor-project-member-info">
  //                 <div className="project-editor-project-member-name">
  //                   {m.first_name} {m.last_name}
  //                 </div>
  //                 <div className="project-editor-project-member-role project-editor-extra-info">
  //                   {m.job_title}
  //                 </div>
  //               </div>
  //               <Popup>
  //                 <PopupButton className="edit-project-member-button">
  //                   <img
  //                     className="edit-project-member-icon"
  //                     src="/images/icons/pencil.png"
  //                     alt=""
  //                   />
  //                 </PopupButton>
  //                 <PopupContent useClose={false}>
  //                   <div id="project-team-edit-member-title">Edit Member</div>
  //                   <div
  //                     id="project-team-edit-member-card"
  //                     className="project-editor-project-member"
  //                   >
  //                     <img
  //                       className="project-member-image"
  //                       src={`/images/profiles/${m.profile_image}`}
  //                       alt=""
  //                     />
  //                     <div className="project-editor-project-member-name">
  //                       {m.first_name} {m.last_name}
  //                     </div>
  //                   </div>
  //                   <div id="project-team-add-member-role">
  //                     <label>Role</label>
  //                     <select
  //                       key={currentRole}
  //                       onChange={(e) => {
  //                         // update member's role temporarily
  //                         // TODO: make this work without onchange
  //                         const tempMember = { ...m };
  //                         tempMember.job_title = e.target.value;
  //                         setCurrentMember(tempMember);
  //                       }}
  //                     >
  //                       {allJobs.map((job: { title_id: number; label: string }) => (
  //                         <option key={job.title_id} selected={job.label === m.job_title}>
  //                           {job.label}
  //                         </option>
  //                       ))}
  //                     </select>
  //                   </div>
  //                   {/* Action buttons */}
  //                   <div className="project-editor-button-pair">
  //                     <PopupButton
  //                       buttonId="team-edit-member-save-button"
  //                       callback={() => {
  //                         // update members
  //                         const members = modifiedProject.members.map((m) =>
  //                           m.user_id === currentMember.user_id ? currentMember : m
  //                         );
  //                         setModifiedProject({ ...modifiedProject, members });
  //                       }}
  //                     >
  //                       Save
  //                     </PopupButton>
  //                     <Popup>
  //                       <PopupButton className="delete-button">Delete</PopupButton>
  //                       <PopupContent>
  //                         <div id="project-team-delete-member-title">Delete Member</div>
  //                         <div
  //                           id="project-team-delete-member-text"
  //                           className="project-editor-extra-info"
  //                         >
  //                           Are you sure you want to delete{' '}
  //                           <span className="project-info-highlight">
  //                             {m.first_name} {m.last_name}
  //                           </span>{' '}
  //                           from the project? This action cannot be undone.
  //                         </div>
  //                         <div className="project-editor-button-pair">
  //                           <button className="delete-button">Delete</button>
  //                           <PopupButton
  //                             buttonId="team-delete-member-cancel-button"
  //                             className="button-reset"
  //                           >
  //                             Cancel
  //                           </PopupButton>
  //                         </div>
  //                       </PopupContent>
  //                     </Popup>
  //                   </div>
  //                   <PopupButton
  //                     buttonId="team-edit-member-cancel-button"
  //                     className="button-reset"
  //                     callback={() => console.log(modifiedProject.members)}
  //                   >
  //                     Cancel
  //                   </PopupButton>
  //                 </PopupContent>
  //               </Popup>
  //             </div>
  //           ))}
  //           {/* Add member button */}
  //           <Popup>
  //             <PopupButton buttonId="project-editor-add-member">
  //               <img id="project-team-add-member-image" src={profileImage} alt="" />
  //               <div id="project-team-add-member-text">Add Member</div>
  //             </PopupButton>
  //             <PopupContent useClose={false}>
  //               <div id="project-team-add-member-title">Add Member</div>
  //               <div className="error" id="error-add-member">
  //                 {errorAddMember}
  //               </div>
  //               <div id="project-team-add-member-name">
  //                 <label>Name</label>
  //                 <input type="text" id="new-member-name"></input>
  //               </div>
  //               <div id="project-team-add-member-role">
  //                 <label>Role</label>
  //                 <select id="project-team-add-member-role-select" key={currentRole}>
  //                   {allJobs.map((job: { title_id: number; label: string }) => (
  //                     <option key={job.title_id} selected={job.title_id === currentRole}>
  //                       {job.label}
  //                     </option>
  //                   ))}
  //                 </select>
  //               </div>
  //               {/* Action buttons */}
  //               <div className="project-editor-button-pair">
  //                 {/* TODO: add team member to project */}
  //                 <PopupButton
  //                   buttonId="team-add-member-add-button"
  //                   callback={() => {
  //                     /*handleNewMember();*/ console.log('in callback', closePopup);
  //                   }}
  //                   doNotClose={!closePopup}
  //                 >
  //                   Add
  //                 </PopupButton>
  //                 <PopupButton buttonId="team-add-member-cancel-button" className="button-reset">
  //                   Cancel
  //                 </PopupButton>
  //               </div>
  //             </PopupContent>
  //           </Popup>
  //         </div>
  //       }
  //     </>
  //   ) : currentTeamTab === 1 ? (
  //     <>
  //       {
  //         <div id="project-team-open-positions-popup">
  //           <div className="positions-popup-list">
  //             <div id="team-positions-popup-list-header">Open Positions</div>
  //             <div id="team-positions-popup-list-buttons">
  //               {modifiedProject.jobs.map((job: { job_title: string; title_id: number }) => (
  //                 <div className="team-positions-button">
  //                   <img src="/images/icons/drag.png" alt="" />
  //                   <button
  //                     className="positions-popup-list-item"
  //                     id=""
  //                     data-id={job.title_id}
  //                     onClick={() => (!editMode ? setCurrentRole(job.title_id) : {})}
  //                   >
  //                     {job.job_title}
  //                   </button>
  //                 </div>
  //               ))}
  //               <div className="add-item-button">
  //                 <button
  //                   onClick={() => {
  //                     if (!editMode) {
  //                       setNewPosition(true);
  //                       addPositionCallback();
  //                     }
  //                   }}
  //                 >
  //                   <img src={'/images/icons/cancel.png'} alt="+" />
  //                   <span className="project-editor-extra-info">Add position</span>
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="positions-popup-info" id={editMode ? 'positions-popup-list-edit' : ''}>
  //             {positionWindow}
  //           </div>
  //         </div>
  //       }
  //     </>
  //   ) : (
  //     <></>
  //   );

  // Empty dependencies for initial load
  // useEffect(() => {
  //   console.log('default use effect run')
  //   // default to general tab
  //   setCurrentTabContent(generalTab);
  //   // default to current team tab in team tab
  //   setTeamTabContent(currentTeamContent);
  //   setPositionWindowContent(positionViewWindow);
  // }, [currentTeamContent, generalTab, positionViewWindow]);

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
