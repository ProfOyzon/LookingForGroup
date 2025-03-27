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

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Dropdown, DropdownButton, DropdownContent } from '../Dropdown';
import { Popup, PopupButton, PopupContent } from '../Popup';
import { ImageCarousel } from '../ImageCarousel';
import { ProjectCreatorEditor } from '../ProjectCreatorEditor/ProjectCreatorEditor';
import profilePicture from '../../images/blue_frog.png';
import profileImage from '../../icons/profile-user.png';
import { ProjectCarousel } from '../ProjectCarousel';
import tallImage from '../../images/tall_img.png';
import heart from '../../icons/heart.png';
import * as tags from '../../constants/tags';
import * as paths from '../../constants/routes';
import Project from './Project';
import { ThemeIcon } from '../ThemeIcon';
import { ProjectCarousel } from '../ProjectCarousel';

//To-do
//Have team member listings link to their respective profiles
//Ensure 'ProjectCreatorEditor' component is complete and works on this page for project editing (import found above)

//TODO: remove after implementing database functionality
//Variable used for checking whether or not we are running a server or not
//Should be 'true' when using npm run server, 'false' when using npm run client
const runningServer = true;

//TODO: remove after implementing database functionality
//A default set of project data for the component to use
//use while running with npm run client
const defaultProject = runningServer
  ? undefined
  : {
      title: 'Title Here',
      hook: 'Hook text Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      description: 'Description text Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      purpose: 'Insert purpose here',
      status: 'currentStatus',
      audience: 'Insert target audience here',
      project_types: [{ id: 1, project_type: 'Video Game' }],
      tags: [
        { id: 6, tag: 'Action', type: 'Creative', position: 1 },
        { id: 40, tag: 'Rogue-Like', type: 'Games', position: 2 },
        { id: 1, tag: 'Sci-Fi', type: 'Creative', position: 3 },
      ],
      jobs: [
        {
          duration: 'Short-term',
          location: 'On-site',
          title_id: 8,
          job_title: 'Video Game Developer',
          description: 'We are looking for game developers familiar with Unreal Engine 5',
          availability: 'Full-time',
          compensation: 'Paid',
        },
        {
          duration: 'Long-term',
          location: 'Remote',
          title_id: 51,
          job_title: '2D Artist',
          description: 'We are looking for artists who know how to draw bees',
          availability: 'Part-time',
          compensation: 'Paid',
        },
      ],
      members: [
        { user_id: 1, job_title: 'Project Lead', first_name: 'Lily', last_name: 'Carter' },
        { user_id: 2, job_title: '2D Artist', first_name: 'Maya', last_name: 'Bennett' },
        { user_id: 3, job_title: 'Video Game Developer', first_name: 'Aiden', last_name: 'Brooks' },
        { user_id: 4, job_title: 'Philosopher', first_name: 'Aris', last_name: 'Tottle' },
        { user_id: 5, job_title: 'Impersonator', first_name: 'Imi', last_name: 'Tatter' },
      ],
      images: [
        { id: 1, image: profilePicture, position: 1 },
        { id: 2, image: tallImage, position: 2 },
        { id: 3, image: heart, position: 3 },
      ],
    };

const NewProject = () => {
  //Navigation hook
  const navigate = useNavigate();

  //Get project ID from search parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectID = urlParams.get('projectID');

  //state variable used to check whether or not data was successfully obtained from database
  const [failCheck, setFailCheck] = useState(false);

  //Function used to get project data
  const getProjectData = async () => {
    const url = `/api/projects/${projectID}`;

    try {
      const response = await fetch(url);

      const projectData = await response.json();

      if (projectData.data[0] === undefined) {
        setFailCheck(true);
        return;
      }

      setDisplayedProject(projectData.data[0]);
    } catch (error) {
      console.error(error.message);
    }
  };

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
  const buttonContent = usersProject ? (
    <>
      {
        <>
          <ProjectCreatorEditor newProject={false} />
        </>
      }
    </>
  ) : (
    <>
      {
        <>
          <button>
            <img src={heart} />
          </button>
          <Dropdown>
            <DropdownButton>
              <ThemeIcon
                light={'assets/menu_light.png'}
                dark={'assets/menu_dark.png'}
                alt={'...'}
              />
            </DropdownButton>
            <DropdownContent rightAlign={true}>
              <button>Share</button>
              <button>Report</button>
              <button>Leave</button>
            </DropdownContent>
          </Dropdown>
        </>
      }
    </>
  );

  //Lists of users who have worked on this project
  //Members - people who actively work on the project
  const projectMembers = displayedProject === undefined ? [] : displayedProject.members;
  //Contributors - people who have helped, but aren't actively working on the project
  const projectContributors = [];
  //People list holds whatever list is currently being displayed
  //const [peopleList, setPeopleList] = useState(displayedProject === undefined ? [] : displayedProject.members);

  //HTML containing info on the members of the project
  const peopleContent =
    projectMembers.length > 0 ? (
      <>
        {projectMembers.map((user) => {
          const imgSrc = (user.profile_image) ? `images/profiles/${user.profile_image}` : profilePicture;
          
          return (
            <div
              className="project-contributor"
              onClick={() => navigate(`${paths.routes.NEWPROFILE}?userID=${user.user_id}`)}
            >
              <img className="project-contributor-profile" src={imgSrc} alt="profile" />
              <div className="project-contributor-info">
                <div className="team-member-name">
                  {user.first_name} {user.last_name}
                </div>
                <div className="team-member-role">{user.job_title}</div>
              </div>
            </div>
          );
        })}
      </>
    ) : (
      <div>Somehow, there are no team members.</div>
    );

  //HTML containing info on people who have contributed to the project (not necessarily members)
  const contributorContent =
    projectContributors !== undefined ? (
      projectContributors.length > 0 ? (
        <>
          {projectContributors.map((user) => {
            const imgSrc = (user.profile_image) ? `images/profiles/${user.profile_image}` : profilePicture;
            
            return (
              <div
                className="project-contributor"
                onClick={() => navigate(`${paths.routes.NEWPROFILE}?userID=${user.user_id}`)}
              >
                <img className="project-contributor-profile" src={imgSrc} alt="profile" />
                <div className="project-contributor-info">
                  <div>
                    {user.first_name} {user.last_name}
                  </div>
                  <div>{user.job_title}</div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div>There are no other contributors right now.</div>
      )
    ) : (
      <div>There are no other contributors right now.</div>
    );

  //State variable that tracks whether project members or contributors will be displayed
  const [displayedPeople, setDisplayedPeople] = useState('People');

  //Variable holding either 'peopleContent' or 'contributorContent', depending on 'displayedPeople' state (seen above)
  const profileContent = displayedPeople === 'People' ? peopleContent : contributorContent;

  const openPositionListing = (positionNumber: number) => {
    //Set state to position being clicked
    //Call Popup open function from other button
    setViewedPosition(positionNumber);
    const button = document.getElementById('project-open-positions-button');
    if (button) button.click();
  };

  const [viewedPosition, setViewedPosition] = useState(0);

  //Find first member with the job title of 'Project Lead'
  //If no such member exists, use first member in project member list
  const projectLead =
    displayedProject === undefined
      ? { user_id: 0, job_title: 'Default guy', first_name: 'user', last_name: 'name' }
      : displayedProject.members.some((member) => member.job_title === 'Project Lead')
        ? displayedProject.members.find((member) => member.job_title === 'Project Lead')
        : displayedProject.members[0];

  //Page layout for if project data hasn't been loaded yet
  const loadingProject = <>{<div>Loading project...</div>}</>;

  return (
    <div className="page">
      <Header dataSets={{ data: [] }} onSearch={() => {}} />

      {displayedProject === undefined ? (
        loadingProject
      ) : (
        <div id="project-page-content">
          {/* May need to adjust width/height styles to account for description/carousel sizes */}
          {/* <div id="project-image-carousel">
            <ImageCarousel carouselType="Project" dataList={displayedProject.images} />
          </div> */}
          <ProjectCarousel project={displayedProject}></ProjectCarousel>

          <div id="project-info-panel">
            <div id="project-info-header">
              <div id="project-title">{displayedProject.title}</div>
              <div id="project-info-buttons">{buttonContent}</div>
            </div>
            <div id="project-hook">{displayedProject.hook}</div>
            <div id="project-status">
              Status: <span className="project-info-highlight">{displayedProject.status} </span>
              <Popup>
                <PopupButton buttonId="project-open-positions-button">Open Positions</PopupButton>
                <PopupContent>
                  <div id="project-open-positions-popup">
                    <div id="positions-popup-header">Join The Team</div>

                    <div className="positions-popup-list">
                      <div id="positions-popup-list-header">Open Positions</div>
                      <div id="positions-popup-list-buttons">
                        {displayedProject.jobs.map((job, index) => (
                          <button
                            className={`positions-popup-list-item ${index === viewedPosition ? 'positions-popup-list-item-active' : ''}`}
                            onClick={() => setViewedPosition(index)}
                            key={index}
                          >
                            {job.job_title}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div id="positions-popup-info">
                      <div id="positions-popup-info-title">
                        {displayedProject.jobs[viewedPosition].job_title}
                      </div>
                      <div id="positions-popup-info-description">
                        <div id="position-description-header">What we are looking for:</div>
                        <div id="position-description-content">
                          {displayedProject.jobs[viewedPosition].description}
                        </div>
                      </div>
                      <div id="position-details">
                        <div id="position-availability">
                          <span className="position-detail-indicator">Availability: </span>
                          {displayedProject.jobs[viewedPosition].availability}
                        </div>
                        <div id="position-duration">
                          <span className="position-detail-indicator">Duration: </span>
                          {displayedProject.jobs[viewedPosition].duration}
                        </div>
                        <div id="position-location">
                          <span className="position-detail-indicator">Location: </span>
                          {displayedProject.jobs[viewedPosition].location}
                        </div>
                        <div id="position-compensation">
                          <span className="position-detail-indicator">Compensation: </span>
                          {displayedProject.jobs[viewedPosition].compensation}
                        </div>
                      </div>
                      <div id="position-contact">
                        If interested, please contact:{' '}
                        <span
                          onClick={() =>
                            navigate(`${paths.routes.PROFILE}?userID=${projectLead.user_id}`)
                          }
                          id="position-contact-link"
                        >
                          <img src={(projectLead.profile_image) 
                            ? `images/profiles/${projectLead.profile_image}` 
                            : profilePicture} 
                          />
                          {projectLead.first_name} {projectLead.last_name}
                        </span>
                      </div>
                    </div>

                    <PopupButton buttonId="positions-popup-close">Close</PopupButton>
                  </div>
                </PopupContent>
              </Popup>
            </div>
            <div id="project-creation">
              Created by: <span className="project-info-highlight">creator</span>
              <br />
              Creation date
            </div>
            <div id="project-tags">
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
                      </div>
                    );
                  } else if (index === 3) {
                    return (
                      <div className="project-tag-label label-grey" key={index}>
                        +{displayedProject.tags.length - 3}
                      </div>
                    );
                  }
                })
              }
            </div>
          </div>

          <div id="project-overview">
            <div id="project-overview-title">About This Project</div>
            <div id="project-overview-text">{displayedProject.description}</div>
            {/* Sections could also be added with some extra function, 
          title and content can be assigned to similar elements */}
            <div className="project-overview-section-header">Purpose</div>
            <div>{displayedProject.purpose}</div>
            <div className="project-overview-section-header">Target Audience</div>
            <div>{displayedProject.audience}</div>
            <div id="project-overview-links-section">
              Keep up with us!
              <div id="project-overview-links">
                {/* Use function to insert various links here */}
              </div>
            </div>
          </div>

          <div id="project-people">
            <div id="project-people-tabs">
              <button
                className={`project-people-tab ${displayedPeople === 'People' ? 'project-people-tab-active' : ''}`}
                onClick={(e) => setDisplayedPeople('People')}
              >
                The Team
              </button>
              {/* If contributors are added as a site feature, use the commented code below */}
              {/* <button className={`project-people-tab ${displayedPeople === 'Contributors' ? 'project-people-tab-active' : ''}`} onClick={(e) => setDisplayedPeople('Contributors')}>Contributors</button> */}
            </div>
            <div id="project-people-content">{profileContent}</div>
          </div>

          <div id="project-open-positions">
            <div id="project-open-positions-header">Open Positions</div>
            <div id="project-open-positions-list">
              {displayedProject.jobs.map((position, index) => (
                <button
                  className="project-tag-label label-position"
                  onClick={() => openPositionListing(index)}
                  key={index}
                >
                  {position.job_title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProject;
