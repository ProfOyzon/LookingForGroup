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

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { PanelBox } from '../PanelBox';
import { ProfileEditPopup } from '../Profile/ProfileEditPopup';
import { Dropdown, DropdownButton, DropdownContent } from '../Dropdown';
import profilePicture from '../../images/blue_frog.png';
import EditButton from '../Profile/ProfileEditButton';
import { ThemeIcon } from '../ThemeIcon';

const NewProfile = () => {
  // --------------------
  // Interfaces
  // --------------------
  interface Project {
    name: string;
    hook: string;
  }

  interface Tag {
    type: string;
    skill: string;
  }

  interface Profile {
    first_name: string;
    last_name: string;
    username: string;
    profile_image: HTMLImageElement;
    headline: string;
    pronouns: string;
    job_title: string;
    major: string;
    academic_year: string;
    location: string;
    fun_fact: string;
    bio: string;
    skills: Tag[];
  }

  // --------------------
  // Global variables
  // --------------------
  // Just to prevent typescript errors
  const skillsStr = ['Figma', 'JavaScript', 'Visual Studio Code', 'Flexibility', 'Krita'];
  const skills: Tag[] = skillsStr.map((skillStr) => {
    return { type: 'Soft', skill: skillStr };
  });
  const defaultProfile: Profile = {
    first_name: 'User',
    last_name: 'Name',
    username: 'someguy',
    profile_image: profilePicture,
    headline: `Here's a quick lil blurb about me!`,
    pronouns: 'Was/Were',
    job_title: 'Profession',
    major: 'Professional Typer',
    academic_year: '13th',
    location: 'Middle of, Nowhere',
    fun_fact: `I'm not a real person, I'm just a digital representation of one!`,
    bio: 'A bunch of Lorem Ipsum text, not bothering to type it out.',
    skills: skills,
  };

  //const location = useLocation();

  // Get URL parameters to tell what user we're looking for and store it
  const urlParams = new URLSearchParams(window.location.search);
  let profileID = urlParams.get('userID');

  // Stores if profile is loaded from server and if it's user's respectively
  const [profileLoaded, setProfileLoaded] = useState(false);
  let userID: number;
  let isUsersProfile: boolean = false;

  let displayedProfile: Profile;
  let setDisplayedProfile: Function;
  [displayedProfile, setDisplayedProfile] = useState(defaultProfile);

  // Project variables
  let fullProjectList, displayedProjects: Project[];
  let setFullProjectList, setDisplayedProjects: Function;
  // Former stores all projects, latter only stores ones to be displayed so you can do searches
  [fullProjectList, setFullProjectList] = useState([]);
  [displayedProjects, setDisplayedProjects] = useState([]);

  const projectSearchData = fullProjectList.map((project) => {
    return { name: project.title, description: project.hook };
  });

  // --------------------
  // Helper functions
  // --------------------
  // Get the profileID to pull data for whoever's profile it is
  const setUpProfileID = () => {
    profileID = urlParams.get('userID');
    // If no profileID is in search query, set to be current user
    if (profileID === undefined || profileID === null) {
      profileID = userID;
      isUsersProfile = true;
    } else {
      isUsersProfile = `${profileID}` === `${userID}`;
    }
    console.log(`profileID: ${profileID}, userID: ${userID}`);
    console.log(`isUsersProfile: ${isUsersProfile}`);
    
  };

  // Gets the userID
  const fetchUserID = async () => {
    const response = await fetch('/api/auth');
    const { data } = await response.json();
    return data;
  };

  // Gets the profile data
  const getProfileData = async () => {
    userID = await fetchUserID();
    
    isUsersProfile = `${userID}` === profileID; 
    setUpProfileID();
    const url = `/api/users/${profileID}`;

    try {
      const response = await fetch(url);
      const { data } = await response.json();

      // Only run this if profile data exists for user
      if (data[0] !== undefined) {
        setDisplayedProfile(data[0]);
        await getProfileProjectData();
      }

      setProfileLoaded(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(`Unknown error: ${error}`);
      }
    }
  };

  const getProfileProjectData = async () => {
    let url = `/api/users/${profileID}/projects`;

    // Only get visible projects when not the user's profile
    if (!isUsersProfile) {
      url += '/profile';
    }

    try {
      const response = await fetch(url);
      const { data } = await response.json();

      // Only update if there's data
      if (data !== undefined) {
        setFullProjectList(data);
        setDisplayedProjects(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(`Unknown error: ${error}`);
      }
    }
  };

  if (!profileLoaded) {
    //const userID = await fetchUserID();
    //isUsersProfile = `${userID}` === profileID;
    console.log('being triggered');
    
    getProfileData();
  }

  // Search bar doesn't really have a use, so might as well use it for projects
  const searchProjects = (searchResults) => {
    const tempProjList: Project[] = [];

    for (const result of searchResults[0]) {
      for (const proj of projectSearchData) {
        if (result === proj) {
          tempProjList.push(fullProjectList[projectSearchData.indexOf(proj)]);
          continue;
        }
      }
    }

    // If no projects were found
    if (tempProjList.length === 0) {
      setDisplayedProjects([]); // Clear the displayed list
      console.log('No matching projects found.');
    } else {
      setDisplayedProjects(tempProjList);
    }
  };

  // --------------------
  // Components
  // --------------------
  console.log(`allow user to edit? ${isUsersProfile}`);
  const aboutMeButtons = isUsersProfile ? (
    <>
      {
        <div id="about-me-buttons">
          <button
            onClick={() => {
              window.location.href = 'https://www.w3schools.com';
            }}
          >
            <ThemeIcon
              light={'assets/profile_light.png'}
              dark={'assets/profile_dark.png'}
              alt={'LinkedIn'}
            />
          </button>
          <button
            onClick={() => {
              window.location.href = 'https://www.w3schools.com';
            }}
          >
            <ThemeIcon
              light={'assets/profile_light.png'}
              dark={'assets/profile_dark.png'}
              alt={'Instagram'}
            />
          </button>
          <ProfileEditPopup />
        </div>
      }
    </>
  ) : (
    <>
      {
        <div id="about-me-buttons" className="about-me-buttons-minimal">
          <button>
            <ThemeIcon
              light={'assets/profile_light.png'}
              dark={'assets/profile_dark.png'}
              alt={'LinkedIn'}
            />
          </button>
          <button>
            <ThemeIcon
              light={'assets/profile_light.png'}
              dark={'assets/profile_dark.png'}
              alt={'Instagram'}
            />
          </button>
          <button>
            <ThemeIcon
              light={'assets/profile_light.png'}
              dark={'assets/profile_dark.png'}
              alt={'Like'}
            />
          </button>
          <Dropdown>
            <DropdownButton>
              <ThemeIcon
                light={'assets/menu_light.png'}
                dark={'assets/menu_dark.png'}
                alt={'...'}
                addClass={'dropdown-menu'}
              />
            </DropdownButton>
            <DropdownContent rightAlign={true}>
              <div id="profile-menu-dropdown">
                <button className="profile-menu-dropdown-button">
                  <i className="fa-solid fa-share"></i>
                  Share
                </button>
                <button className="profile-menu-dropdown-button">
                  <i className="fa-solid fa-shield"></i>
                  Block
                </button>
                <button className="profile-menu-dropdown-button" id="profile-menu-report">
                  <i className="fa-solid fa-flag"></i>
                  Report
                </button>
              </div>
            </DropdownContent>
          </Dropdown>
        </div>
      }
    </>
  );

  // --------------------
  // Final component
  // --------------------
  return (
    <div className="page">
      {/* Should probably use the search bar for projects I guess? */}
      <Header dataSets={{ data: fullProjectList }} onSearch={searchProjects} />

      {/* Checks if we have profile data to use, then determines what to render */}
      <div id="profile-page-content">
        {/* New profile display using css grid, will contain all info except for projects */}
        <div id="profile-information-grid">
          <img
            src={`/images/profiles/${displayedProfile.profile_image}`}
            id="profile-image"
            alt="profile image"
          />

          <div id="profile-bio">{displayedProfile.headline}</div>

          <div id="profile-info-name">
            <span id="profile-fullname">
              {displayedProfile.first_name} {displayedProfile.last_name}
            </span>
            @{displayedProfile.username}
          </div>

          <div id="profile-info-buttons">{aboutMeButtons}</div>

          <div id="profile-info-extras">
            <div className="profile-extra">
              <ThemeIcon
                light={'assets/black/role.png'}
                dark={'assets/white/role.png'}
                alt={'Profession'}
              />
              {displayedProfile.job_title}
            </div>
            <div className="profile-extra">
              <ThemeIcon
                light={'assets/black/major.png'}
                dark={'assets/white/major.png'}
                alt={'Major'}
              />
              {displayedProfile.major}, {displayedProfile.academic_year}
            </div>
            <div className="profile-extra">
              <ThemeIcon
                light={'assets/black/location.png'}
                dark={'assets/white/location.png'}
                alt={'Location'}
              />
              {displayedProfile.location}
            </div>
            <div className="profile-extra">
              <ThemeIcon
                light={'assets/black/pronouns.png'}
                dark={'assets/white/pronouns.png'}
                alt={'Pronouns'}
              />
              {displayedProfile.pronouns}
            </div>
          </div>

          <div id="profile-info-description">{displayedProfile.bio}</div>

          <div id="profile-info-funfact">
            <span id="fun-fact-start">Fun Fact! </span>
            {displayedProfile.fun_fact}
          </div>

          <div id="profile-info-skills">
            {displayedProfile.skills !== null ? (
              /* Will take in a list of tags the user has selected, then */
              /* use a map function to generate tags to fill this div */
              displayedProfile.skills.map((tag) => {
                let category: string;
                switch (tag.type) {
                  case 'Design':
                    category = 'red';
                    break;
                  case 'Developer':
                    category = 'yellow';
                    break;
                  case 'Soft':
                    category = 'purple';
                    break;
                  default:
                    category = 'grey';
                }

                return <div className={`skill-tag-label label-${category}`}>{tag.skill}</div>;
              })
            ) : (
              <></>
            )}
          </div>
        </div>

        <div id="profile-projects">
          <h2>Projects</h2>
          {/* Probably fine to use 25 for itemAddInterval */}
          <PanelBox category={'projects'} itemList={displayedProjects} itemAddInterval={25} />
        </div>
      </div>
    </div>
  );
};

export default NewProfile;
