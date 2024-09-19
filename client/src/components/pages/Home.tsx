import "./pages.css";
import { ProjectCard } from "../ProjectCard";
import { ProfileCard } from "../ProfileCard";
import { ProjectPanel } from "../ProjectPanel";
import { DiscoverButton } from "../DiscoverButton";
import { NotifButton } from "../NotificationButton";
import { SearchBar } from "../SearchBar";
import { TagFilter } from "../TagFilter";
import "../Styles/styles.css";
import { projects } from "../../constants/fakeData";
import { profiles } from "../../constants/fakeData";
import { Children, useCallback } from "react";
import { sortItems } from "../../functions/itemSort";
import { useState } from 'react';
import { useEffect } from 'react' ;
import CreditsFooter from '../CreditsFooter';
import ToTopButton from "../ToTopButton";

//the main discover page- see a list of people and projects
const Home = (props) => {

    // Sets the default content of the page to be 'projects' and 
    // listens to changes in the tab
    let DEFAULT_TAB = 'Projects';
    let [selectedTab, setSelectedTab] = useState(DEFAULT_TAB);

    // --- Searching ---

    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [filteredProfiles, setFilteredProfiles] = useState(profiles);

    const HandleSearch = (results) => {
        setFilteredProjects(results[0]);
        setFilteredProfiles(results[1]);
    }

    //--------------------------

    //To-do: 
    //Figure out infinite scrolling
    //Consider how window re-sizing will function
    // Maybe add padding that adjusts to resizing
    // Once padding hits a minimum size, re-render panels to a narrower size
    // Help minimize how much re-rendering would be needed

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

    //Get list of projects (and check if it exists/has content)
    //Create empty list of projects to display
    //(Will also include project data when actual projects are used)
    let projectsToDisplay : {width : number, adjust : number, row : number}[] = [];
    
    //Find out the width of the flexbox container
    //Number is hard-coded for now, figure out math after row setting up is done
    let flexboxWidth : number = window.innerWidth - 220 - getScrollbarWidth();
    //Create width tracker, set it equal to negative of the flexbox gap value
    let widthTracker : number = -20;
    //Create row tracker, which tracks the number of "full" flexbox rows
    let rowTracker : number = 0;
    //Create project tracker, which tracks the number of project panels that will be placed in a row
    let projectTracker : number = 0;
    //Start iterating through projects
    //For each project... (For testing purposes, will just loop until break condition is met)
    while (rowTracker <= 5) {
        //Get a width value based on the project's display image's aspect ratio
        //(For testing's sake, width will be randomized)
        let panelWidth = Math.floor((Math.random() * 200) + 200);
        //Add (width value + flexbox gap value) to width tracker
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
                if (project.row == rowTracker) {
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
            projectsToDisplay.push({width: panelWidth, adjust: 0, row: rowTracker});
            projectTracker++;
        } else { //otherwise...
            //Break project iteration loop
            break;
        }  
    }

    //Holds data for currently displayed projects
    let [displayedProjects, setDisplayedProjects] = 
        useState<{width : number, adjust : number, row : number}[]>(projectsToDisplay);

    const addContent = () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.querySelector(".page");

        if (scrollTop + clientHeight >= scrollHeight) {
            console.log("addContent called");

            let newProjectsToDisplay : {width : number, adjust : number, row : number}[] = [];

            //Reset calculation values
            widthTracker = -20;
            let lastRow = displayedProjects[displayedProjects.length - 1].row + 1;
            rowTracker = displayedProjects[displayedProjects.length - 1].row + 1;
            projectTracker = 0;
            console.log(lastRow);
            //console.log(rowTracker);
            console.log(displayedProjects);

            while (rowTracker <= lastRow + 5) {
                //Get a width value based on the project's display image's aspect ratio
                let panelWidth = Math.floor((Math.random() * 200) + 200);
                //Add (width value + flexbox gap value) to width tracker
                widthTracker += panelWidth + 24;
                if (widthTracker > flexboxWidth) {
                    let flexboxDifference = flexboxWidth - (widthTracker - (panelWidth + 24));
                    //Divide difference to split among project panels' widths (and the remainder);
                    let widthAdjustment = Math.floor(flexboxDifference / projectTracker);
                    let widthAdjustmentRemainder = flexboxDifference % projectTracker;
                    //Loop through all projects inside the most recently completed row
                    for (let project of newProjectsToDisplay) {
                        if (project.row == rowTracker) {
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
                    newProjectsToDisplay.push({width: panelWidth, adjust: 0, row: rowTracker});
                    projectTracker++;
                } else { 
                    break;
                }  
            }

            setDisplayedProjects(displayedProjects.concat(newProjectsToDisplay));
        }
    }

    //Whenever window gets resized, updates the display of project panels
    //Tracks the time of the most recent call
    let lastResizeCall : number = 0;
    const resizeDisplay = () => {
        //console.log("resize called");
        //Get time this function was called
        let thisCall : number = new Date().getTime();
        //Set lastResizeCall to thisCall
        lastResizeCall = thisCall;
        //Set timer to check whether to continue this call or not
        //If this is no longer the most recent call, stop this call
        setTimeout(() => {
            if (lastResizeCall != thisCall) {
                console.log('call cancelled');
                console.log(thisCall, lastResizeCall);
                return;
            } else {
    
            }
            console.log('call commenced');
    
            //Similar to initial project panel rendering, just uses all currently displays projects
            //instead of adding new ones
            //Array holding edited project details
            let resizedProjects : {width : number, adjust : number, row : number}[] = [];
            //Calculate new flexbox width
            flexboxWidth = window.innerWidth - 220 - getScrollbarWidth();
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
                        if (rowProject.row == rowTracker) {
                            rowProject.adjust = widthAdjustment + widthRemainder;
                            widthRemainder = 0;
                        }
                    }
                    //Increment rowTracker
                    rowTracker++;
                    //Reset widthTracker (add current project's width to this)
                    widthTracker = project.width + 4;
                    //Reset projectTracker
                    projectTracker = 0;
                }
                //Add project to resized projects
                resizedProjects.push({width: project.width, adjust: 0, row: rowTracker});
                //Increment projectTracker
                projectTracker++;
            }
            //Perform width adjustment on last row
            //Calculate remaining width
            let flexboxDifference = flexboxWidth - widthTracker;
            //Divide remaining width amongst current row's project panels (add remainder to first panel)
            let widthAdjustment = Math.floor(flexboxDifference / projectTracker);
            let widthRemainder = flexboxDifference % projectTracker;
            for (let rowProject of resizedProjects) {
                if (rowProject.row == rowTracker) {
                    rowProject.adjust = widthAdjustment + widthRemainder;
                    widthRemainder = 0;
                }
            }
                
            //Set displayed projects state
            setDisplayedProjects(resizedProjects);
        }, 100)
    }
        

    //Runs resizing function whenever window width changes
    //Don't add dependencies to it - it causes state to be reset for some reason (I don't know why)
    useEffect(() => {
        window.addEventListener('resize', resizeDisplay);
        return () => {
            window.removeEventListener('resize', resizeDisplay)
        };
    });

    // This displays all of the projects (on project cards) from the static fakeData.ts dataset
    // Eventually the discover page should display a select number of cards instead of all
    let projectContent = <>{
        /* projects ?
            projects.length > 0 ?
                filteredProjects.map((project) => (
                    <ProjectCard project={project}></ProjectCard>
                ))
                // If the projects array/object does not exist or has no content then nothing is displayed
                : null
            : null */
        
        //To-do later: case scenario for if row is too small to contain 1 wide project
        
        //For each project in project display list... (use map)
                displayedProjects.map((project) => (
                    //Create a Project Panel component
                    <ProjectPanel width={project.width + project.adjust}></ProjectPanel>
                ))
    }</>;

    // This displays all of the profiles (on profile cards) from the static fakeData.ts dataset
    // Eventually the discover page should display a select number of cards instead of all
    let profileContent = <>{
        profiles ?
            profiles.length > 0 ?
                filteredProfiles.map((profile) => (
                    <ProfileCard profile={profile}></ProfileCard>
                ))
                // If the profiles array/object does not exist or has no content then nothing is displayed
                : null
            : null
    }</>;


    // Sets the content of the page depending on which tab is selected
    let discoverContent = selectedTab === 'Projects' ? projectContent : profileContent;

    // Function to change highlighted tab
    const handleButtonClick = (selectedButton) => {
        setSelectedTab(selectedButton);
    }

    return (
        <div className="page" onScroll={addContent}>
            <h1 className="page-title">Discover</h1>

            {/* Discover Buttons change the content of the page based on which one is highlighted */}
            <div id="discover-button-wrapper">
                <DiscoverButton isActive={selectedTab === 'Projects'} onClick={() => handleButtonClick('Projects')}>Projects</DiscoverButton>
                <DiscoverButton isActive={selectedTab === 'People'} onClick={() => handleButtonClick('People')}>People</DiscoverButton>
                <SearchBar dataSets={[{ data: projects }, { data: profiles }]} onSearch={HandleSearch}></SearchBar>
            </div>

            {/* Prints all projects in the fake dataset on screen */}
            {/* 
            Add padding to discover-panel-box later
            Breakpoints occur every 200 pixels
            Formula for padding will be: (windowWidth - (sidebarWidth + currentBreakpointFlexboxWidth)) / 2
            How to implement breakpoints, thought?
            */}
            <div id='discover-panel-box'>
            {discoverContent}
            </div>

            {/* Footer of the page made exclusively to navigate to a project credits page. */}
            {/* This link should probably be moved to settings in the future but its in this footer for ease of access for now */}
            <CreditsFooter />

            {/* Scroll To Top button */}
            <ToTopButton />

        </div>
    );
}

export default Home;