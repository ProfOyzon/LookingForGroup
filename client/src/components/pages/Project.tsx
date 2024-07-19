import "./pages.css";
import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as paths from "../../constants/routes";
import { ProjectPost } from "../projectPageComponents/ProjectPost";
import { ProjectMember } from "../projectPageComponents/ProjectMember";
import { GeneralSettings } from "../projectPageComponents/GeneralSettings";
import { MemberSettings } from "../projectPageComponents/MemberSettings";
import { PagePopup, openClosePopup } from "../PagePopup";
import { projects, posts } from "../../constants/fakeData";
import { wait } from "@testing-library/user-event/dist/utils";

//This is the Project page component, which contains a layout that allows for displaying project info
//More info and comments on individual parts are found above their respective parts

// holds the id number of the current project being displayed. Used to reference the database.
let projectId;

// Data for a dummy project, used when re-rendering the page after saving settings
const dummyProject = {
  _id: -1,
        name: "dummy project",
        members: [
            {
                userID: 0,
                admin: true,
                owner: true,
                role: "Project Lead"
            },
        ],
        description: "dummy project",
        tags: ["dummy", "project"],
        neededRoles: [
            {
                Role: "dummy",
                amount: 2,
                description: "dummy project",
            },
        ],
        posts: []
}

// default settings for the project being loaded, used when loading default data for settings
let defaultSettings = {
  projectName: '',
  projectMembers: []
}

// object containing the current inputs of settings, used when changing and updating project settings
// If settings window is closed, this should be reset using defaultSettings
let tempSettings;

// used with settings, identifies which tab user is currently on
let currentTab = 'general';

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

//Lets the user leave the project
//Should only be accessible to project members
const leaveProject = () => {
  console.log('This will let a project member leave a project (Likely after another confirmation)');
  //Get current user id
  //remove user from project members list
}

//Opens/closes the additional project options dropdown menu
//Works for both the project member and non-project member views
const toggleOptionDisplay = () => {
  //document.getElementById("more-options-popup").classList.toggle("show");
  let popup = document.getElementById("more-options-popup");
  popup ? popup.classList.toggle("show") : console.log('element not found');
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

// projectName, projectDescription, and neededRoles are passed in through props
// All 3 are pulled from project data before they are passed through, which can be seen in the Project component below
const ProjectInfo = (props) => {
  let key = 0; //key is not required for functionality, but react will give an error without it when using the .map function later
  return (
    <div id='project-info'>
      <img id='project-picture' src={profilePlaceholder} alt=''/>

      <div id='project-header'>
        <h1 id='project-title'>{props.projectName}</h1>
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

      <p id='project-desc'>{props.projectDescription}
      </p>

      <div id='project-listings'>
        <h3>Looking for</h3>
        <hr/>
        {
          props.neededRoles.map(role => {
            return(
              <div key={key++}>{role.Role} &#40;{role.amount}&#41;</div>
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
// projectName, projectDescription, and neededRoles are passed in through props
// All 3 are pulled from project data before they are passed through, which can be seen in the Project component below
const ProjectInfoMember = (props) => {
  const navigate = useNavigate(); // Hook for navigation
  // Resets the settingsContainer to ensure settings content loads correctly
  // No longer needed with new useState implementation
  //settingsContainer = undefined; 

  let key = 0; //key is not required for functionality, but react will give an error without it when using the .map function later

  //Store settings tab components for switching between tabs
  let generalTab = <GeneralSettings projectId={projectId} tempSettings={tempSettings}/>
  let membersTab = <MemberSettings projectId={projectId} tempSettings={tempSettings}/>

  //useState is used here as part of the settings window
  let [tabContent, setTabContent] = useState(generalTab);

  //Function used to update a specific member's setting
  //'setting' indicates what setting is being modified
  // 0 - member role; 1 - toggle admin; 2 - toggle mentor(?); 3 - remove member; 4 - undo remove member;
  //'memberId' indicates which member to change via their id
  //'roleName' holds whatever new role name will be used if 'setting' is 0
  //nothing needs to be passed into 'rolename' if 'setting' is anything other than 0
  const updateMemberSettings = (setting, memberId, roleName = undefined) => {
    let editingMember = tempSettings.projectMembers.find(member => member._id === memberId);
    if (editingMember === undefined){
      console.log('member not found');
    }
    switch(setting){
      case 0:
        if (roleName !== undefined) {
          editingMember.role = roleName;
        }
        break;
      case 1:
        editingMember.admin ? editingMember.admin = false : editingMember.admin = true;
        break;
      case 2:
        //Meant to toggle mentor role, but no such thing appears in data at the moment
        console.log('mentor toggle');
        break;
      case 3:
        tempSettings.projectMembers.splice(tempSettings.projectMembers.indexOf(editingMember), 1);
        break;
      case 4:
        let deletedMember = defaultSettings.projectMembers.find(member => member._id === memberId);
        //Need to find way to insert deleted member into the same index it was originally in
        break;
      default:
        return;
    }
  }

  //Opens settings and resets any setting inputs from previous opening
  const openSettings = () => {
    tempSettings = JSON.parse(JSON.stringify(defaultSettings)); //Json manipulation here is to help create a deep copy of the settings object
    if (currentTab === 'general') {
      let nameInput = document.getElementById('name-edit');
      nameInput ? nameInput.value = defaultSettings.projectName : console.log('error');
    } else if (currentTab === 'members') {
      //Next 4 lines are a very roundabout way to reset the input in general tab
      //If you find a cleaner solution, *please* implement it
      setTabContent(generalTab);
      let nameInput = document.getElementById('name-edit');
      nameInput ? nameInput.value = defaultSettings.projectName : console.log('error');
      setTabContent(membersTab);
    }
    openClosePopup(0)
  }

  //Updates tempSettings with any inputted setting changes, called when switching tabs or when saving settings
  const updateSettings = () => {
    if (currentTab === 'general') {
      let nameInput = document.getElementById('name-edit');
      nameInput ? tempSettings.projectName = nameInput.value : console.log('error');
    } else if (currentTab === 'members') {

    }
  }

  //Closes settings window and saves changed settings
  //Will require code to take the input from settings and write to the database
  //Maybe have save button send a signal to parent component?
  const saveSettings = () => {
    updateSettings();
    let currentProject = projects.find(p => p._id === Number(projectId));
    currentProject ? currentProject.name = tempSettings.projectName : console.log('error');
    defaultSettings = tempSettings;

    props.callback();
    //State IS being set here, but dislpay isn't updating
    
    //Closes the settings popup
    openClosePopup(0);
  }

  //Called when a tab is changed in the settings window
  //tab - a string value denoting which tab is being switched to.
  const changeTabs = (tab) => {
    if (tab === 'general') {
      currentTab = 'general';
      setTabContent(generalTab);
      let generalTabElement = document.getElementById('general-tab');
      let memberTabElement = document.getElementById('member-tab');
      if (generalTabElement && memberTabElement){
        generalTabElement.className = 'tab-selected';
        memberTabElement.className = 'tab';
      }
    } else if (tab === 'members') {
      updateSettings();
      currentTab = 'members';
      setTabContent(membersTab);
      let generalTabElement = document.getElementById('general-tab');
      let memberTabElement = document.getElementById('member-tab');
      if (generalTabElement && memberTabElement){
        generalTabElement.className = 'tab';
        memberTabElement.className = 'tab-selected';
      }
    }
  }

  return (
    <div id='project-info-member'>
      <img id='project-picture' src={profilePlaceholder} alt=''/>


      <div id='project-header'>
        <h1 id='project-title'>{props.projectName}</h1>
        <div id='header-buttons'>
          <div id='more-options'>
            <button id='more-options-button' className='white-button' onClick={toggleOptionDisplay}>
              <img id='more-options-button-img' src='elipses.png' alt="..."/></button>
            <div id='more-options-popup' className='hide'>
              <button className='white-button' onClick={openSettings}>Project Settings</button>
              <button className='white-button' onClick={leaveProject}>Leave Project</button>
            </div>
          </div>
        </div>
      </div>

      <p id='project-desc'>{props.projectDescription}
      </p>

      <div id='member-buttons'>
        <button id='virtual-space-entrance' className='white-button' onClick={enterVirtualSpace}>Enter virtual space</button>
        <button id='make-post-button' className='white-button' onClick={makeProjectPost}>+ New Post</button>
      </div>

      <div id='project-listings'>
        <h3>Looking for</h3>
        <hr/>
        {
          props.neededRoles.map(role => {
            return(
              <div key={key++}>{role.Role} &#40;{role.amount}&#41;</div>
            );
          })
        }

        <button id='edit-roles-button' className='white-button' onClick={editRoles}>Edit Roles</button>
      </div>

      <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3}>
        <div id='settings-window-test'>
            <h1>Project Settings</h1>
            <div id='settings-tabs'>
              <button id='general-tab' className='tab-selected' onClick={() => {changeTabs('general')}}>General</button>
              <button id='member-tab' className='tab' onClick={() => {changeTabs('members')}}>Members</button>
              <button id='delete-project' onClick={() => openClosePopup(1)}>Delete Project</button>
            </div>
            <hr/>
            <div id='settings-content'>
            {tabContent}
            </div>
            <button id='settings-cancel' className='white-button' onClick={() => openClosePopup(0)}>Cancel</button>
            <button id='settings-save' className='orange-button' onClick={saveSettings}>Save</button>
        </div>
      </PagePopup>

      <PagePopup width={'300px'} height={'150px'} popupId={1} zIndex={4}>
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

// No data is passed in through props

// The 'select' element is for testing different projects with this layout, it should not be included in the final product
const Project = (props) => {
  window.scrollTo(0,0);

  let keys = [0, 0, 0]; //keys are not required for functionality, but react will give an error without it when using .map functions later

  //Pulls project ID number from search query (should be stored as 'p')
  //(ex. [site path]/project?p=x , where x = the project ID number)
  let urlParams = new URLSearchParams(window.location.search);
  projectId = urlParams.get('projID');

  //If search query doesn't yield anything, resort to a default project
  if (projectId === null) {
    console.log('No query in url, loading default');
    projectId = '0';
  }

  //Find project using project ID
  const currentProject = projects.find(p => p._id === Number(projectId)) || projects[0];

  //Pass project settings into variables for use in settings tabs
  defaultSettings.projectName = currentProject.name;
  currentProject.members.forEach(member => {
    defaultSettings.projectMembers.push(member);
  });
  tempSettings = JSON.parse(JSON.stringify(defaultSettings));
  console.log(defaultSettings.projectMembers);

  //Pass project data for rendering purposes
  const [projectData, setProjectData] = useState(currentProject);

  //Workaround function to update data on a project save
  //Necessary due to how setting useState variables works
  //If there's a better solution for this, please use it.
  const resetProjectData = () => {
    //First line is to change state to something other than what's being used
    //If it were set to the same project as before, it wouldn't recognize it as a change & wouldn't do anything
    setProjectData(dummyProject);
    //Second line delays the resetting of the project data
    //This is due to the set state function being partly asynchronous, and this allows the first line to finish before continuing
    setTimeout(() => {setProjectData(projects.find(p => p._id === Number(projectId)) || projects[0])}, 1);
  }

  return (
    <div id='project-page' className='page'>

      <select onChange={e => {
        setProjectData(projects[e.target.value]);
      }}>
        {
          projects.map(project => {
            return(
              <option value={project._id} key={keys[0]++}>{project.name}</option>
            )
          })
        }
      </select>

      <div id='return-button-container'>
      <button id='return-button' className='white-button' onClick={() => window.history.back()}>&lt; return</button>
      </div>

      <ProjectInfoMember projectName={projectData.name} projectDescription={projectData.description} 
        neededRoles={projectData.neededRoles} callback={resetProjectData} projectData={projectData}/>

      <div id='member-divider'>
        <hr/>
        <span>Members</span>
        <hr/>
      </div>
      

      <div id='project-members'>
        {
          projectData.members.map(member => {
            return (
              <ProjectMember onClick={() => window.location.href="profile"} memberId={member.userID} role={member.role}  key={keys[1]++}/>
            );
          })
        }
      </div>
      <hr/>

      <div id='project-posts'>
        {
          projectData.posts.map(postNum => {
            return(
              <ProjectPost postID={posts[postNum]._id} key={keys[2]++}/>
            );
          })
        }
      </div>
    </div>
  );
}

export default Project;