import "./pages.css";
import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import { ProjectPost } from "../projectPageComponents/ProjectPost";
import { ProjectMember } from "../projectPageComponents/ProjectMember";
import { GeneralSettings } from "../projectPageComponents/GeneralSettings";
import { MemberSettings } from "../projectPageComponents/MemberSettings";
import { PagePopup, openClosePopup } from "../PagePopup";
import { projects, profiles, posts } from "../../constants/fakeData";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

// To-do:
// Figure out image displays once images are added to site
// Program onClick functions for buttons
// Create alternate version of page for project members

// Placeholder ID for the page to use
// Final product should be able of pull the data of any project with an id number passed in when the page loads
const projectID = 0;

// Variables to hold the element with id 'settings-content'
// Used with ReactDOM to render different settings tabs within the element
let settingsContainer;
let settingsRoot;

//Closes dropdown menus when clicking outside of them
/// !! Commented out due to it causing errors when clicking on other pages !!
/*window.onclick = function(event){
  if (!event.target.matches('#more-options-button-img')){
    let popup = document.getElementById('more-options-popup');
    if(popup.classList.contains('show')){
      popup.classList.remove('show');
    }
  }
  if (!event.target.matches('.member-settings-more') && !event.target.matches('.member-settings-more-img')){
    let popups = document.getElementsByClassName('settings-show');
    let fullLength = popups.length;
    for (let i = 0; i < fullLength; i++){
      let popup = popups[0];
      if (popup.classList.contains('settings-show')){
        popup.classList.remove('settings-show');
      }
    }
  }
}*/

// Many functions below are meant to serve as placeholders, and only call a console.log message
// This is because many of them would involve having to write/read from a completed database, which is not implemented yet
// Not all placeholders may be necessary in the final product, but they can act as a guideline for the needed functionality

//Adds/removes currently viewed project to the user's followed projects
//Will require current user id & project id
//Should only be accessible to non-project members
const followProject = () => {
  console.log('This will let the user follow this project');
  //Get current user id (need session info)
  //Add project id to user's followed project list (need relevant data location)
}

//Adds/removes current user to the list of people interested in joining the current project
//Will require current user id & project id
//Should only be accessible to non-project members
const addInterested = () => {
  console.log('This will add the current user to the list of people interested');
  //Get current user id (need session info)
  //Add project id to user's interested project list (need relevant data location)
  //Add user to project's list of interested people (need relevant data location)
}

//Lets the user edit the roles this project is 'looking for'
//Should only be accessible to admins of a project
const editRoles = () => {
  console.log('This will let the member edit roles');
}

//Sends the user to the project's virtual space
//Should only be accessible to project members
const enterVirtualSpace = () => {
  console.log("This will let the member enter the project's virtual space");
  //Redirect user to virtal space, along with project id to load correct space
}

//Lets the user create a new post for the project
//Should only be accessible to project members and/or admins
const makeProjectPost = () => {
  console.log("This will let the member create a new project post");
  //Open window or page for making project post
  //No prototype of this found on project page, so I will refrain from adding further for now
}

//Lets the user block this project, preventing it from appearing for them
//Should only be accessible to non-project members
const blockProject = () => {
  console.log('This will allow a user to block the current project');
  //Get current user id
  //Add project to user's block projects list
}

//Lets the user open a report popup, which can then be used to report an inappropriate project to site admins
//Should only be accessible to non-project members
const reportProject = () => {
  console.log('This will let the user report the project to moderators');
  //Get project id & user id (if user is not anonymous)
  //Send a report for admins to review filled with relevant info (need location for reports)
}

//Initializes and sets up the 'settings-content' element to allow for re-rendering its content when swapping tabs
//This is necessary for the page to run with the current version of react (v18.0)
const initSettings = () => {
  settingsContainer = document.getElementById('settings-content');
  settingsRoot = createRoot(settingsContainer!);
}

//Closes settings window and saves changed settings
//Will require code to take the input from settings and write to the database
const saveSettings = () => {
  console.log('Will also save current inputs to project data');

  //Closes the settings popup
  openClosePopup(0);
}

//Lets the user leave the project
//Should only be accessible to project members
const leaveProject = () => {
  console.log('This will let a project member leave a project (Likely after another confirmation)');
  //Get current user id
  //remove user from project members list
}

//Opens/closes the additional project options dropdown menu
//Works for both the project member and non-project member views
//  Errors caused by 'document.getElementById()' functions are errors highlighted by typescript
//  This is only a warning, the code still functions correctly
//  The warning is due to the elements being called *potentially* not existing
//  Ideally, this should never be the case with how the code is currently organized
const toggleOptionDisplay = () => {
  document.getElementById("more-options-popup").classList.toggle("show");
}

//Re-renders settings content based on clicked tab, and highlights selected tab
//tab = the identifier for which settings component to render
//  Currently, inputs given on one tab will revert to current default when swapping
//  This may need to be changed in the future

//  Could potentially be reworked using react's 'useState' functionality

// Utilizes the 'GeneralSettings' and 'MemberSettings' components for the separate tab renders
const changeTabs = (tab) => {
  if (settingsContainer === undefined){
    initSettings();
  }
  if (tab === 'general'){
    settingsRoot.render(<GeneralSettings projectID={projectID}/>);
    document.getElementById('general-tab').className = 'tab-selected';
    document.getElementById('member-tab').className = 'tab';
  } else if (tab === 'members'){
    settingsRoot.render(<MemberSettings/>);
    document.getElementById('member-tab').className = 'tab-selected';
    document.getElementById('general-tab').className = 'tab';
  }
}

//Removes project from database and redirects user
//Ensure that all other functions come before the redirect function, as changing pages may stop the funciton
//Should only be accessible to the project's creator
const deleteProject = (callback) => {
  //Close popups
  openClosePopup(1);
  openClosePopup(0);
  //Delete project from database

  //Redirect to the MyProjects page
  callback(paths.routes.MYPROJECTS);
}

// Page header that displays for users that are not members of the project
// Includes options to follow, block, report, or show interest in joining the project
// When loading page, should check to see if the current user is part of the loaded project to determine which header to load
const ProjectInfo = (props) => {
  return (
    <div id='project-info'>
      <img id='project-picture' src={profilePlaceholder} alt=''/>

      <div id='project-header'>
        <h1 id='project-title'>{projects[projectID].name}</h1>
        <div id='header-buttons'>
          <button id='follow-project' className='orange-button' onClick={followProject}>Follow</button>
          <div id='more-options'>
            <button id='more-options-button' className='white-button' onClick={toggleOptionDisplay}><img src='elipses.png' alt="..."/></button>
            <div id='more-options-popup' className='hide'>
              <button className='white-button' onClick={blockProject}>Block</button>
              <button className='white-button' onClick={reportProject}>Report</button>
            </div>
          </div>
        </div>
      </div>

      <p id='project-desc'>{projects[projectID].description}
      </p>

      <div id='project-listings'>
        <h3>Looking for</h3>
        <hr/>
        {
          projects[projectID].neededRoles.map(role => {
            return(
              <div>{role.Role} &#40;{role.amount}&#41;</div>
            );
          })
        }

        <button id='interested-button' className='white-button' onClick={addInterested}>Interested</button>
      </div>
    </div>
  )
}

// Page header that displays for users that are members of the project
// Includes options to access project settings, leave the project, and edit what is displayed in the 'looking for' window
// May need further variants depending on whether the user is a regular member, an admin, or the owner
// When loading page, should check to see if the current user is part of the loaded project to determine which header to load

// Utilizes the 'PagePopup' component for project settings, and 'GeneralSettings' as the first rendered tab within it
const ProjectInfoMember = (props) => {
  const navigate = useNavigate(); // Hook for navigation
  return (
    <div id='project-info-member'>
      <img id='project-picture' src={profilePlaceholder} alt=''/>


      <div id='project-header'>
        <h1 id='project-title'>{projects[projectID].name}</h1>
        <div id='header-buttons'>
          <div id='more-options'>
            <button id='more-options-button' className='white-button' onClick={toggleOptionDisplay}>
              <img id='more-options-button-img' src='elipses.png' alt="..."/></button>
            <div id='more-options-popup' className='hide'>
              <button className='white-button' onClick={() => openClosePopup(0)}>Project Settings</button>
              <button className='white-button' onClick={leaveProject}>Leave Project</button>
            </div>
          </div>
        </div>
      </div>

      <p id='project-desc'>{projects[projectID].description}
      </p>

      <div id='member-buttons'>
        <button id='virtual-space-entrance' className='white-button' onClick={enterVirtualSpace}>Enter virtual space</button>
        <button id='make-post-button' className='white-button' onClick={makeProjectPost}>+ New Post</button>
      </div>

      <div id='project-listings'>
        <h3>Looking for</h3>
        <hr/>
        {
          projects[projectID].neededRoles.map(role => {
            return(
              <div>{role.Role} &#40;{role.amount}&#41;</div>
            );
          })
        }

        <button id='edit-roles-button' className='white-button' onClick={editRoles}>Edit Roles</button>
      </div>

      <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={2}>
        <div id='settings-window-test'>
            <h1>Project Settings</h1>
            <div id='settings-tabs'>
              <button id='general-tab' className='tab-selected' onClick={() => {changeTabs('general')}}>General</button>
              <button id='member-tab' className='tab' onClick={() => {changeTabs('members')}}>Members</button>
              <button id='delete-project' onClick={() => openClosePopup(1)}>Delete Project</button>
            </div>
            <hr/>
            <div id='settings-content'>
            <GeneralSettings/>
            </div>
            <button id='settings-cancel' className='white-button' onClick={() => openClosePopup(0)}>Cancel</button>
            <button id='settings-save' className='orange-button' onClick={saveSettings}>Save</button>
        </div>
      </PagePopup>

      <PagePopup width={'300px'} height={'150px'} popupId={1} zIndex={3}>
        <div id='project-delete-check'>
          <h3>Are you sure you want to delete this project?</h3>
          <button id='project-delete-cancel' onClick={() => openClosePopup(1)}>Cancel</button>
          <button id='project-delete-final' onClick={() => deleteProject(navigate)}>DELETE</button>
        </div>
      </PagePopup>
      
    </div>
  )
}

// Main content of the Project page, which is exported from this file
// When loading page, should check to see if the current user is part of the loaded project to determine which header to load
// Utilizes the 'ProjectInfo' and 'ProjectInfoMember' components for headers, 'ProjectMember' component for listing project members,
//    and 'ProjectPost' component for displaying posts the project has made
const Project = (props) => {
  window.scrollTo(0,0);
  return (
    <div id='project-page' className='page'>
      <div id='return-button-container'>
      <button id='return-button' className='white-button' onClick={() => window.history.back()}>&lt; return</button>
      </div>

      <ProjectInfo/>

      <div id='member-divider'>
        <hr/>
        <span>Members</span>
        <hr/>
      </div>
      

      <div id='project-members'>
        {
          projects[projectID].members.map(member => {
            return (
              <ProjectMember onClick={() => window.location.href="profile"} name={profiles[member.userID].name} role={member.role} />
            );
          })
        }
      </div>
      <hr/>

      <div id='project-posts'>
        {
          projects[projectID].posts.map(postNum => {
            return(
              <ProjectPost title={posts[postNum].title} date={posts[postNum].createdDate} />
            );
          })
        }
      </div>
    </div>
  );
}

export default Project;