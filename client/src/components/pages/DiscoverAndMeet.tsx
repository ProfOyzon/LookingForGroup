import "./pages.css";
import { ProjectCard } from "../ProjectCard";
import { ProfileCard } from "../ProfileCard";
import { ProjectPanel } from "../ProjectPanel";
import { ProfilePanel } from "../ProfilePanel";
import { NotifButton } from "../NotificationButton";
import { SearchBar } from "../SearchBar";
import { TagFilter } from "../TagFilter";
import "../Styles/styles.css";
import { projects } from "../../constants/fakeData";
import { profiles } from "../../constants/fakeData";
import * as tags from "../../constants/tags";
import { Children, useCallback } from "react";
import { sortItems } from "../../functions/itemSort";
import { useState } from 'react';
import { useEffect } from 'react' ;
import CreditsFooter from '../CreditsFooter';
import ToTopButton from "../ToTopButton";
import bell from "../../icons/bell.png";
import profileImage from "../../icons/profile-user.png";

//To-do
//Let scroll buttons move tags *
//Hide scroll buttons when reaching edge *
//Have tags actually filter projects
//Create dropdown menus
//Have search bar work too along with tags

//Get whether we are loading projects or profiles using search query
let urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

//These values need to be outside the component, otherwise they get reset every time it re-renders
//List that holds project data that will be displayed. Changes along with search parameters
//Could combine this and profile variants into single variable
let projectList = projects;
//Variable that tracks what position we are at in the above array
let projectListPosition : number = 0;

//List that holds profile data that will be displayed. Changes along with search parameters
let profileList = profiles;
//Variable that tracks what position we are at in the above array
let profileListPosition : number = 0;
//Create array of profiles to help track the order they were added
let displayedProfileList : {profile, height : number}[] = [];
//Create array of height trackers to track total height in each column
let heightTrackers : number[];

//array that tracks what tags are currently being used to filter
let activeTagFilters : string[] = [];

const DiscoverAndMeet = () => {
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

  //Set the hero component based on projects or profiles
  //const heroComponent = category === 'projects' ? (component 1) : (component 2)
  //Get a list of tags to use for tag filters (project tags for projects, profession tags for profiles)
  const tagList = category === 'projects' ? tags.tags : tags.proficiencies;

  //Set up panel display functions

  //Variables used for panel displays
  //Find out the width of the flexbox container
  let flexboxWidth : number = window.innerWidth - 320 - getScrollbarWidth();
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
  const firstProjects = (newProjectList) => {
    //Set new project list to run through
    projectList = newProjectList;
    //Reset projectListPosition
    projectListPosition = 0;

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
    //(For testing purposes, will just loop until break condition is met)
    while (rowTracker <= 5 && projectListPosition < projectList.length) {
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
        ///let panelWidth = imageWidth * (100 / imageHeight); [Use this when images are integrated]
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
        //if row tracker < a designated row count...
        if (rowTracker < 5) {
            //Add current project to list of projects to display
            //(Will include actual projects later)
            projectsToDisplay.push({project: projectList[projectListPosition], width: panelWidth, adjust: 0, row: rowTracker});
            projectListPosition++;
            projectTracker++;
        } else { //otherwise...
            //Break project iteration loop
            break;
        }  
    }

    return (projectsToDisplay);
  }

  //Function that adds more panels to render, called when the user scrolls to the bottom of the page
  const addProjects = () => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.querySelector(".page");

    if (scrollTop + clientHeight >= scrollHeight) {
      let newProjectsToDisplay : {project, width : number, adjust : number, row : number}[] = [];

      //Reset calculation values
      widthTracker = -20;
      let lastRow = displayedProjects[displayedProjects.length - 1].row + 1;
      rowTracker = displayedProjects[displayedProjects.length - 1].row + 1;
      projectTracker = 0;

      while (rowTracker <= lastRow + 5 && projectListPosition < projectList.length) {
        //Get a width value based on the project's display image's aspect ratio
        //let panelWidth = imageWidth * (100 / imageHeight); [Use this when images are integrated]
        let panelWidth = Math.floor((Math.random() * 200) + 200);
        //Add (width value + flexbox gap value + borders) to width tracker
        widthTracker += panelWidth + 24;
        if (widthTracker > flexboxWidth) {
          let flexboxDifference = flexboxWidth - (widthTracker - (panelWidth + 24));
          //Divide difference to split among project panels' widths (and the remainder);
          let widthAdjustment = Math.floor(flexboxDifference / projectTracker);
          let widthAdjustmentRemainder = flexboxDifference % projectTracker;
          //Loop through all projects inside the most recently completed row
          for (let project of newProjectsToDisplay) {
            if (project.row === rowTracker) {
              //Divide difference evenly amongst all project's widths
              project.adjust = widthAdjustment + widthAdjustmentRemainder;
              widthAdjustmentRemainder = 0;
            }
          }
          rowTracker++;
          widthTracker = panelWidth + 4;
          projectTracker = 0;
        }
        if (rowTracker < lastRow + 5) {
          //Add current project to list of projects to display
          newProjectsToDisplay.push({project: projectList[projectListPosition], width: panelWidth, adjust: 0, row: rowTracker});
          projectListPosition++;
          projectTracker++;
        } else { 
          break;
        }  
      }

    //Append new project list to existing one
    setDisplayedProjects(displayedProjects.concat(newProjectsToDisplay));
  }
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
      flexboxWidth = window.innerWidth - 320 - getScrollbarWidth();
      //Reset tracker variables (widthTracker, rowTracker, projectTracker)
      widthTracker = -20;
      rowTracker = 0;
      projectTracker = 0;
      //Iterate through all currently displayed projects
      //For each project...
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

    //Also ensure scroll buttons display correctly on resize
    resizeTagFilter();
  };

  //Calls when page first loads & when a new list of profiles is being used (e.g. after a search)
  const firstProfiles = (newProfileList) => {
    profileList = newProfileList;
    profileListPosition = 0;
    //Reset height trackers
    heightTrackers = [];
    //Calculate the width of available space (flexboxWidth contains this in this file)
    //Divide that width and determine how many columns can fit
    let totalColumns = Math.floor(flexboxWidth / 224);
    //Create a number of arrays to hold profile panels equal to the number of columns
    //Also, create height trackers for each column
    let columnsToDisplay : {profile, height : number}[][] = [];
    for (let i = 0; i < totalColumns; i++){
      columnsToDisplay.push([]);
      heightTrackers.push(0);
    }
    //Start iterating through profiles (set limit of 30 profiles at first render)
    //For each profile... (until all profiles are used or 30 are used)
    for (let i = 0; i < 30; i++){
      //If there are no more profiles to use, break this loop
      if (profileListPosition >= profileList.length) {
        break;
      }
      //Calculate height based off of image + any extra space for info
      //(For testing purposes, height is randomized)
      let panelHeight = Math.floor((Math.random() * 300) + 200);
      //Check which column has the least height currently (if multiple have same, use first)
      let shortestColumn = 0;
      for (let j = 1; j < heightTrackers.length; j++){
        if (heightTrackers[j] < heightTrackers[shortestColumn]) {
          shortestColumn = j;
        }
      }
      //Add current profile to column with least height
      columnsToDisplay[shortestColumn].push({profile: profileList[i], height: panelHeight});
      //Also add current profile to displayedProfileList
      displayedProfileList.push({profile: profileList[i], height: panelHeight});
      profileListPosition++;
      //Add profile height to column's height tracker
      heightTrackers[shortestColumn] += panelHeight;
    }
        
    //Return full set of arrays
    return(columnsToDisplay);
  }

  //Function that handles adding new profiles when scrolling to the bottom of the page
  const addProfiles = () => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.querySelector(".page");

    if (scrollTop + clientHeight >= scrollHeight) {
      //Get current set of displayed profiles
      let newProfilePanels : {profile, height : number}[][] = JSON.parse(JSON.stringify(profileColumns));
      //Find where we left off on the profile list
      //Start iterating through profiles
      //For each profile... (until 30 or used or list is exhausted)
      for (let i = 0; i < 30; i++) {
        //If there are no more profiles, break this loop
        if (profileListPosition >= profileList.length) {
          break;
        }
        //Calculate panel height based off image
        //(height is randomized for now)
        let panelHeight = Math.floor((Math.random() * 300) + 200);
        //Find column with shortest height
        let shortestColumn = 0;
        for (let j = 1; j < heightTrackers.length; j++){
          if (heightTrackers[j] < heightTrackers[shortestColumn]) {
            shortestColumn = j;
          }
        }
        //Add profile to column with shortest height
        newProfilePanels[shortestColumn].push({profile: profileList[profileListPosition], height: panelHeight});
        //Add profile to displayedProfileList
        displayedProfileList.push({profile: profileList[profileListPosition],height: panelHeight});
        profileListPosition++;
        //Add profile's height to column's height tracker
        heightTrackers[shortestColumn] += panelHeight;
      }
      //Set profileColumns with newly added profiles
      setProfileColumns(newProfilePanels);
    }
  }

  //Function that handles resizing of profile panels
  const resizeProfiles = () => {
    //Get time this function was called
    let thisCall : number = new Date().getTime();
    lastResizeCall = thisCall;
    //Set timer to check whether to continue this call or not
    setTimeout(() => {
      //If this is no longer the most recent call, stop this call
      if (lastResizeCall !== thisCall) {
        return;
      }

      //Check current flexbox width & number of columns it can hold
      flexboxWidth = window.innerWidth - 324 - getScrollbarWidth();
      let newColumns = Math.floor(flexboxWidth / 224);
      //If number of columns available has changed...
      if (newColumns !== heightTrackers.length){
        //Construct new array to contain resized column info
        let resizedColumnsToDisplay : {profile, height : number}[][] = [];
        //Reset all height trackers
        for (let i = 0; i < heightTrackers.length; i++) {
          heightTrackers[i] = 0;
        }
        //Check if more or less columns are available
        //If less...
        if (newColumns < heightTrackers.length) {
          //Remove height trackers that go beyond limit
          while (heightTrackers.length > newColumns) {
            heightTrackers.pop();
          }
        } else { //else (if more)...
          //Add height trackers to match new limit
          while (heightTrackers.length < newColumns) {
            heightTrackers.push(0);
          }
        }
        //Fill new column info array with empty arrays
        for (let i = 0; i < heightTrackers.length; i++){
          resizedColumnsToDisplay.push([]);
        }
        //Get current set of displayed profiles (not profileColumns, need an unaltered list)
        //For each profile...
        for (let profile of displayedProfileList) {
          //Check which column has the least height currently (use first if there's a tie)
          let shortestColumn = 0;
          for (let i = 1; i < heightTrackers.length; i++){
            if (heightTrackers[i] < heightTrackers[shortestColumn]) {
              shortestColumn = i;
            }
          }
          //Add profile to the least tallest column currently
          resizedColumnsToDisplay[shortestColumn].push({profile: profile.profile, height: profile.height});
          //Add profile height to the column's height tracker
          heightTrackers[shortestColumn] += profile.height;
        }
        //Set profileColumns to newly created resized columns
        setProfileColumns(resizedColumnsToDisplay);
      }
    }, 100);

    //Also ensure scroll buttons display correctly on resize
    resizeTagFilter();
  }

  //Choose which functions to use based on what we are displaying
  const firstContent = category === 'projects' ? firstProjects : firstProfiles;
  const addContent = category === 'projects' ? addProjects : addProfiles;
  const resizeDisplay = category === 'projects' ? resizeProjects : resizeProfiles;

  //Can possibly merge these two into a single useState? mostly concerned with different variable types
  //Holds data for currently displayed projects
  let [displayedProjects, setDisplayedProjects] = useState<{project, width : number, adjust : number, row : number}[]>(() => firstProjects(projects));
  //Holds data for currently displayed profiles
  let [profileColumns, setProfileColumns] = useState<{profile, height : number}[][]>(() => firstProfiles(profiles));

  //Runs resizing function whenever window width changes
  //Don't add dependencies to it - it causes state to be reset for some reason (I don't know why)
  useEffect(() => {
    window.addEventListener('resize', resizeDisplay);
    return () => {
      window.removeEventListener('resize', resizeDisplay)
    };
  });

  //Function called when a tag is clicked, adds the tag to the list of filters being used
  const toggleTag = (e, tagName : string) => {
    //Check if the tag is already in activeTagFilters
    //if it isn't...
    if (!activeTagFilters.includes(tagName)) {
      //Add this tag to the list
      activeTagFilters.push(tagName);
    } else { //else... (it is in there)
      //Remove this tag from the list
      activeTagFilters.splice(activeTagFilters.indexOf(tagName), 1);
    }
    //Also, toggle the tag filter's display
    e.target.classList.toggle('discover-tag-filter-selected');
  }

  //Function called when scroll arrows are clicked
  //Scrolls the list of tag filters right or left
  const scrollTags = (direction) => { 
    //Check if left or right button was clicked
    let tagFilterElement = document.getElementById('discover-tag-filters');
    //Check other button is hidden, if so...
    if (document.getElementById('filters-left-scroll').classList.contains('hide') || 
    document.getElementById('filters-right-scroll').classList.contains('hide')) {
      //Un-hide the other scrolling button
      document.getElementById('filters-left-scroll').classList.remove('hide');
      document.getElementById('filters-right-scroll').classList.remove('hide');
    }
    //If we are going to hit the edge with this scroll...
    if (tagFilterElement.scrollLeft - 800 <= 0 && direction === 'left') {
      //hide the relevant scrolling button
      document.getElementById('filters-left-scroll').classList.add('hide');
    } else if (tagFilterElement.scrollLeft + tagFilterElement.offsetWidth + 800 >= tagFilterElement.scrollWidth && direction === 'right') {
      document.getElementById('filters-right-scroll').classList.add('hide');
    };
    //Scroll tag bar left or right by a certain amount
    if (direction === 'left') {
      tagFilterElement.scrollBy(-800, 0);
    } else if (direction === 'right') {
      tagFilterElement.scrollBy(800, 0);
    }
  }

  //Called when resizing page
  //ensures that scroll buttons show and hide when they're supposed to on resizes
  const resizeTagFilter = () => {
    let tagFilterElement = document.getElementById('discover-tag-filters');
    let leftScroller = document.getElementById('filters-left-scroll');
    let rightScroller = document.getElementById('filters-right-scroll')
    //If tag filter is scrolled all the way left, hide left scroll button
    //If tag filter is not all the way left, ensure button is showed
    if (tagFilterElement.scrollLeft <= 0 && !leftScroller.classList.contains('hide')) {
      leftScroller.classList.add('hide')
    } else if (tagFilterElement.scrollLeft > 0 && leftScroller.classList.contains('hide')) {
      leftScroller.classList.remove('hide')
    }
    //If tag filter is all the way right, hide right scroll button
    //If tag filter is not all the way right, ensure button is showed
    if (tagFilterElement.scrollLeft + tagFilterElement.offsetWidth >= tagFilterElement.scrollWidth && !rightScroller.classList.contains('hide')) {
      rightScroller.classList.add('hide')
    } else if (tagFilterElement.scrollLeft + tagFilterElement.offsetWidth < tagFilterElement.scrollWidth && rightScroller.classList.contains('hide')) {
      rightScroller.classList.remove('hide')
    }
  }

  //Hero banner for profile display
  let profileHero = <>{
    <div id='profile-hero-bg1'>
      <div id='profile-hero'>
        <div id='profile-hero-header'>
          <h2>Welcome!</h2>
          Looking for talented people to collaborate with?
        </div>

        <img id='profile-hero-img-1'/>
        <img id='profile-hero-img-2'/>
        <img id='profile-hero-img-3'/>

        <div id='profile-hero-blurb-1' className='profile-hero-blurb'>
          <div>
          <span className='profile-hero-highlight'>Explore profiles</span> to see each other's <br/>personality, expertise, and project history.
          </div>
        </div>

        <div id='profile-hero-blurb-2' className='profile-hero-blurb'>
          <div>
          Find someone interesting? <span className='profile-hero-highlight'>Send a message!</span>
          <br/><br/>
          <span className='profile-hero-highlight'>Introduce yourself</span>, share project ideas, <br/>and show interest in working together!
          </div>
        </div>

        <div id='profile-hero-blurb-3' className='profile-hero-blurb'>
          <div>
          Keep your profile up to date with your <br/>skills, project preferences, and interests to<br/>
          <span className='profile-hero-highlight'>find your group!</span>
          </div>
        </div>
      </div>
    </div>
  }</>

  //Displays a set of project panels
  let projectContent = <>{
    //For each project in project display list... (use map)
    displayedProjects.map((project) => (
      //Create a Project Panel component
      <ProjectPanel width={project.width + project.adjust}></ProjectPanel>
    ))
  }</>

  //Displays a set of profile panels
  let profileContent = <>{
    //For each array in profileColumns...
    profileColumns.map((column) => (
      //Create a column element & map through profiles in array
      <div>
        {column.map((profile) => (
          <ProfilePanel height={profile.height}></ProfilePanel>
        ))}
      </div>
    ))
  }</>

  //Decides which 'content' to display on the page
  let heroContent = category === 'projects' ? <>Nothing yet, sorry</> : profileHero;
  let panelContent = category === 'projects' ? projectContent : profileContent;

  return(
    <div className='page' onScroll={addContent}>
      {/* Search bar and profile/notification buttons */}
      <div id='discover-header'>
        <span id='discover-searchbar'>
          <SearchBar dataSets={projects} onSearch={() => {console.log('hi')}}/>
        </span>
        <span id='discover-header-buttons'>
          <button><img src={bell} className="navIcon" alt="Notifications" /></button>
          <button><img src={profileImage} className="navIcon" alt="User" /></button>
        </span>
      </div>
      {/* Contains the hero display, carossel if projects, profile intro if profiles*/}
      <div id='discover-hero'>
      {heroContent}
      </div>

      {/* Contains tag filters & button to access more filters 
        When page loads, determine if project tags or profile tags should be used
        Clicking a tag filter adds it to a list & updates panel display based on that list
        Changes to filters via filter menu are only applied after a confirmation
      */}
      <div id='discover-filters'>
        <div id='discover-tag-filters-container'>
          <button id='filters-left-scroll' className='filters-scroller hide' onClick={() => scrollTags('left')}>&lt;</button>
          <div id='discover-tag-filters'>
            {
              tagList.map((tag) => (
                <button className='discover-tag-filter' onClick={(e) => toggleTag(e, tag.toLowerCase())}>{tag}</button>
              ))
            }
          </div>
          <button id='filters-right-scroll' className='filters-scroller' onClick={() => scrollTags('right')}>&gt;</button>
        </div>
        <button id='discover-more-filters'>Filters</button>
      </div>

      {/* Panel container */}
      <div id='discover-panel-box'>
      {panelContent}
      </div>

      {/* Credits footer */}
      <CreditsFooter/>
    </div>
  )
}

export default DiscoverAndMeet;