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

//To-do:
//Fix profile page not changing when clicking 'profile' sidebar link (specifically for on invalid id pages)
//(If viewing another's profile, should switch to user's profile when clicking such)
//Ensure all tag types function correctly
//Fix weird sidebar breakpoint styling

let runningServer = true;

let defaultProfile = runningServer ? undefined : {
  first_name: 'User', 
  last_name: 'Name', 
  bio: `Here's a quick lil blurb about me!`,
  skills: ['Figma','JavaScript','Visual Studio Code','Flexibility','Krita'],
}

const NewProfile = () => {
  const location = useLocation();
  //Check to see if database call returned anything
  let [failCheck, setFailCheck] = useState(false);

  //Get url parameters to tell what user we are looking for
  let urlParams = new URLSearchParams(window.location.search);
  let profileID = urlParams.get('userID');
  console.log(profileID);
  if (profileID === undefined || profileID === null) {
    //If no profileID is in search query, automatically set to the current user's id
    console.log('profileID not found, using default');
    profileID = '1';
  }

  //Function used to get profile data
  const getProfileData = async () => {
    const url = `http://localhost:8081/api/users/${profileID}`;

    try {
      let response = await fetch(url);

      const profileData = await response.json();
      console.log(profileData);
      console.log(profileData.data[0]);

      if(profileData.data[0] === undefined){
        setFailCheck(true);
        return;
      }

      setDisplayedProfile(profileData.data[0]);
    } catch (error) {
      console.error(error.message);
    }
  }

  //State that hold info on the profile being displayed
  //use 'defaultProfile' in useState when using 'npm run client'. otherwise leave blank.
  const [displayedProfile, setDisplayedProfile] = useState(defaultProfile);
  

  //Runs funciton to get data if we haven't yet
  //Comment out if using 'npm run client' (can't connect to server with it)
  if (displayedProfile === undefined) {
    getProfileData();
  }

  console.log(displayedProfile);

  //Variables used to represent profile data (only placeholders are used for now until backend is integrated)

  //Get a profile based on searchParam userId given
  ///const profileData = (/* Some sort of fetch request */);
  //Check whether or not the profile is the current user's
  let usersProfile = false;
  
  if (profileID === '1') {
    usersProfile = true;
  } 
  
  //Pull data from profile and place them in variables 
  //(structure depends on database structure, so wait for implementation)
  //data includes...
    //Profile image
    //User's name (full name or username?)
    //Their profession
    //headline
    //pronouns, major, location, favorite project, fun fact (may not all be included)

    //About Me description
    //Profile's selected tags
    //Looking for stuff??
    //List of projects worked on
  

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
  let flexboxWidth : number = window.innerWidth >= 800 ? window.innerWidth - (320 + getScrollbarWidth()) :
    window.innerWidth - (100  + getScrollbarWidth())
  ;
  //tracks the width of items in the current flexbox row
  let widthTracker : number = -20;
  //tracks the number of "full" flexbox rows
  let rowTracker : number = 0;
  //tracks the number of project panels that will be placed in a row
  let projectTracker : number = 0;
  //Tracks the time of the most recent resize call
  let lastResizeCall : number = 0;

  //Loads a new set of project panels to render
  //Calls when page first loads & when a new list of projects is being used (e.g. after a search)
  const firstProjects = () => {
    //Set new project list to run through
    //Later, use project list exclusive to the user
    let projectList = projects;
    //Reset projectListPosition
    let projectListPosition = 0;

    //empty list of projects to display
    //(Will also include project data when actual projects are used)
    let projectsToDisplay : {project, width : number, adjust : number, row : number}[] = [];

    //Reset variables, if needed
    widthTracker = -20;
    rowTracker = 0;
    projectTracker = 0;

    //Set up initial project (ensures first row has something in it)
    let firstPanelWidth = Math.floor((Math.random() * 200) + 200);
    widthTracker += firstPanelWidth + 24;
    projectsToDisplay.push({project: projectList[projectListPosition], width: firstPanelWidth, adjust: 0, row: rowTracker});
    projectListPosition++
    projectTracker++;

    //Start iterating through projects
    while (projectListPosition < projectList.length) {
      //Get thumbnail image of current project
      //const img = new Image();
      //img.src = profilePicture;

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
      let panelWidth = Math.floor((Math.random() * 200) + 200);
      //Add (width value + flexbox gap value + borders) to width tracker
      //Note - borders & other factors may add extra width, double check calculations using inspector
      widthTracker += panelWidth + 24;
      //if width tracker > flexbox width, make final adjustments to row before moving to next
      if (widthTracker > flexboxWidth) {
        //Calculate flexboxWidth - total width of all projects
        let flexboxDifference = flexboxWidth - (widthTracker - (panelWidth + 24));
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
        widthTracker = panelWidth + 4;
        //Reset project tracker
        projectTracker = 0;
      }
      //Add current project to list of projects to display
      //(Will include actual projects later)
      projectsToDisplay.push({project: projectList[projectListPosition], width: panelWidth, adjust: 0, row: rowTracker});
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
    let thisCall : number = new Date().getTime();
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
      let resizedProjects : {project, width : number, adjust : number, row : number}[] = [];
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
      for (let project of displayedProjects){
        //Add width to widthTracker
        widthTracker += project.width + 24;
        //If widthTracker > flexbox width...
        if (widthTracker > flexboxWidth) {
          //Calculate remaining width (minus current project, that moves to next row)
          let flexboxDifference = flexboxWidth - (widthTracker - (project.width + 24));
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
          widthTracker = project.width + 4;
          projectTracker = 0;
        }
        //Add project to resized projects &  increment projectTracker
        resizedProjects.push({project: project.project, width: project.width, adjust: 0, row: rowTracker});
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
  let [displayedProjects, setDisplayedProjects] = useState<{project, width : number, adjust : number, row : number}[]>(firstProjects);

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

    getProfileData();
  }, [location])

  const aboutMeButtons = usersProfile === true ? 
    <>{
      <div id='about-me-buttons'>
        <button onClick={() => {window.location.href = 'https://www.w3schools.com'}}><img src={profileImage} alt='linkedin'/></button>
        <button onClick={() => {window.location.href = 'https://www.w3schools.com'}}><img src={profileImage} alt='instagram'/></button>
        <Popup>
          <PopupButton buttonId='edit-profile-button'>Edit Profile</PopupButton>
          <PopupContent>This is where the form will go, which ben is probably working on?</PopupContent>
        </Popup>
      </div>
    }</> :
    <>{
      <div id='about-me-buttons' className='about-me-buttons-minimal'>
        <button><img src={profileImage} alt='linkedin'/></button>
        <button><img src={profileImage} alt='instagram'/></button>
        <button><img src={profileImage} alt='like'/></button>
        <Dropdown>
          <DropdownButton><img src={menuImage} alt='...'/></DropdownButton>
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
      <Header dataSets={{data: []}} onSearch={() => {}}/>

      {/* Checks if we have profile data to use, then determines what to render */}
      {failCheck === true ? loadingFailed : displayedProfile === undefined ? loadingProfile :
      <div id='profile-page-content'>
        {/* New profile display using css grid, will contain all info except for projects */}
        <div id='profile-information-grid'>
          <img src={profilePicture} id='profile-image' alt='profile image'/>
          <div id='profile-bio'>{displayedProfile.bio}</div>

          <div id='profile-info-name'><span id='profile-fullname'>{displayedProfile.first_name} {displayedProfile.last_name}</span>@{'someguy'}</div>
          <div id='profile-info-buttons'>{aboutMeButtons}</div>

          <div id='profile-info-extras'>
            <div className='profile-extra'><img src={profileImage} className='info-extra-image' alt='profession'/>{'Profession'}</div>
            <div className='profile-extra'><img src={profileImage} className='info-extra-image' alt='major'/>{'Profesional Typer, 13th'}</div>
            <div className='profile-extra'><img src={profileImage} className='info-extra-image' alt='location'/>{'Middle of, Nowhere'}</div>
            <div className='profile-extra'><img src={profileImage} className='info-extra-image' alt='pronouns'/>{'Was/Were'}</div>
          </div>

          <div id='profile-info-description'>
            {'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti, deserunt facilis. A nam neque, unde eligendi officia voluptates porro sint? Tempore debitis laborum, expedita sunt illum magnam maiores eius temporibus amet. Fuga quaerat magnam veritatis facilis ipsa praesentium minus rem sunt in, facere, asperiores corporis quae veniam. Similique possimus neque sit velit earum est deleniti nostrum repellat aut alias sequi assumenda ipsum tempora minus facilis, ex at excepturi libero doloribus.'}
          </div>

          <div id='profile-info-funfact'>
            <span id='fun-fact-start'>Fun Fact! </span>
            {`I'm not a real person, I'm just a digital representation of one!`}
          </div>

          <div id='profile-info-skills'>
            {
              /* Will take in a list of tags the user has selected,
              then use a map function to generate tags to fill this div */
              displayedProfile.skills.map((tag) => {
                let category : string;
                if (tags.desSkills.includes(tag)) {category = 'red';}
                else if (tags.devSkills.includes(tag)) {category = 'yellow';}
                else if (tags.softSkills.includes(tag)) {category = 'purple';}
                else {category = 'grey';}
                return(
                  <div className={`skill-tag-label label-${category}`}>{tag}</div>
                )
              })
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
                  <ProjectPanel width={project.width + project.adjust}></ProjectPanel>
                )) :
                <>This user has not worked on any projects yet.</>
            }</>
          </div>
        </div>
      </div>
      //Old layout goes here
      }
    </div>
  )
}

{
  //Old layout (remove later)
      /* Left-side column that will contain info found on a discover card
        Mostly just includes small tidbits about the person 
        width is set, unchanging*/
        /* <div id='profile-discover-column'>
          <img src={profilePicture} id='profile-image' alt='profile image'/>

          <div id='profile-discover-column-header'>
            <div id='profile-discover-column-username'><h2>{displayedProfile.first_name} {displayedProfile.last_name}</h2></div>
            <div id='profile-discover-column-profession'><h3>Profession</h3></div>
          </div>

          <div id='profile-discover-column-headline'>
            <img src={profileImage} className='profile-discover-icon' alt='headline'/>
            <div>{displayedProfile.bio}</div>
          </div>

          <div id='profile-discover-column-extra'>
            <div className='profile-column-extra-item'>
              <img src={profileImage} className='profile-discover-icon' alt='pronouns'/> <div>Was/Were</div>
            </div>
            <div className='profile-column-extra-item'>
              <img src={profileImage} className='profile-discover-icon' alt='major'/> <div>Professional Typer, 13th Year</div>
            </div>
            <div className='profile-column-extra-item'>
              <img src={profileImage} className='profile-discover-icon' alt='location'/> <div>Middle, Of Nowhere</div>
            </div>
            <div className='profile-column-extra-item'>
              <img src={profileImage} className='profile-discover-icon' alt='favorite project'/> <div>LFG</div>
            </div>
            <div className='profile-column-extra-item'>
              <img src={profileImage} className='profile-discover-icon' alt='fun fact'/> <div>I'm not a real person, I'm just a digital representation of one!</div>
            </div>
          </div>
        </div>

        {/* This column contains more in-depth information, including skills and worked-on projects 
        width readjusts and re-orders based on size*}
        <div id='profile-about-me-column'>
          <div id='profile-about-me-header'>
            <h2 id='about-me-header-text'>About Me</h2>
            {aboutMeButtons}
          </div>

          <div id='profile-about-me-content'>
            <div id='profile-about-me-description'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti, deserunt facilis. A nam neque, unde eligendi officia voluptates porro sint? Tempore debitis laborum, expedita sunt illum magnam maiores eius temporibus amet. Fuga quaerat magnam veritatis facilis ipsa praesentium minus rem sunt in, facere, asperiores corporis quae veniam. Similique possimus neque sit velit earum est deleniti nostrum repellat aut alias sequi assumenda ipsum tempora minus facilis, ex at excepturi libero doloribus.
            </div>

            <div id='profile-about-me-skills'>
              <h2>Skills</h2>
              <div id='skill-tags-container'>
                {
                /* Will take in a list of tags the user has selected,
                then use a map function to generate tags to fill this div *
                  displayedProfile.skills.map((tag) => {
                    let category : string;
                    /* switch(tag){
                      case 1: category = 'red'; break;
                      case 2: category = 'yellow'; break;
                      case 3: category = 'indigo'; break;
                      default: category = 'grey';
                    } *
                    if (tags.desSkills.includes(tag)) {category = 'red';}
                    else if (tags.devSkills.includes(tag)) {category = 'yellow';}
                    else if (tags.softSkills.includes(tag)) {category = 'purple';}
                    else {category = 'grey';}
                    return(
                      <div className={`skill-tag-label label-${category}`}>{tag}</div>
                    )
                  })
                }
              </div>
            </div> 

            {/*<div id='profile-looking-for'>
              <h2>Looking for</h2>
              Looking for... something? I'm not entirely sure what goes here yet.
            </div>*}

            <div id='profile-projects'>
              <h2>Projects</h2>
              <div id='profile-project-list'>
                {/* Will use same rendering system as the discover page, just with projects
                this user has worked on. Only needs re-rendering on page resizing. maybe. *}
                <>{
                  displayedProjects.length > 0 ? 
                    //For each project in project display list... (use map)
                    displayedProjects.map((project) => (
                      //Create a Project Panel component
                      <ProjectPanel width={project.width + project.adjust}></ProjectPanel>
                    )) :
                    <>This user has not worked on any projects yet.</>
                }</>
              </div>
            </div> 
          </div> 
        </div>
      </div> */
}

export default NewProfile;