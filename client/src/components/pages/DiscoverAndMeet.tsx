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

import { ProjectPanel } from '../ProjectPanel';
import { ProfilePanel } from '../ProfilePanel';
import { SearchBar } from '../SearchBar';
import { Header } from '../Header';
import { Dropdown, DropdownButton, DropdownContent } from '../Dropdown';
import { Popup, PopupButton, PopupContent } from '../Popup';
import { ImageCarousel } from '../ImageCarousel';
import { projects } from '../../constants/fakeData'; // FIXME: use project data in db
import { profiles } from '../../constants/fakeData'; // FIXME: use user data in db
import * as tags from '../../constants/tags';
import { useState, useEffect, useRef } from 'react';
import ToTopButton from '../ToTopButton';
import CreditsFooter from '../CreditsFooter';
import bell from '../../icons/bell.png';
import profileImage from '../../icons/profile-user.png';
import { sendPost, sendGet, GET } from '../../functions/fetch';
import e from 'express';
import { ThemeIcon } from '../ThemeIcon';
import { current } from '@reduxjs/toolkit';

//To-do
//Add/finish additional tag filter popup
//Have arrow buttons disappear if length is too wide to warrant them
//Possibly finish & add image carousel (use ImageCarousel component, import found above)
//Fix panels displaying when no items match searchbar input (should show NO projects if that's the case)

//These values need to be outside the component, otherwise they get reset every time it re-renders
//Lists that hold the original list of projects and profiles, only updates on page reload

//Variable to tell whether or not we are using 'npm run server' (true) or 'npm run client' (false)
//Manually switch whenever deciding which npm command to run
let runningServer = true;

//List that holds project data that will be displayed. Changes along with search parameters
//Could combine this and profile variants into single variable
let projectList = [];
//List that holds a project list that is filtered by searching
let filteredProjectList = [];

//Variable that tracks what position we are at in the above array
let projectListPosition: number = 0;

//List that holds profile data that will be displayed. Changes along with search parameters
let profileList = [];
//List that holds a profile list that is filtered by searching
let filteredProfileList = [];

//Variable that tracks what position we are at in the above array
let profileListPosition: number = 0;
//Create array of profiles to help track the order they were added
let displayedProfileList: { profile; height: number }[] = [];
//Create array of height trackers to track total height in each column
let heightTrackers: number[];

//array that tracks what tags are currently being used to filter
let activeTagFilters: string[] = [];
//array that tracks active tags used in the more filters dropdown
let extraTagFilters: string[] = [];
//array that tracks tag selected in the filters popup, contents are copied to extraTagFilters when applied
let popupTagSelections: string[] = [];

//Main DiscoverAndMeet component
//category - string variable that determines what layout type to load (defaults to profile if invalid value is given)
const DiscoverAndMeet = ({ category }) => {
  //Use these when testing with 'npm run server'
  //Functions used to retrieve data from the database
  const getProjectData = async () => {
    const url = '/api/projects';
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const projectData = await response.json();

      setFullProjectList(projectData.data);
      setDisplayedProjects(() => firstProjects(projectData.data));
    } catch (error) {
      console.error(error.message);
    }
  };

  const getProfileData = async () => {
    const url = '/api/users';
    try {
      let response = await fetch(url);

      const profileData = await response.json();

      setFullProfileList(profileData.data);
      setProfileColumns(() => firstProfiles(profileData.data));
    } catch (error) {
      console.error(error.message);
    }
  };

  let defaultProjectList = runningServer ? undefined : projects;
  let defaultProfileList = runningServer ? undefined : profiles;

  const [fullProjectList, setFullProjectList] = useState(defaultProjectList);
  const [fullProfileList, setFullProfileList] = useState(defaultProfileList);

  //Makes calls to the database to retrieve data
  //Only does so if relevant data has not been retrieved already
  if (fullProjectList === undefined) {
    getProjectData();
  }
  if (fullProfileList === undefined) {
    getProfileData();
  }

  //List that holds trimmed project data for use in searching
  //Note: Depending on user needs, may need to change or add to what is used in searches
  const projectSearchData =
    fullProjectList != undefined
      ? fullProjectList.map((project) => {
          return { name: project.title, description: project.hook };
        })
      : [];

  //List that holds trimmed profile data for use in searching
  //Note: Depending on user needs, may need to change or add to what is used in searches
  const profileSearchData =
    fullProfileList != undefined
      ? fullProfileList.map((profile) => {
          return {
            name: `${profile.first_name} ${profile.last_name}`,
            username: profile.username,
            bio: profile.bio,
          };
        })
      : [];

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
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  //Gets the height of the text that will be rendered in a profile panel
  //(actual profile text should be implemented later)
  //MARGIN ISN'T GETTING COUNTED
  //Note: data names may need changing when using data from the server
  function getProfilePanelTextHeight(profileData) {
    //Create invisible element
    const textbox = document.createElement('div');
    textbox.style.visibility = 'hidden';
    textbox.className = 'profile-panel';
    textbox.innerHTML = `<h2>${profileData.name}</h2><h3>Profession</h3><div>${profileData.bio}</div>`;
    document.body.appendChild(textbox);

    const textHeight = textbox.offsetHeight;

    textbox.parentElement.removeChild(textbox);

    return textHeight;
  }

  //Get a list of tags to use for tag filters (project tags for projects, profession tags for profiles)
  //const tagList = category === 'projects' ? tags.tags : tags.peopleTags;
  const tagList = category === 'projects' ? tags.tags : tags.peopleTags;
  const [filteredTagList, setFilteredTagList] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  //list of tabs for the filter popup to use, changes depending on if discover or meet page is being used
  let filterPopupTabs =
    category === 'projects'
      ? [
          { categoryTags: tags.projectTypes, categoryName: 'Project Type', color: 'blue' },
          { categoryTags: tags.genres, categoryName: 'Genre', color: 'green' },
          { categoryTags: tags.purposes, categoryName: 'Purpose', color: 'grey' },
        ]
      : [
          { categoryTags: tags.devSkills, categoryName: 'Developer Skill' },
          { categoryTags: tags.desSkills, categoryName: 'Designer Skill' },
          { categoryTags: tags.softSkills, categoryName: 'Soft Skill' },
          { categoryTags: tags.tags, categoryName: 'Role' },
          { categoryTags: tags.tags, categoryName: 'Major' },
        ];

  //Set up panel display functions

  //Variables used for panel displays
  //Find out the width of the flexbox container
  let flexboxWidth: number =
    window.innerWidth >= 800
      ? window.innerWidth - 320 - getScrollbarWidth()
      : window.innerWidth - (100 + getScrollbarWidth());
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
  const firstProjects = (newProjectList) => {
    if (newProjectList === undefined || newProjectList.length === 0) {
      return [];
    }
    //Set new project list to run through
    projectList = newProjectList;
    //Reset projectListPosition
    projectListPosition = 0;

    //empty list of projects to display
    //(Will also include project data when actual projects are used)
    let projectsToDisplay: {
      project;
      width: number;
      adjust: number;
      row: number;
      rightMost: boolean;
    }[] = [];

    //Reset variables, if needed
    widthTracker = -20;
    rowTracker = 0;
    projectTracker = 0;

    //Get first panel's thumbnail and its width/height
    let firstThumbnail = new Image();
    firstThumbnail.src =
      projectList[projectListPosition].thumbnail != null
        ? `images/thumbnails/${projectList[projectListPosition].thumbnail}`
        : profileImage;

    //Set up initial project (ensures first row has something in it)

    //Calculates panel width based on aspect ratio of thumbnail image
    //If no thumbnail is found, randomizes width
    /* 
    Note: for some reason, reaching this page with a new tab/window using a url sometimes causes
    height values of thumbnails to be 0, and as we all know, computers don't like dividing by 0.
    For this reason, an extra check is added to ensure height does not equal 0. In the event it does,
    we randomize width instead of calculating an accurate width.
    */
    let firstPanelWidth =
      projectList[projectListPosition].thumbnail != null && firstThumbnail.height != 0
        ? firstThumbnail.width * (200 / firstThumbnail.height)
        : Math.floor(Math.random() * 200 + 200);
    widthTracker += firstPanelWidth + 20;
    projectsToDisplay.push({
      project: projectList[projectListPosition],
      width: firstPanelWidth,
      adjust: 0,
      row: rowTracker,
      rightMost: false,
    });
    projectListPosition++;
    projectTracker++;

    //Start iterating through projects
    while (rowTracker <= 5 && projectListPosition < projectList.length) {
      //Get thumbnail and its width & height
      let thumbnail = new Image();
      thumbnail.src =
        projectList[projectListPosition].thumbnail != null
          ? `images/thumbnails/${projectList[projectListPosition].thumbnail}`
          : profileImage;
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

      //Calculates panel width based on aspect ratio of thumbnail image
      //If no thumbnail is found, randomizes width
      console.log(thumbnail.width, thumbnail.height);
      let panelWidth =
        projectList[projectListPosition].thumbnail != null && thumbnail.height != 0
          ? thumbnail.width * (200 / thumbnail.height)
          : Math.floor(Math.random() * 200 + 200);
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
            //If this is the last item of the row, note it as such
            if ((project = projectsToDisplay[projectsToDisplay.length - 1])) {
              project.rightMost = true;
            }
          }
        }
        //Increment row tracker
        rowTracker++;
        //Reset width tracker to negative of the flexbox gap value
        widthTracker = panelWidth;
        //Reset project tracker
        projectTracker = 0;
      }
      //if row tracker < a designated row count...
      if (rowTracker < 5) {
        //Add current project to list of projects to display
        //(Will include actual projects later)
        projectsToDisplay.push({
          project: projectList[projectListPosition],
          width: panelWidth,
          adjust: 0,
          row: rowTracker,
          rightMost: false,
        });
        projectListPosition++;
        projectTracker++;
      } else {
        //otherwise...
        //Break project iteration loop
        break;
      }
    }

    //Perform width adjustments on last row
    //Calculate flexboxWidth - total width of all projects
    let flexboxDifference = flexboxWidth - widthTracker;
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
        //If this is the last item of the row, note it as such
        if ((project = projectsToDisplay[projectsToDisplay.length - 1])) {
          project.rightMost = true;
        }
      }
    }

    return projectsToDisplay;
  };

  //Function that adds more panels to render, called when the user scrolls to the bottom of the page
  const addProjects = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.querySelector('.page');

    if (scrollTop + clientHeight >= scrollHeight) {
      let newProjectsToDisplay: {
        project;
        width: number;
        adjust: number;
        row: number;
        rightMost: boolean;
      }[] = [];

      //Reset calculation values
      widthTracker = -20;
      let lastRow = displayedProjects[displayedProjects.length - 1].row + 1;
      rowTracker = displayedProjects[displayedProjects.length - 1].row + 1;
      projectTracker = 0;

      while (rowTracker <= lastRow + 5 && projectListPosition < projectList.length) {
        //Get a width value based on the project's display image's aspect ratio
        //let panelWidth = imageWidth * (100 / imageHeight); [Use this when images are integrated]
        let panelWidth = Math.floor(Math.random() * 200 + 200);
        //Add (width value + flexbox gap value + borders) to width tracker
        widthTracker += panelWidth + 20;
        if (widthTracker > flexboxWidth) {
          let flexboxDifference = flexboxWidth - (widthTracker - (panelWidth + 20));
          //Divide difference to split among project panels' widths (and the remainder);
          let widthAdjustment = Math.floor(flexboxDifference / projectTracker);
          let widthAdjustmentRemainder = flexboxDifference % projectTracker;
          //Loop through all projects inside the most recently completed row
          for (let project of newProjectsToDisplay) {
            if (project.row === rowTracker) {
              //Divide difference evenly amongst all project's widths
              project.adjust = widthAdjustment + widthAdjustmentRemainder;
              widthAdjustmentRemainder = 0;
              //If this is the last item of the row, note it as such
              if ((project = newProjectsToDisplay[newProjectsToDisplay.length - 1])) {
                project.rightMost = true;
              }
            }
          }
          rowTracker++;
          widthTracker = panelWidth;
          projectTracker = 0;
        }
        if (rowTracker < lastRow + 5) {
          //Add current project to list of projects to display
          newProjectsToDisplay.push({
            project: projectList[projectListPosition],
            width: panelWidth,
            adjust: 0,
            row: rowTracker,
            rightMost: false,
          });
          projectListPosition++;
          projectTracker++;
        } else {
          break;
        }
      }

      //Append new project list to existing one
      setDisplayedProjects(displayedProjects.concat(newProjectsToDisplay));
    }
  };

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
      let resizedProjects: {
        project;
        width: number;
        adjust: number;
        row: number;
        rightMost: boolean;
      }[] = [];
      //Calculate new flexbox width
      flexboxWidth =
        window.innerWidth >= 800
          ? window.innerWidth - 320 - getScrollbarWidth()
          : window.innerWidth - (100 + getScrollbarWidth());
      //Reset tracker variables (widthTracker, rowTracker, projectTracker)
      widthTracker = -20;
      rowTracker = 0;
      projectTracker = 0;
      //Iterate through all currently displayed projects
      //For each project...
      ///There is some sort of bug happening here, occasionally more than the max projects are being displayed
      ///Issue only seems to occur after saving new code while test server is being hosted, so it may not need to be addressed
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
              //If this is the last item of the row, note it as such
              if ((rowProject = resizedProjects[resizedProjects.length - 1])) {
                rowProject.rightMost = true;
              }
            }
          }
          //Increment & reset tracker variables
          rowTracker++;
          widthTracker = project.width;
          projectTracker = 0;
        }
        //Add project to resized projects &  increment projectTracker
        resizedProjects.push({
          project: project.project,
          width: project.width,
          adjust: 0,
          row: rowTracker,
          rightMost: false,
        });
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
          //If this is the last item of the row, note it as such
          if ((rowProject = resizedProjects[resizedProjects.length - 1])) {
            rowProject.rightMost = true;
          }
        }
      }

      //Set displayed projects state
      setDisplayedProjects(resizedProjects);
    }, 100);

    //Also ensure scroll buttons display correctly on resize
    resizeTagFilter();
  };

  //Updates filtered project list with new search info
  const searchProjects = (searchResults) => {
    //searchResults structure: array[array[{object1},{object2}]]
    //Reset filtersProjectList
    filteredProjectList = [];
    //Filter through searchResults and original search data
    for (let result of searchResults[0]) {
      for (let item of projectSearchData) {
        //If 2 items match...
        if (result === item) {
          //Get index of item in original search data
          //Get item with this index in projectList
          let projectItem = fullProjectList[projectSearchData.indexOf(item)];
          //Push this item to filteredProjectList
          filteredProjectList.push(projectItem);
          continue;
        }
      }
    }

    // if no projects were found
    if (filteredProjectList.length === 0) {
      projectList = filteredProjectList;
      setDisplayedProjects([]); // clear the displayed list
      console.log('No matching projects found.');
    } else {
      // if projects are found, update the list
      updateProjectList();
    }
  };

  //Make new list of projects by mapping new filtered list
  const updateProjectList = () => {
    console.log('length: ' + filteredProjectList.length);
    //Note: tags are not included in current mySQL database for projects
    let tagFilteredList = filteredProjectList.filter((project) => {
      console.log(project);
      //Filter check to ensure if we include an item or not
      let tagFilterCheck = true;
      //Sets all tags to lowercase, for easier tag reading
      let lowercaseProjectTags = project.tags.map((tag) => {
        return tag.tag.toLowerCase();
      });
      //if project in filtered list contains all tags in taglist, include it
      for (let tag of activeTagFilters) {
        if (!lowercaseProjectTags.includes(tag)) {
          tagFilterCheck = false;
          break;
        }
      }

      return tagFilterCheck;
    });

    //If no tags are currently selected, render all projects
    // !! Needs to be skipped if searchbar has any input !!
    if (tagFilteredList.length === 0 && activeTagFilters.length === 0) {
      tagFilteredList = JSON.parse(JSON.stringify(fullProjectList));
    }
    //set displayed projects using firstProjects
    setDisplayedProjects(() => firstProjects(tagFilteredList));
  };

  //Calls when page first loads & when a new list of profiles is being used (e.g. after a search)
  const firstProfiles = (newProfileList) => {
    if (newProfileList === undefined) {
      return [[]];
    }
    profileList = newProfileList;
    profileListPosition = 0;
    //Reset height trackers
    heightTrackers = [];
    //Calculate the width of available space (flexboxWidth contains this in this file)
    //Divide that width and determine how many columns can fit
    let totalColumns = Math.floor(flexboxWidth / 224);
    //Create a number of arrays to hold profile panels equal to the number of columns
    //Also, create height trackers for each column
    let columnsToDisplay: { profile; height: number }[][] = [];
    for (let i = 0; i < totalColumns; i++) {
      columnsToDisplay.push([]);
      heightTrackers.push(0);
    }
    //Start iterating through profiles (set limit of 30 profiles at first render)
    //For each profile... (until all profiles are used or 30 are used)
    for (let i = 0; i < 30; i++) {
      //If there are no more profiles to use, break this loop
      if (profileListPosition >= profileList.length) {
        break;
      }
      //Calculate height based off of image + any extra space for info
      //(For testing purposes, height is randomized)
      let panelHeight =
        Math.floor(Math.random() * 300 + 200) + getProfilePanelTextHeight(profileList[i]);
      //Check which column has the least height currently (if multiple have same, use first)
      let shortestColumn = 0;
      for (let j = 1; j < heightTrackers.length; j++) {
        if (heightTrackers[j] < heightTrackers[shortestColumn]) {
          shortestColumn = j;
        }
      }
      //Add current profile to column with least height
      columnsToDisplay[shortestColumn].push({ profile: profileList[i], height: panelHeight });
      //Also add current profile to displayedProfileList
      displayedProfileList.push({ profile: profileList[i], height: panelHeight });
      profileListPosition++;
      //Add profile height to column's height tracker
      heightTrackers[shortestColumn] += panelHeight;
    }

    //Return full set of arrays
    return columnsToDisplay;
  };

  //Function that handles adding new profiles when scrolling to the bottom of the page
  const addProfiles = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.querySelector('.page');

    if (scrollTop + clientHeight >= scrollHeight) {
      //Get current set of displayed profiles
      let newProfilePanels: { profile; height: number }[][] = JSON.parse(
        JSON.stringify(profileColumns)
      );
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
        let panelHeight = Math.floor(Math.random() * 300 + 200);
        //Find column with shortest height
        let shortestColumn = 0;
        for (let j = 1; j < heightTrackers.length; j++) {
          if (heightTrackers[j] < heightTrackers[shortestColumn]) {
            shortestColumn = j;
          }
        }
        //Add profile to column with shortest height
        newProfilePanels[shortestColumn].push({
          profile: profileList[profileListPosition],
          height: panelHeight,
        });
        //Add profile to displayedProfileList
        displayedProfileList.push({
          profile: profileList[profileListPosition],
          height: panelHeight,
        });
        profileListPosition++;
        //Add profile's height to column's height tracker
        heightTrackers[shortestColumn] += panelHeight;
      }
      //Set profileColumns with newly added profiles
      setProfileColumns(newProfilePanels);
    }
  };

  //Function that handles resizing of profile panels
  const resizeProfiles = () => {
    //Get time this function was called
    let thisCall: number = new Date().getTime();
    lastResizeCall = thisCall;
    //Set timer to check whether to continue this call or not
    setTimeout(() => {
      //If this is no longer the most recent call, stop this call
      if (lastResizeCall !== thisCall) {
        return;
      }

      //Check current flexbox width & number of columns it can hold
      flexboxWidth =
        window.innerWidth >= 800
          ? window.innerWidth - 320 - getScrollbarWidth()
          : window.innerWidth - (100 + getScrollbarWidth());
      let newColumns = Math.floor(flexboxWidth / 224);
      //If number of columns available has changed...
      if (newColumns !== heightTrackers.length) {
        //Construct new array to contain resized column info
        let resizedColumnsToDisplay: { profile; height: number }[][] = [];
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
        } else {
          //else (if more)...
          //Add height trackers to match new limit
          while (heightTrackers.length < newColumns) {
            heightTrackers.push(0);
          }
        }
        //Fill new column info array with empty arrays
        for (let i = 0; i < heightTrackers.length; i++) {
          resizedColumnsToDisplay.push([]);
        }
        //Get current set of displayed profiles (not profileColumns, need an unaltered list)
        //For each profile...
        let loopTracker = 0;
        for (let profile of displayedProfileList) {
          //Check which column has the least height currently (use first if there's a tie)
          let shortestColumn = 0;
          for (let i = 1; i < heightTrackers.length; i++) {
            if (heightTrackers[i] < heightTrackers[shortestColumn]) {
              shortestColumn = i;
            }
          }
          //Add profile to the least tallest column currently
          resizedColumnsToDisplay[shortestColumn].push({
            profile: profile.profile,
            height: profile.height,
          });
          //Add profile height to the column's height tracker
          heightTrackers[shortestColumn] += profile.height;
          loopTracker++;
        }
        //Set profileColumns to newly created resized columns
        console.log(loopTracker);
        console.log(displayedProfileList);
        console.log(resizedColumnsToDisplay);
        setProfileColumns(resizedColumnsToDisplay);
      }
    }, 100);

    //Also ensure scroll buttons display correctly on resize
    resizeTagFilter();
  };

  const updateProfileList = () => {
    //Note: tags are not included in current mySQL database for profiles

    let tagFilterCheck = true;
    let tagFilteredList = filteredProfileList.filter((profile) => {
      //if project in filtered list contains all tags in taglist, include it
      for (let tag of activeTagFilters) {
        //No tags yet, so this is commented out for now
        //Remember to set profile tags to lower case
        /*if (!project.tags.includes(tag)) {
          tagFilterCheck = false;
          break;
        }*/
      }

      return tagFilterCheck;
    });

    //If no tags are currently selected, render all projects
    // !! Needs to be skipped if searchbar has any input !!
    if (tagFilteredList.length === 0 && activeTagFilters.length === 0) {
      tagFilteredList = JSON.parse(JSON.stringify(fullProfileList));
    }

    setProfileColumns(() => firstProfiles(tagFilteredList));
  };

  //Updates filtered profile list with new search info
  const searchProfiles = (searchResults) => {
    filteredProfileList = [];
    //Filter through searchResults and original search data
    for (let result of searchResults[0]) {
      for (let item of profileSearchData) {
        //If 2 items match...
        if (result === item) {
          //Get index of item in original search data
          //Get item with this index in profileList
          let profileItem = fullProfileList[profileSearchData.indexOf(item)];
          //Push this item to filteredProfileList
          filteredProfileList.push(profileItem);
        }
      }
    }

    // if no profiles were found
    if (filteredProfileList.length === 0) {
      profileList = filteredProfileList;
      setProfileColumns([]); // clear the profile  columns
      console.log('No matching profiles found.');
    } else {
      // if profiles are found, update the list
      updateProfileList();
    }
  };

  //Choose which functions to use based on what we are displaying
  const addContent = category === 'projects' ? addProjects : addProfiles;
  const resizeDisplay = category === 'projects' ? resizeProjects : resizeProfiles;
  const updateItemList = category === 'projects' ? updateProjectList : updateProfileList;

  //Can possibly merge these two into a single useState? mostly concerned with different variable types
  //Holds data for currently displayed projects
  let [displayedProjects, setDisplayedProjects] = useState<
    { project; width: number; adjust: number; row: number; rightMost: boolean }[]
  >(() => firstProjects(fullProjectList));
  //Holds data for currently displayed profiles
  let [profileColumns, setProfileColumns] = useState<{ profile; height: number }[][]>(() =>
    firstProfiles(fullProfileList)
  );

  //Runs resizing function whenever window width changes
  //Don't add dependencies to it - it causes state to be reset for some reason (I don't know why)
  useEffect(() => {
    window.addEventListener('resize', resizeDisplay);
    return () => {
      window.removeEventListener('resize', resizeDisplay);
    };
  });

  //Function called when a tag is clicked, adds the tag to the list of filters being used
  const toggleTag = (e, tagName: string) => {
    //Check if the tag is already in activeTagFilters
    //if it isn't...
    if (!activeTagFilters.includes(tagName)) {
      //Add this tag to the list
      activeTagFilters.push(tagName);
    } else {
      //else... (it is in there)
      //Remove this tag from the list
      activeTagFilters.splice(activeTagFilters.indexOf(tagName), 1);
    }
    //Also, toggle the tag filter's display
    e.target.classList.toggle('discover-tag-filter-selected');

    console.log(activeTagFilters);
    updateItemList();
  };

  //Function called when scroll arrows are clicked
  //Scrolls the list of tag filters right or left
  const scrollTags = (direction) => {
    //Check if left or right button was clicked
    let tagFilterElement = document.getElementById('discover-tag-filters');
    //Check other button is hidden, if so...
    if (
      document.getElementById('filters-left-scroll').classList.contains('hide') ||
      document.getElementById('filters-right-scroll').classList.contains('hide')
    ) {
      //Un-hide the other scrolling button
      document.getElementById('filters-left-scroll').classList.remove('hide');
      document.getElementById('filters-right-scroll').classList.remove('hide');
    }
    //If we are going to hit the edge with this scroll...
    if (tagFilterElement.scrollLeft - 800 <= 0 && direction === 'left') {
      //hide the relevant scrolling button
      document.getElementById('filters-left-scroll').classList.add('hide');
    } else if (
      tagFilterElement.scrollLeft + tagFilterElement.offsetWidth + 800 >=
        tagFilterElement.scrollWidth &&
      direction === 'right'
    ) {
      document.getElementById('filters-right-scroll').classList.add('hide');
    }
    //Scroll tag bar left or right by a certain amount
    if (direction === 'left') {
      tagFilterElement.scrollBy(-800, 0);
    } else if (direction === 'right') {
      tagFilterElement.scrollBy(800, 0);
    }
  };

  //Called when resizing page
  //ensures that scroll buttons show and hide when they're supposed to on resizes
  const resizeTagFilter = () => {
    let tagFilterElement = document.getElementById('discover-tag-filters');
    let leftScroller = document.getElementById('filters-left-scroll');
    let rightScroller = document.getElementById('filters-right-scroll');
    //If tag filter is scrolled all the way left, hide left scroll button
    //If tag filter is not all the way left, ensure button is showed
    if (tagFilterElement.scrollLeft <= 0 && !leftScroller.classList.contains('hide')) {
      leftScroller.classList.add('hide');
    } else if (tagFilterElement.scrollLeft > 0 && leftScroller.classList.contains('hide')) {
      leftScroller.classList.remove('hide');
    }
    //If tag filter is all the way right, hide right scroll button
    //If tag filter is not all the way right, ensure button is showed
    if (
      tagFilterElement.scrollLeft + tagFilterElement.offsetWidth >= tagFilterElement.scrollWidth &&
      !rightScroller.classList.contains('hide')
    ) {
      rightScroller.classList.add('hide');
    } else if (
      tagFilterElement.scrollLeft + tagFilterElement.offsetWidth < tagFilterElement.scrollWidth &&
      rightScroller.classList.contains('hide')
    ) {
      rightScroller.classList.remove('hide');
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    'assets/bannerImages/project1_dark.png',
    'assets/bannerImages/project2_dark.png',
    'assets/bannerImages/project3_dark.png',
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // replaced the hero banner with an image carousel
  let projectHero = (
    <>
      {
        <div id="project-hero-bg1">
          <div id="project-hero">
            <div id="project-image-carousel-content">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="project-image-carousel-item"
                  style={{
                    transform: `translateX(${(index - currentIndex) * 100}%)`,
                  }}
                >
                  <ThemeIcon
                    light={`assets/bannerImages/project${index + 1}_light.png`}
                    dark={`assets/bannerImages/project${index + 1}_dark.png`}
                    alt={`project-image-${index}`}
                  />
                </div>
              ))}
            </div>

            {/* carousel nav buttons */}
            <div id="project-image-carousel-buttons">
              <button id="project-image-carousel-left" onClick={handlePrev}>
                <ThemeIcon
                  light={'assets/arrow_light.png'}
                  dark={'assets/arrow_dark.png'}
                  alt={'Previous'}
                />
              </button>
              <button id="project-image-carousel-right" onClick={handleNext}>
                <ThemeIcon
                  light={'assets/arrow_light.png'}
                  dark={'assets/arrow_dark.png'}
                  alt={'Next'}
                />
              </button>
            </div>
          </div>
        </div>
      }
    </>
  );

  // Old hero banner for project display
  // let projectHero = <>{
  //   <div id='project-hero-bg1'>
  //     <div id='project-hero'>

  //       <div id='project-hero-blurb-1' className='project-hero-blurb'>
  //       <img id='project-hero-img-1'
  //       className='theme-icon'
  //       src="assets/bannerImages/project1_dark.png"
  //       src-light="assets/bannerImages/project1_light.png"
  //       src-dark="assets/bannerImages/project1_dark.png"
  //       />
  //         {/* <div>
  //         <span className='project-hero-highlight'>Discover projects</span> to see what they're about and what roles they're looking for.
  //         </div> */}
  //       </div>

  //       <div id='project-hero-blurb-2' className='project-hero-blurb'>
  //       <h2>Look for projects to work on!</h2>
  //         <img id='project-hero-img-2'
  //         className='theme-icon'
  //         src="assets/bannerImages/project2_dark.png"
  //         src-light="assets/bannerImages/project2_light.png"
  //         src-dark="assets/bannerImages/project2_dark.png"
  //         />
  //         {/* <div className="panel-text">
  //         Interested in joining? <span className='project-hero-highlight'>Send a message!</span> <br/>
  //         <div id='spacer'></div>
  //         Introduce yourself, share your interest in working together, and what skills you have to offer!
  //         </div> */}
  //       </div>

  //       <div id='project-hero-blurb-3' className='project-hero-blurb'>
  //       <img id='project-hero-img-3'
  //       className='theme-icon'
  //       src="assets/bannerImages/project3_dark.png"
  //       src-light="assets/bannerImages/project3_light.png"
  //       src-dark="assets/bannerImages/project3_dark.png"
  //       />
  //         {/* <div>
  //         Sort through projects by categories and filter according to your skills or interests to
  //         <span className='project-hero-highlight'> find your group!</span>
  //         </div> */}
  //       </div>
  //     </div>
  //   </div>
  // }</>

  //Hero banner for profile display
  let profileHero = (
    <>
      {
        <div id="profile-hero-bg1">
          <div id="profile-hero">
            <div id="profile-hero-blurb-1" className="profile-hero-blurb">
              <ThemeIcon
                light={'assets/bannerImages/people1_light.png'}
                dark={'assets/bannerImages/people1_dark.png'}
                id={'profile-hero-img-1'}
              />
              {/* <div>
          <span className='profile-hero-highlight'>Explore profiles</span> to see each other's personality, expertise, and project history.
          </div> */}
            </div>

            <div id="profile-hero-blurb-2" className="profile-hero-blurb">
              <h2>Look for people to work with!</h2>
              <ThemeIcon
                light={'assets/bannerImages/people2_light.png'}
                dark={'assets/bannerImages/people2_dark.png'}
                id={'profile-hero-img-2'}
              />
              {/* <div className="panel-text">
          Find someone interesting? <span className='profile-hero-highlight'>Send a message!</span><br/>
          <div id='spacer'></div>
          <span className='profile-hero-highlight'>Introduce yourself</span>, share project ideas, and show interest in working together!
          </div> */}
            </div>

            <div id="profile-hero-blurb-3" className="profile-hero-blurb">
              <ThemeIcon
                light={'assets/bannerImages/people3_light.png'}
                dark={'assets/bannerImages/people3_dark.png'}
                id={'profile-hero-img-3'}
              />
              {/* <div>
          Keep your profile up to date with your skills, project preferences, and interests to 
          <span className='profile-hero-highlight'> find your group!</span>
          </div> */}
            </div>
          </div>
        </div>
      }
    </>
  );

  //Displays a set of project panels
  let projectContent = (
    <>
      {projectList.length > 0 ? (
        //For each project in project display list... (use map)
        displayedProjects.map((project) => (
          //Create a Project Panel component
          <ProjectPanel
            width={project.width + project.adjust}
            projectData={project}
            rightAlign={project.rightMost}
          ></ProjectPanel>
        ))
      ) : (
        <>Sorry, no projects here</>
      )}
    </>
  );

  //Displays a set of profile panels
  let profileContent = (
    <>
      {profileList.length > 0 ? (
        //For each array in profileColumns...
        profileColumns.map((column) => (
          //Create a column element & map through profiles in array
          <div>
            {column.map((profile) => (
              <ProfilePanel profileData={profile.profile} height={profile.height}></ProfilePanel>
            ))}
          </div>
        ))
      ) : (
        <>Unfortunately, such a person does not exist</>
      )}
    </>
  );

  const toggleFilterTag = (e, tagName: string) => {
    //Check if the tag is already in popupTagSelections
    //if it isn't...
    if (!popupTagSelections.includes(tagName)) {
      //Add this tag to the list
      popupTagSelections.push(tagName);
    } else {
      //else... (it is in there)
      //Remove this tag from the list
      popupTagSelections.splice(popupTagSelections.indexOf(tagName), 1);
    }
    //Also, toggle the tag filter's display
    e.target.classList.toggle('tag-button-selected');
    console.log(popupTagSelections);
  };

  const setFilterTags = () => {
    console.log('Im still being called!!! woohoo');
    //Update active filters with currently selected tags
    //JSON parsing is used to ensure this is a deep copy
    extraTagFilters = JSON.parse(JSON.stringify(popupTagSelections));
    //Run search through panels with new filters in place
    //There are no checks that include extraTagFilters yet, as tags are not fully implemented
    //Be sure to add a filter/check to updateItemList once tags are implemented more fully
    updateItemList();
  };

  let FilterCategory = ({ filterTagList, id, categoryTitle, tagColor = 'grey' }) => {
    const [displayedTags, setDisplayedTags] = useState(filterTagList);

    return (
      <div id={id} className="filter-category">
        <h2>{categoryTitle}</h2>
        <hr />
        {/* dataSets contains list of tags, onSearch will use function to add tag to list */}
        <SearchBar dataSets={{ data: filterTagList }} onSearch={() => {}} />
        {/* List of tags, use flexbox */}
        <div className="filter-category-tags">
          {displayedTags.map((tag) => {
            let selected = popupTagSelections.includes(tag) ? 'tag-button-selected' : '';
            return (
              <button
                className={`tag-button tag-button-${tagColor} ${selected}`}
                onClick={(e) => {
                  toggleFilterTag(e, tag);
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  let filterPopup =
    category === 'projects' ? (
      <>
        {
          <>
            <h2>Filters</h2>
            <div id="filter-popup-projects">
              <FilterCategory
                filterTagList={tags.projectTypes}
                id="filter-popup-categories"
                categoryTitle="Categories"
                tagColor="blue"
              />
              <FilterCategory
                filterTagList={tags.tags}
                id="filter-popup-genres"
                categoryTitle="Genres"
                tagColor="green"
              />
              <FilterCategory
                filterTagList={tags.projectDetails}
                id="filter-popup-misc"
                categoryTitle="Misc."
              />
            </div>
            <PopupButton buttonId="filter-popup-apply" callback={setFilterTags}>
              Apply
            </PopupButton>
          </>
        }
      </>
    ) : (
      <>
        {
          <>
            <h2>Filters</h2>
            <div id="filter-popup-profiles">
              <FilterCategory
                filterTagList={tags.devSkills}
                id="filter-popup-dev-skills"
                categoryTitle="Developer Skills"
                tagColor="yellow"
              />
              <FilterCategory
                filterTagList={tags.desSkills}
                id="filter-popup-des-skills"
                categoryTitle="Designer Skills"
                tagColor="red"
              />
              <FilterCategory
                filterTagList={tags.proficiencies}
                id="filter-popup-roles"
                categoryTitle="Roles"
              />
              <FilterCategory
                filterTagList={tags.tags}
                id="filter-popup-majors"
                categoryTitle="Majors"
              />
              <FilterCategory
                filterTagList={tags.softSkills}
                id="filter-popup-soft-skills"
                categoryTitle="Soft Skills"
                tagColor="indigo"
              />
            </div>
            <PopupButton buttonId="filter-popup-apply" callback={setFilterTags}>
              Apply
            </PopupButton>
          </>
        }
      </>
    );

  //Decides which 'content' to display on the page

  // let heroContent = category === 'projects' ? <ImageCarousel carouselType='Discover'/> : profileHero;
  let heroContent = category === 'projects' ? projectHero : profileHero;
  let panelContent = category === 'projects' ? projectContent : profileContent;

  // determine if screen width big enough to hide right scroll button
  const toHideRight = window.innerWidth >= 1450 ? 'hide' : '';

  const [currentTags, setCurrentTags] = useState([]);
  const [searchedTags, setSearchedTags] = useState([]);
  const [enabledFilters, setEnabledFilters] = useState([]);

  // helper function to check if the enabledFilters contains a particular tag
  const isTagEnabled = (tag, color) => {
    for (let i = 0; i < enabledFilters.length; i++) {
      if ((enabledFilters[i].tag === tag) && (enabledFilters[i].color === color)) {
        return i;
      }
    }

    return -1;
  }

  // Reset values when filter popup is closed
  const resetFilters = () => {
    setCurrentTags([]);
    setSearchedTags([]);
    setEnabledFilters([]);
  }

  return (
    <div className="page" onScroll={addContent}>
      {/* Search bar and profile/notification buttons */}
      <Header
        dataSets={[{ data: category === 'projects' ? projectSearchData : profileSearchData }]}
        onSearch={category === 'projects' ? searchProjects : searchProfiles}
      />
      {/* Contains the hero display, carossel if projects, profile intro if profiles*/}
      <div id="discover-hero">
        {heroContent}
        <br></br>
      </div>

      {/* Contains tag filters & button to access more filters 
        When page loads, determine if project tags or profile tags should be used
        Clicking a tag filter adds it to a list & updates panel display based on that list
        Changes to filters via filter menu are only applied after a confirmation
      */}
      <div id="discover-filters">
        <div id="discover-tag-filters-container">
          <button
            id="filters-left-scroll"
            className="filters-scroller hide"
            onClick={() => scrollTags('left')}
          >
            <i className="fa fa-caret-left"></i>
          </button>
          <div id="discover-tag-filters">
            {tagList.map((tag) => (
              <button
                className="discover-tag-filter"
                onClick={(e) => toggleTag(e, tag.toLowerCase())}
              >
                {tag}
              </button>
            ))}
          </div>
          <button
            id="filters-right-scroll"
            className={`filters-scroller ${toHideRight}`}
            onClick={() => scrollTags('right')}
          >
            <i className="fa fa-caret-right"></i>
          </button>
        </div>
        <Popup>
          <PopupButton buttonId={'discover-more-filters'} callback={resetFilters}>
            <ThemeIcon light={'assets/filters_light.png'} dark={'assets/filters_dark.png'} />
          </PopupButton>
          {/* When page loads, get all necessary tag lists based on page category
          Place these lists in an array, along with an identifier for which column they belong
          map through these lists to construct filter dropdown
          displayed tags are determined using a state variable, changable w/ searchbar
          tags have an onClick function that adds their tag to a full tag list 
          full tag list is only applied when hitting done, which then pushes the info to an active list*/}
          <PopupContent>
            <h2>Project Filters</h2>
            <div id='filters' className='popup-section'>
              <SearchBar
                dataSets={[{ data: currentTags }]}
                onSearch={(results) => {
                  setSearchedTags({ tags: results[0], color: searchedTags.color });
                }}
              ></SearchBar>
              <div id='filter-tabs'>
                {filterPopupTabs.map((tab) => (
                  <a
                    className='filter-tab'
                    onClick={(e) => {
                      // Remove .selected from all 3 options, add it only to current button
                      let tabs = document.querySelector('#filter-tabs').children;
                      for (let i = 0; i < tabs.length; i++) {
                        tabs[i].classList.remove('selected');
                      }
                      e.target.classList.add('selected');
                      setCurrentTags(tab.categoryTags);
                      setSearchedTags({ tags: tab.categoryTags, color: tab.color });
                    }}
                  >
                    {tab.categoryName}
                  </a>
                ))}
              </div>
              <hr />
              <div id='filter-tags'>
                {searchedTags.length === 0 ? (
                  <p>No tags found. Please make sure you have a tab selected.</p>
                ) : (
                  searchedTags.tags.map((tag) => (
                    <button
                      // className={`tag-button tag-button-${searchedTags.color}-unselected`}
                      className={`tag-button tag-button-${searchedTags.color}-${isTagEnabled(tag, searchedTags.color) !== -1 ? 'selected' : 'unselected'}`}
                      onClick={(e) => {
                        let selecIndex = isTagEnabled(tag, searchedTags.color);

                        if (selecIndex === -1) {
                          // Creates an object to store text and category
                          //setEnabledFilters([...enabledFilters, { tag, color: searchedTags.color }]);
                          setEnabledFilters([...enabledFilters, { tag, color: searchedTags.color }]);
                          e.target.classList.replace(
                            `tag-button-${searchedTags.color}-unselected`, 
                            `tag-button-${searchedTags.color}-selected`
                          );
                        } else {
                          // Remove tag from list of enabled filters
                          setEnabledFilters(enabledFilters.toSpliced(selecIndex, 1));
                          e.target.classList.replace(
                            `tag-button-${searchedTags.color}-selected`, 
                            `tag-button-${searchedTags.color}-unselected`
                          );
                        }
                      }}
                    >
                      <i className={isTagEnabled(tag, searchedTags.color) !== -1 ? 'fa fa-check' : 'fa fa-plus'}></i>
                      &nbsp;{tag}
                    </button>
                  ))
                )}
              </div>
            </div>
            <div id="selected-section" className="popup-section">
              <h3>Selected</h3>
              <h4>Click to deselect</h4>
              <div id="selected-filters">
                {enabledFilters.map((tag) => (
                  <button 
                    className={`tag-button tag-button-${tag.color}-selected`}
                    onClick={(e) => {
                      // Remove tag from list of enabled filters, re-rendering component
                      console.log(tag);
                      console.log(isTagEnabled(tag.tag, tag.color));
                      setEnabledFilters(enabledFilters.toSpliced(isTagEnabled(tag.tag, tag.color), 1));
                    }}
                  >
                    <i className="fa fa-close"></i>
                    &nbsp;{tag.tag}
                  </button>
                ))}
              </div>
            </div>
            {/* <button
              className="primary-btn"
              onClick={() => {
                // TO-DO: Apply selected filters to search and close popup
                // Closing the popup is kinda tough since I don't have access
                // to the "open" state variable and useContext can't be called
                // inside of a callback. Any attempts to reference it inside
                // <PopupContent> don't seem to be working either
                // 
                // Applying selected filters shouldn't be as tough. mostly a 
                // matter of adding the filters via toggleTag(), or by adding to
                // the activeTagFilters object without doing that, which might
                // be easier in the end. Not too sure though.
              }}
            >
              Apply
            </button> */}
            <PopupButton 
              buttonId={'primary-btn'} 
              callback={() => {
                // Reset tag filters before adding results in
                activeTagFilters = [];
                filteredProjectList = fullProjectList;
                const discoverFilters = document.getElementsByClassName('discover-tag-filter');

                for (let i = 0; i < enabledFilters.length; i++) {
                  // Other from 'Projects' and Other from 'Genres' are treated the same when searching
                  activeTagFilters.push(enabledFilters[i].tag.toLowerCase());

                  // Check if any enabled filters matches a discover tag, and visually toggle it
                  for (let j = 0; j < discoverFilters.length; j++) {
                    if (discoverFilters[j].innerHTML.toLowerCase() === enabledFilters[i].tag.toLowerCase()) {
                      discoverFilters[j].classList.add('discover-tag-filter-selected');
                    }
                  }
                }

                // Update the project list
                updateProjectList();
                resetFilters();
              }}
            >Apply</PopupButton>
          </PopupContent>
        </Popup>
      </div>

      {/* Panel container */}
      <div id="discover-panel-box">{panelContent}</div>

      <CreditsFooter />
      <ToTopButton />
    </div>
  );
};

//2 extra components that only serve as different layouts for the above component
//Required due to the page failing to re-render when switching between its 2 view via the sidebar
//Some bugs that may appear may be due to values outside the main component not being reset on a component change
//If that's the case, simply reset them in here
export const Discover = () => {
  //Reset tags
  activeTagFilters = [];
  extraTagFilters = [];
  popupTagSelections = [];
  return <DiscoverAndMeet category={'projects'} />;
};

export const Meet = () => {
  //Reset variables
  activeTagFilters = [];
  extraTagFilters = [];
  popupTagSelections = [];
  displayedProfileList = [];
  return <DiscoverAndMeet category={'profiles'} />;
};

// export default DiscoverAndMeet
