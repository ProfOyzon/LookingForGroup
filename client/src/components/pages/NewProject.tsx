import "./pages.css";
import "../Styles/styles.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../Header";
import { Dropdown, DropdownButton, DropdownContent } from "../Dropdown";
import { Popup, PopupButton, PopupContent } from "../Popup";
import { ImageCarousel } from "../ImageCarousel";
import profilePicture from "../../images/blue_frog.png";
import profileImage from "../../icons/profile-user.png";
import tallImage from "../../images/tall_img.png";
import heart from "../../icons/heart.png";
import menu from "../../icons/menu.png";
import menuImage from "../../icons/menu.png";
import * as tags from "../../constants/tags";

//Variable used for checking whether or not we are running a server or not
//Should be 'true' when using npm run server, 'false' when using npm run client
let runningServer = true;

//A default set of project data for the component to use
//use while running with npm run client
let defaultProject = runningServer ? undefined : {
  title: 'Title Here',
  hook: 'Hook text Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  description: 'Description text Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  purpose: 'Insert purpose here',
  status: 'currentStatus',
  audience: 'Insert target audience here',
  project_types: [
    {id: 1, project_type: 'Video Game'},
  ],
  tags: [
    {id: 6, tag: "Action", type: "Creative", position: 1},
    {id: 40, tag: "Rogue-Like", type: "Games", position: 2},
    {id: 1, tag: "Sci-Fi", type: "Creative", position: 3},
  ],
  jobs: [
    {
      duration: 'Short-term',
      location: 'On-site',
      title_id: 8,
      job_title: "Video Game Developer",
      description: "We are looking for game developers familiar with Unreal Engine 5",
      availability: "Full-time",
      compensation: "Paid",
    },
    {
      duration: 'Short-term',
      location: 'On-site',
      title_id: 51,
      job_title: "2D Artist",
      description: "We are looking for artists who know how to draw bees",
      availability: "Full-time",
      compensation: "Paid",
    },
  ],
  members: [
    {user_id: 1, job_title: 'Project Lead', first_name: 'Lily', last_name: 'Carter'},
    {user_id: 2, job_title: '2D Artist', first_name: 'Maya', last_name: 'Bennett'},
    {user_id: 3, job_title: 'Video Game Developer', first_name: 'Aiden', last_name: 'Brooks'},
    {user_id: 4, job_title: 'Philosopher', first_name: 'Aris', last_name: 'Tottle'},
    {user_id: 5, job_title: 'Impersonator', first_name: 'Imi', last_name: 'Tatter'},
  ],
  images: [
    {id: 1, image: profilePicture, position: 1},
    {id: 2, image: tallImage, position: 2},
    {id: 3, image: heart, position: 3},
  ]
}

const NewProject = () => {
  //Get project ID from search parameters
  let urlParams = new URLSearchParams(window.location.search)
  let projectID = urlParams.get('projectID');

  //state variable used to check whether or not data was successfully obtained from database
  let [failCheck, setFailCheck] = useState(false);

  //Function used to get project data
  const getProjectData = async () => {
    const url = `/api/projects/${projectID}`;

    try {
      let response = await fetch(url);

      const projectData = await response.json();

      if(projectData.data[0] === undefined){
        setFailCheck(true);
        return;
      }

      setDisplayedProject(projectData.data[0]);
    } catch (error) {
      console.error(error.message);
    }
  }

  //State variable holding information on the project to be displayed
  const [displayedProject, setDisplayedProject] = useState(defaultProject);

  //Gets data from database on a specific project
  if (displayedProject === undefined) {
    getProjectData();
  }

  //Checks to see whether or not the current user is the maker/owner of the project being displayed
  const usersProject = true;

  //HTML elements containing buttons used in the info panel
  //Change depending on who's viewing the project page (Outside user, project member, project owner, etc.)
  const buttonContent = usersProject ? <>{
    <>
      <Popup>
        <PopupButton buttonId='project-info-edit'>Edit Project</PopupButton>
        <PopupContent>
          Not sure what to put here yet, still working on main page content
        </PopupContent>
      </Popup>
    </>
  }</> : <>{
    <>
      <button><img src={heart}/></button>
      <Dropdown>
        <DropdownButton><img src={menu}/></DropdownButton>
        <DropdownContent rightAlign={true}>
          <button>Share</button>
          <button>Report</button>
          <button>Leave</button>
        </DropdownContent>
      </Dropdown>
    </>
  }</>

  //Lists of users who have worked on this project
  //Members - people who actively work on the project
  const projectMembers = displayedProject === undefined ? [] : displayedProject.members;
  //Contributors - people who have helped, but aren't actively working on the project
  const projectContributors = [];
  //People list holds whatever list is currently being displayed
  //const [peopleList, setPeopleList] = useState(displayedProject === undefined ? [] : displayedProject.members);

  //HTML containing info on the members of the project
  const peopleContent = projectMembers.length > 0 ? <>{
    projectMembers.map((user) => (
      <div className='project-contributor'>
        <img className='project-contributor-profile' src={profilePicture}/>
        <div className='project-contributor-info'>
          <div>{user.first_name} {user.last_name}</div>
          <div>{user.job_title}</div>
        </div>
      </div>
    ))
  }</> : <div>Somehow, there are no team members.</div>

  //HTML containing info on people who have contributed to the project (not necessarily members)
  const contributorContent = projectContributors != undefined ? projectContributors.length > 0 ? <>{
    projectContributors.map((user) => (
      <div className='project-contributor'>
        <img className='project-contributor-profile' src={profilePicture}/>
        <div className='project-contributor-info'>
          <div>{user.first_name} {user.last_name}</div>
          <div>{user.job_title}</div>
        </div>
      </div>
    ))
  }</> : <div>There are no other contributors right now.</div> : <div>There are no other contributors right now.</div>

  //State variable that tracks whether project members or contributors will be displayed
  const [displayedPeople, setDisplayedPeople] = useState('People');

  //Variable holding either 'peopleContent' or 'contributorContent', depending on 'displayedPeople' state (seen above)
  const profileContent = displayedPeople === 'People' ? peopleContent : contributorContent;

  //Funciton to handle switching tabs for project contributors
  //Updates tab display as well as the content underneath
  const handlePeopleTabChange = (e, newTab) => {

  }

  //Page layout for if project data hasn't been loaded yet
  let loadingProject = <>{
    <div>
      Loading project...
    </div>
  }</>

  return (
    <div className='page'>
      <Header dataSets={{data:[]}} onSearch={() => {}}/>
      
      {displayedProject === undefined ? loadingProject : 
      <div id='project-page-content'>
        {/* May need to adjust width/height styles to account for description/carousel sizes */}
        <div id='project-image-carousel'>
          <ImageCarousel carouselType='Project' dataList={displayedProject.images}/>
        </div>

        <div id='project-info-panel'>
          <div id='project-info-header'>
            <div id='project-title'>{displayedProject.title}</div>
            <div id='project-info-buttons'>{buttonContent}</div>
          </div>
          <div id='project-hook'>
            {displayedProject.hook}
          </div>
          <div id='project-status'>
            Status: <span className='project-info-highlight'>{displayedProject.status} </span> 
            <button id='project-open-positions-button'>Open Positions</button>
          </div>
          <div id='project-creation'>
            Created by: <span className='project-info-highlight'>creator</span><br/>
            Creation date
          </div>
          <div id='project-tags'>
            {
              //If more tag types are usable, use commented code for cases
              //Also, check to see how many additional tags a project has
              displayedProject.tags.map((tag, index) => {
                /* let category : string;
                switch (tag.type) {
                } */
                if (index < 3) {
                  return (
                    <div className={`project-tag-label label-green`} key={index}>
                      {tag.tag}
                    </div> )
                } else if (index === 3) {
                  return (
                    <div className='project-tag-label label-grey' key={index}>+{displayedProject.tags.length - 3}</div>
                  )
                }
              })
            }
          </div>
        </div>

        <div id='project-overview'>
          <div id='project-overview-title'>About This Project</div>
          <div id='project-overview-text'>
            {displayedProject.description}
          </div>
          {/* Sections could also be added with some extra function, 
          title and content can be assigned to similar elements */}
          <div className='project-overview-section-header'>Purpose</div>
          <div>
            {displayedProject.purpose}
          </div>
          <div className='project-overview-section-header'>Target Audience</div>
          <div>
            {displayedProject.audience}
          </div>
          <div id='project-overview-links-section'>
            Keep up with us!
            <div id='project-overview-links'>
              {/* Use function to insert various links here */}
            </div>
          </div>
        </div>

        <div id='project-people'>
          <div id='project-people-tabs'>
            <button className={`project-people-tab ${displayedPeople === 'People' ? 'project-people-tab-active': ''}`} onClick={(e) => setDisplayedPeople('People')}>The Team</button>
            <button className={`project-people-tab ${displayedPeople === 'Contributors' ? 'project-people-tab-active': ''}`} onClick={(e) => setDisplayedPeople('Contributors')}>Contributors</button>
          </div>
          <div id='project-people-content'>
            {profileContent}
          </div>
        </div>

        <div id='project-open-positions'>
          <div id='project-open-positions-header'>Open Positions</div>
          <div id='project-open-positions-list'>
            {
              displayedProject.jobs.map((position) => (
                <div className='project-tag-label label-grey'>{position.job_title}</div>
              ))
            }
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default NewProject;