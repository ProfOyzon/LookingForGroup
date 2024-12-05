import "./pages.css";
import "../Styles/styles.css";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../Header";
import { ProjectPanel } from "../ProjectPanel";
import { Popup, PopupButton, PopupContent } from "../Popup";
import { Dropdown, DropdownButton, DropdownContent } from "../Dropdown";
import { profiles, projects } from "../../constants/fakeData";
import profilePicture from "../../images/blue_frog.png";
import profileImage from "../../icons/profile-user.png";
import menuImage from "../../icons/menu.png";
import * as tags from "../../constants/tags";
import EditButton from "../Profile/ProfileEditButton";

//To-do:
//Fix profile page breaking when switching to current user's profile (via the header) from another user's profile
//Ensure light/dark mode colors work properly
//Maybe switch profile edit button to use popup component, for consistency across site
//Double check project panel rendering math
//Ensure page elements elegantly handle window resizes (mainly the profile information panel and profile edit popup)

let runningServer = true;

let defaultProfile = runningServer ? undefined : {
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
  skills: ['Figma','JavaScript','Visual Studio Code','Flexibility','Krita'],
}

const fetchUserID = async () => {
  const response = await fetch("/api/auth");
  //const { data: {userID} } = await response.json();
  const { data } = await response.json();
  return data;
}

const userID = await fetchUserID();

const NewProfile = ({ theme, setTheme }) => {
  const location = useLocation();
  //Check to see if database call returned anything
  let [failCheck, setFailCheck] = useState(false);

  //Get url parameters to tell what user we are looking for
  let urlParams = new URLSearchParams(window.location.search);
  //const [profileID, setProfileID] = useState<String | null>(null);
  let profileID;
  profileID = urlParams.get('userID');
  if (profileID === undefined || profileID === null) {
    //If no profileID is in search query, automatically set to the current user's id
    console.log('profileID not found, using default');
    (async () => {
      profileID = userID;
    })();
  }

  //Function used to get profile data
  const getProfileData = async () => {
    if (profileID === undefined || profileID === null) {
      //If no profileID is in search query, automatically set to the current user's id
      console.log('profileID not found, using default');
      profileID = userID;
    }
    const url = `/api/users/${profileID}`;

    try {
      let response = await fetch(url);

      const profileData = await response.json();

      if (profileData.data[0] === undefined) {
        //setFailCheck(true);
        return;
      }

      setDisplayedProfile(profileData.data[0]);
    } catch (error) {
      console.error(error.message);
    }
  }

  //Function used to get projects the user has worked on
  const getProfileProjectData = async () => {
    if (profileID === undefined || profileID === null) {
      //If no profileID is in search query, automatically set to the current user's id
      console.log('profileID not found, using default');
      profileID = '1';
    }
    const url = `/api/users/${profileID}/projects`;

    try {
      let response = await fetch(url);

      const projectData = await response.json();

      setFullProjectList(projectData.data);
      setDisplayedProjects(() => firstProjects(projectData.data));
    } catch (error) {
      console.error(error.message);
    }
  }

  //State that hold info on the profile being displayed
  //use 'defaultProfile' in useState when using 'npm run client'. otherwise leave blank.
  const [displayedProfile, setDisplayedProfile] = useState(defaultProfile);

  //State that holds info on projects the user is a part of
  //Uses a default if not running on a server
  let defaultProjectList = runningServer ? undefined : projects;

  const [fullProjectList, setFullProjectList] = useState(defaultProjectList);


  //Runs funciton to get data if we haven't yet
  //Comment out if using 'npm run client' (can't connect to server with it)
  if (displayedProfile === undefined) {
    getProfileData();
  }
  if (fullProjectList === undefined) {
    getProfileProjectData();
  }

  //Variables used to represent profile data (only placeholders are used for now until backend is integrated)

  //Get a profile based on searchParam userId given
  ///const profileData = (/* Some sort of fetch request */);
  //Check whether or not the profile is the current user's
  let usersProfile = false;

  console.log("profileID is: " + profileID);
  console.log("fetchUserID() is: " + fetchUserID());

  if (profileID === userID) {
    console.log("profileID is: " + profileID);
    console.log("fetchUserID() is: " + fetchUserID());
    usersProfile = true;
  }

  //Holds a list of tags that the user selected to represent their skills
  //(How will tag categories be identified for color?)
  //No indicator on data, will need to cross-refrence here
  //let placeholderTags = ['Figma','Javascript','Visual Studio Code','Flexibility','Krita'];

  //functions & variables used for project rendering
  // ---different sizes, make sure to double-check math used for project rendering

  //Gets the width of the scrollbar
  //Obtained from https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
  function getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  //Find out the width of the flexbox container
  let flexboxWidth: number = window.innerWidth >= 800 ? window.innerWidth - (320 + getScrollbarWidth()) :
    window.innerWidth - (100 + getScrollbarWidth())
    ;
  //tracks the width of items in the current flexbox row
  let widthTracker: number = -20;
  //tracks the number of "full" flexbox rows
  let rowTracker: number = 0;
  //tracks the number of project panels that will be placed in a row
  let projectTracker: number = 0;
  //Tracks the time of the most recent resize call
  let lastResizeCall: number = 0;

  //Loads a new set of project panels to render
  //Calls when page first loads & when a new list of projects is being used (e.g. after a search)
  const firstProjects = (projectList) => {
    console.log(projectList);
    if (projectList === undefined) {
      return [];
    }
    //Reset projectListPosition
    let projectListPosition = 0;

    //empty list of projects to display
    //(Will also include project data when actual projects are used)
    let projectsToDisplay: { project, width: number, adjust: number, row: number }[] = [];

    //Reset variables, if needed
    widthTracker = -20;
    rowTracker = 0;
    projectTracker = 0;

    //Get first panel's thumbnail and its width/height
    let firstThumbnail = new Image();
    firstThumbnail.src = `images/thumbnails/${projectList[projectListPosition].thumbnail}`;

    //Set up initial project (ensures first row has something in it)

    //Calculates panel width based on aspect ratio of thumbnail image
    //If no thumbnail is found, randomizes width
    /* 
    Note: for some reason, reaching this page with a new tab/window using a url sometimes causes
    height values of thumbnails to be 0, and as we all know, computers don't like dividing by 0.
    For this reason, an extra check is added to ensure height does not equal 0. In the event it does,
    we randomize width instead of calculating an accurate width.
    */
    let firstPanelWidth = projectList[projectListPosition].thumbnail != null && firstThumbnail.height != 0 ? 
      firstThumbnail.width * (200 / firstThumbnail.height) :
      Math.floor((Math.random() * 200) + 200);
    widthTracker += firstPanelWidth + 20;
    projectsToDisplay.push({ project: projectList[projectListPosition], width: firstPanelWidth, adjust: 0, row: rowTracker });
    projectListPosition++
    projectTracker++;

    //Start iterating through projects
    while (projectListPosition < projectList.length) {
      //Get thumbnail and its width & height
      let thumbnail = new Image();
      thumbnail.src = `images/thumbnails/${projectList[projectListPosition].thumbnail}`;

      //Get a width value based on the project's display image's aspect ratio
      //Formula for getting width from image: 
      /*
      (image height) / X = 100px
      (image height) = 100px * X
      X = (image height) / 100px;
      (image width) / X = final width

      (image width) / ((image height) / 100px) = final width

      (image height) * X = 100px
      X = 100px / (image height)

      (image width) * (100px / (image height)) = final width [we'll use this one]
      */

      //(For testing's sake, width will be randomized)
      //let panelWidth = (img.naturalWidth * 100) / img.naturalHeight; [Use this when images are integrated]
      let panelWidth = projectList[projectListPosition].thumbnail != null && thumbnail.height != 0 ? 
        thumbnail.width * (200 / thumbnail.height) :
        Math.floor((Math.random() * 200) + 200);
      //Add (width value + flexbox gap value + borders) to width tracker
      //Note - borders & other factors may add extra width, double check calculations using inspector
      widthTracker += panelWidth + 20;
      //if width tracker > flexbox width, make final adjustments to row before moving to next
      if (widthTracker > flexboxWidth) {
        //Calculate flexboxWidth - total width of all projects
        let flexboxDifference = flexboxWidth - (widthTracker - (panelWidth + 20));
        //Divide difference to split among project panels' widths (and the remainder);
        let widthAdjustment = Math.floor(flexboxDifference / projectTracker);
        let widthAdjustmentRemainder = flexboxDifference % projectTracker;
        //Loop through all projects inside the most recently completed row
        for (let project of projectsToDisplay) {
          //Find projects of the current row being adjusted
          if (project.row === rowTracker) {
            //Divide difference evenly amongst all project's widths
            //project.width += widthAdjustment + widthAdjustmentRemainder;
            project.adjust = widthAdjustment + widthAdjustmentRemainder;
            //remove remainder once it is used once
            widthAdjustmentRemainder = 0;
          }
        }
        //Increment row tracker
        rowTracker++;
        //Reset width tracker to negative of the flexbox gap value
        widthTracker = panelWidth;
        //Reset project tracker
        projectTracker = 0;
      }
      //Add current project to list of projects to display
      //(Will include actual projects later)
      projectsToDisplay.push({ project: projectList[projectListPosition], width: panelWidth, adjust: 0, row: rowTracker });
      projectListPosition++;
      projectTracker++;
    }

    //Run one last width check to fully fill last row
    //Calculate flexboxWidth - total width of all projects
    let flexboxDifference = flexboxWidth - (widthTracker);
    //Divide difference to split among project panels' widths (and the remainder);
    let widthAdjustment = Math.floor(flexboxDifference / projectTracker);
    let widthAdjustmentRemainder = flexboxDifference % projectTracker;
    //Loop through all projects inside the most recently completed row
    for (let project of projectsToDisplay) {
      //Find projects of the current row being adjusted
      if (project.row === rowTracker) {
        //Divide difference evenly amongst all project's widths
        //project.width += widthAdjustment + widthAdjustmentRemainder;
        project.adjust = widthAdjustment + widthAdjustmentRemainder;
        //remove remainder once it is used once
        widthAdjustmentRemainder = 0;
      }
    }

    return (projectsToDisplay);
  }

  //Adjusts display to fit resized window, called whenever window size is adjusted
  const resizeProjects = () => {
    //Get time this function was called
    let thisCall: number = new Date().getTime();
    lastResizeCall = thisCall;
    //Set timer to check whether to continue this call or not
    setTimeout(() => {
      //If this is no longer the most recent call, stop this call
      if (lastResizeCall !== thisCall) {
        return;
      }

      //Similar to initial project panel rendering, just uses all currently displays projects
      //instead of adding new ones
      //Array holding edited project details
      let resizedProjects: { project, width: number, adjust: number, row: number }[] = [];
      //Calculate new flexbox width
      // ---Different size, check to see what math needs to be done
      flexboxWidth = window.innerWidth >= 800 ? window.innerWidth - (320 + getScrollbarWidth()) :
        window.innerWidth - (100 + getScrollbarWidth());
      ;
      //Reset tracker variables (widthTracker, rowTracker, projectTracker)
      widthTracker = -20;
      rowTracker = 0;
      projectTracker = 0;
      //Iterate through all currently displayed projects
      //For each project...
      //There is some sort of bug happening here, occasionally more than the max projects are being displayed
      //Issue only seems to occur after saving new code while test server is being hosted, so it may not need to be addressed
      for (let project of displayedProjects) {
        //Add width to widthTracker
        widthTracker += project.width + 20;
        //If widthTracker > flexbox width...
        if (widthTracker > flexboxWidth) {
          //Calculate remaining width (minus current project, that moves to next row)
          let flexboxDifference = flexboxWidth - (widthTracker - (project.width + 20));
          //Divide remaining width amongst current row's project panels (add remainder to first panel)
          let widthAdjustment = Math.floor(flexboxDifference / projectTracker);
          let widthRemainder = flexboxDifference % projectTracker;
          for (let rowProject of resizedProjects) {
            if (rowProject.row === rowTracker) {
              rowProject.adjust = widthAdjustment + widthRemainder;
              widthRemainder = 0;
            }
          }
          //Increment & reset tracker variables
          rowTracker++;
          widthTracker = project.width;
          projectTracker = 0;
        }
        //Add project to resized projects &  increment projectTracker
        resizedProjects.push({ project: project.project, width: project.width, adjust: 0, row: rowTracker });
        projectTracker++;
      }
      //Perform width adjustment on last row
      //Calculate remaining width
      let flexboxDifference = flexboxWidth - widthTracker;
      //Divide remaining width amongst current row's project panels (add remainder to first panel)
      let widthAdjustment = Math.floor(flexboxDifference / projectTracker);
      let widthRemainder = flexboxDifference % projectTracker;
      for (let rowProject of resizedProjects) {
        if (rowProject.row === rowTracker) {
          rowProject.adjust = widthAdjustment + widthRemainder;
          widthRemainder = 0;
        }
      }

      //Set displayed projects state
      setDisplayedProjects(resizedProjects);
    }, 100)
  };

  //Holds data for currently displayed projects
  let [displayedProjects, setDisplayedProjects] = useState<{ project, width: number, adjust: number, row: number }[]>(firstProjects(fullProjectList));

  //Runs resizing function whenever window width changes
  //Don't add dependencies to it - it causes state to be reset for some reason (I don't know why)
  useEffect(() => {
    window.addEventListener('resize', resizeProjects);
    return () => {
      window.removeEventListener('resize', resizeProjects)
    };
  });

  useEffect(() => {
    console.log('testing url changes');
    let newUrlParams = new URLSearchParams(window.location.search);
    profileID = newUrlParams.get('userID');
    if (profileID === undefined) {
      //If no profileID is in search query, automatically set to the current user's id
      console.log('profileID not found, using default');
      profileID = '1';
    }

    if (runningServer) {
      getProfileData();
    }
  }, [location])

  const aboutMeButtons = usersProfile === true ?
    <>{
      <div id='about-me-buttons'>
        <button onClick={() => {window.location.href = 'https://www.w3schools.com'}}>
          <img src="assets/profile_dark.png"
          src-light="assets/profile_light.png"
          src-dark="assets/profile_dark.png"
          className='theme-icon'
          alt='linkedin'/></button>
        <button onClick={() => {window.location.href = 'https://www.w3schools.com'}}>
          <img src="assets/profile_dark.png"
          src-light="assets/profile_light.png"
          src-dark="assets/profile_dark.png"
          className='theme-icon'
          alt='instagram'/></button>
        <EditButton userData={displayedProfile}/>
        {/* PLEASE USE THIS, I DIDN'T MAKE THE POPUP COMPONENT FOR NOTHING -M-
        <Popup>
          <PopupButton buttonId='edit-profile-button'>Edit Profile</PopupButton>
          <PopupContent>This is where the form will go, which ben is probably working on?</PopupContent>
        </Popup> */}
      </div>
    }</> :
    <>{
      <div id='about-me-buttons' className='about-me-buttons-minimal'>
        <button><img src="assets/profile_dark.png"
          src-light="assets/profile_light.png"
          src-dark="assets/profile_dark.png"
          className='theme-icon'
          alt='linkedin' /></button>
        <button><img src="assets/profile_dark.png"
          src-light="assets/profile_light.png"
          src-dark="assets/profile_dark.png"
          className='theme-icon'
          alt='instagram' /></button>
        <button><img src="assets/profile_dark.png"
          src-light="assets/profile_light.png"
          src-dark="assets/profile_dark.png"
          className='theme-icon'
          alt='like' /></button>
        <Dropdown>
          <DropdownButton><img src={menuImage} alt='...' /></DropdownButton>
          <DropdownContent rightAlign={true}>
            <div id='profile-menu-dropdown'>
              <button className='profile-menu-dropdown-button'>Share</button>
              <button className='profile-menu-dropdown-button'>Block</button>
              <button className='profile-menu-dropdown-button' id='profile-menu-report'>Report</button>
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    }</>

  //Page layout for if profile data hasn't been loaded yet
  let loadingProfile = <>{
    <div>
      Loading profile...
    </div>
  }</>

  //Page layout for if profile data isn't found
  let loadingFailed = <>{
    <div>
      Data on this profile does not exist.
    </div>
  }</>

  return (
    <div className='page'>
      <Header dataSets={{ data: [] }} onSearch={() => { }} theme={theme} setTheme={setTheme} />

      {/* Checks if we have profile data to use, then determines what to render */}
      {failCheck === true ? loadingFailed : displayedProfile === undefined ? loadingProfile :
      <div id='profile-page-content'>
        {/* New profile display using css grid, will contain all info except for projects */}
        <div id='profile-information-grid'>
          <img src={`/images/profiles/${displayedProfile.profile_image}`} id='profile-image' alt='profile image'/>
          <div id='profile-bio'>{displayedProfile.bio}</div>

            <div id='profile-info-name'><span id='profile-fullname'>{displayedProfile.first_name} {displayedProfile.last_name}</span>@{'someguy'}</div>
            <div id='profile-info-buttons'>{aboutMeButtons}</div>

            <div id='profile-info-extras'>
              <div className='profile-extra'>
                <img
                  src="assets/white/role.png"
                  src-light="assets/black/role.png"
                  src-dark="assets/white/role.png"
                  className='info-extra-image theme-icon'
                  alt='profession' />
                {displayedProfile.job_title}
              </div>
              <div className='profile-extra'>
                <img 
                src="assets/white/major.png"
                src-light="assets/black/major.png"
                src-dark="assets/white/major.png"
                className='info-extra-image theme-icon' 
                alt='major' />
                {displayedProfile.major}, {displayedProfile.academic_year}
                </div>
              <div className='profile-extra'>
                <img 
                src="assets/white/location.png"
                src-light="assets/black/location.png"
                src-dark="assets/white/location.png"
                className='info-extra-image theme-icon' 
                alt='location' />
                {displayedProfile.location}
                </div>
              <div className='profile-extra'>
                <img 
                src="assets/white/pronouns.png"
                src-light="assets/black/pronouns.png"
                src-dark="assets/white/pronouns.png"
                className='info-extra-image theme-icon' 
                alt='pronouns' />
                {displayedProfile.pronouns}
                </div>
            </div>

          <div id='profile-info-description'>
            {displayedProfile.headline}
          </div>

          <div id='profile-info-funfact'>
            <span id='fun-fact-start'>Fun Fact! </span>
            {displayedProfile.fun_fact}
          </div>

            <div id='profile-info-skills'>
              {
                displayedProfile.skills != null ? 
                /* Will take in a list of tags the user has selected,
                then use a map function to generate tags to fill this div */
                displayedProfile.skills.map((tag) => {
                  let category: string;
                  if (tag.type === 'Design') { category = 'red'; }
                  else if (tag.type === 'Developer') { category = 'yellow'; }
                  else if (tag.type === 'Soft') { category = 'purple'; }
                  else { category = 'grey'; }
                  return (
                    <div className={`skill-tag-label label-${category}`}>{tag.skill}</div>
                  )
                }) :
                <></>
              }
            </div>
          </div>

          <div id='profile-projects'>
            <h2>Projects</h2>
            <div id='profile-project-list'>
              {/* Will use same rendering system as the discover page, just with projects
            this user has worked on. Only needs re-rendering on page resizing. maybe. */}
              <>{
                displayedProjects.length > 0 ?
                  //For each project in project display list... (use map)
                  displayedProjects.map((project) => (
                    //Create a Project Panel component
                    <ProjectPanel width={project.width + project.adjust} projectData={project}></ProjectPanel>
                  )) :
                  <>This user has not worked on any projects yet.</>
              }</>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default NewProfile;