import "./pages.css";
import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { ProjectPost } from "../ProjectPost";
import { ProjectMember } from "../ProjectMember";
import { projects, profiles, posts } from "../../constants/fakeData";

// To-do:
// Add scrolling to members element when numerous members are present
// Figure out image displays once images are added to site
// Program onClick functions for buttons
// Add style rules to buttons

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

const Project = (props) => {
  return (
    <div className='page'>
      <div id='return-button-container'>
      <button id='return-button' className='white-button' onClick={previousPage}>&lt; return</button>
      </div>

      <div id='project-info'>
        <img id='project-picture' src={profilePlaceholder} alt=''/>

        <div id='project-header'>
          <h1 id='project-title'>{projects[0].name}</h1>
          <div id='header-buttons'>
            <button id='follow-project' onClick={followProject}>Follow</button>
            <div id='more-options'>
              <button id='more-options-button' className='white-button'><img src='elipses.png' alt="..."/></button>
              <div id='more-options-popup'>Sample text</div>
            </div>
          </div>
        </div>

        <p id='project-desc'>{projects[0].name}
        </p>

        <div id='project-listings'>
          <h3>Looking for</h3>
          <hr/>
          {
            projects[0].neededRoles.map(role => {
              return(
                <div>{role.Role} &#40;{role.amount}&#41;</div>
              );
            })
          }

          <button id='interested-button' className='white-button' onClick={addInterested}>Interested</button>
        </div>
      </div>

      <hr/>

      <div id='project-members'>
        {
          projects[0].members.map(member => {
            return (
              <ProjectMember name={profiles[member.userID].name} role={member.role} />
            );
          })
        }
      </div>
      <hr/>

      <div id='project-posts'>
        {
          projects[0].posts.map(postNum => {
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