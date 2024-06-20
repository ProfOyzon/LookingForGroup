import "./pages.css";
import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { ProjectPost } from "../ProjectPost";
import { ProjectMember } from "../ProjectMember";
import { projects, profiles, posts } from "../../constants/fakeData";

// To-do:
// Figure out image displays once images are added to site
// Program onClick functions for buttons
// Create alternate version of page for project members

const projectID = 0;

//Returns user to the previous page they were viewing
//Will require a reference to the page they were on before
const previousPage = () => {
  console.log('This will let the user return to the previous page');
}

//Adds/removes currently viewed project to the user's followed projects
//Will require current user id & project id
const followProject = () => {
  console.log('This will let the user follow this project');
}

//Adds/removes current user to the list of people interested in joining the current project
//Will require current user id & project id
const addInterested = () => {
  console.log('This will add the current user to the list of people interested');
}

//Lets the user edit the 'looking for' roles
const editRoles = () => {
  console.log('This will let the member edit roles');
}

//Sends the user to the project's virtual space
const enterVirtualSpace = () => {
  console.log("This will let the member enter the project's virtual space");
}

//Lets the user create a new post for the project
const makeProjectPost = () => {
  console.log("This will let the member create a new project post");
}

const blockProject = () => {
  console.log('This will allow a user to block the current project');
}

const reportProject = () => {
  console.log('This will let the user report the project to moderators');
}

const accessSettings = () => {
  console.log('This will allow a member to access project settings if they have access');
}

const leaveProject = () => {
  console.log('This will let a project member leave a project (Likely after another confirmation)');
}

const toggleOptionDisplay = () => {
  document.getElementById("more-options-popup").classList.toggle("show");
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
  return (
    <div id='project-info-member'>
        <img id='project-picture' src={profilePlaceholder} alt=''/>

        <div id='project-header'>
          <h1 id='project-title'>{projects[projectID].name}</h1>
          <div id='header-buttons'>
            <div id='more-options'>
              <button id='more-options-button' className='white-button' onClick={toggleOptionDisplay}><img src='elipses.png' alt="..."/></button>
              <div id='more-options-popup' className='hide'>
                <button className='white-button' onClick={accessSettings}>Project Settings</button>
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
      </div>
  )
}

const Project = (props) => {
  return (
    <div id='project-page' className='page'>
      <div id='return-button-container'>
      <button id='return-button' className='white-button' onClick={previousPage}>&lt; return</button>
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