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

const projectID = 0;

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

//Returns user to the previous page they were viewing
//Will require a reference to the page they were on before
const previousPage = () => {
  window.history.back();
}

//Adds/removes currently viewed project to the user's followed projects
//Will require current user id & project id
const followProject = () => {
  console.log('This will let the user follow this project');
  //Get current user id (need session info)
  //Add project id to user's followed project list (need relevant data location)
}

//Adds/removes current user to the list of people interested in joining the current project
//Will require current user id & project id
const addInterested = () => {
  console.log('This will add the current user to the list of people interested');
  //Get current user id (need session info)
  //Add project id to user's interested project list (need relevant data location)
  //Add user to project's list of interested people (need relevant data location)
}

//Lets the user edit the 'looking for' roles
const editRoles = () => {
  console.log('This will let the member edit roles');
}

//Sends the user to the project's virtual space
const enterVirtualSpace = () => {
  console.log("This will let the member enter the project's virtual space");
  //Redirect user to virtal space, along with project id to load correct space
}

//Lets the user create a new post for the project
const makeProjectPost = () => {
  console.log("This will let the member create a new project post");
  //Open window or page for making project post
  //No prototype of this found on project page, so I will refrain from adding further for now
}

const blockProject = () => {
  console.log('This will allow a user to block the current project');
  //Get current user id
  //Add project to user's block projects list
}

const reportProject = () => {
  console.log('This will let the user report the project to moderators');
  //Get project id & user id (if user is not anonymous)
  //Send a report for admins to review filled with relevant info (need location for reports)
}

const initSettings = () => {
  settingsContainer = document.getElementById('settings-content');
  settingsRoot = createRoot(settingsContainer!);
}

//Opens or closes the settings window
// !! No longer needed due to popup component, use openClosePopup instead !!
/*const accessSettings = () => {
  document.getElementById('settings-cover').classList.toggle("show");
  document.getElementById('settings-window').classList.toggle("show");
}*/

//Closes settings window, as well as saves changed settings
const saveSettings = () => {
  console.log('Will also save current inputs to project data');
  /*document.getElementById('settings-cover').classList.toggle("show");
  document.getElementById('settings-window').classList.toggle("show");*/
  openClosePopup(0);
}

//Lets the user leave the project
const leaveProject = () => {
  console.log('This will let a project member leave a project (Likely after another confirmation)');
  //Get current user id
  //remove user from project members list
}

//Opens/closes the additional project options tab
const toggleOptionDisplay = () => {
  document.getElementById("more-options-popup").classList.toggle("show");
}

//Re-renders settings content based on clicked tab, and highlights selected tab
const changeTabs = (tab) => {
  let content = document.getElementById('settings-content');
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
const deleteProject = (callback) => {
  //Delete project from database
  callback(paths.routes.MYPROJECTS);
}

// Displays for users that are not members of the project
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

//Displays for users that are members of the project
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

/* 
      <div id='settings-cover' className='hide'/>

      <div id='settings-window' className='hide'>
          <h1>Project Settings</h1>
          <button id='settings-close' className='white-button' onClick={accessSettings}>X</button>
          <div id='settings-tabs'>
            <button id='general-tab' className='tab-selected' onClick={() => {changeTabs('general')}}>General</button>
            <button id='member-tab' className='tab' onClick={() => {changeTabs('members')}}>Members</button>
            <button id='delete-project' onClick={deleteCheck}>Delete Project</button>
          </div>
          <hr/>
          <div id='settings-content'>
          <GeneralSettings/>
          </div>
          <button id='settings-cancel' className='white-button' onClick={accessSettings}>Cancel</button>
          <button id='settings-save' className='orange-button' onClick={saveSettings}>Save</button>
      </div>
*/

const Project = (props) => {
  return (
    <div id='project-page' className='page'>
      <div id='return-button-container'>
      <button id='return-button' className='white-button' onClick={previousPage}>&lt; return</button>
      </div>

      <ProjectInfoMember/>

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