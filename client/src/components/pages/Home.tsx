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

    //Get list of projects (and check if it exists/has content)
    //Create empty list of projects to display
    //(Will also include project data when actual projects are used)
    let projectsToDisplay : {width : number}[] = [];
    //Find out the width of the flexbox container
    const flexboxWidth : number = window.innerWidth - 277;
    console.log(flexboxWidth);
    //Create width tracker, set it equal to negative of the flexbox gap value
    let widthTracker : number = -40;
    //Create row tracker, which tracks the number of "full" flexbox rows
    let rowTracker : number = 0;
    //Start iterating through projects
    //For each project... (For testing purposes, will just loop until break condition is met)
    while (rowTracker <= 5) {
        //Get a width value based on the project's display image's aspect ratio
        //(For testing's sake, width will be randomized)
        let panelWidth = Math.floor((Math.random() * 200) + 200);
        //Add (width value + flexbox gap value) to width tracker
        widthTracker += panelWidth + 40;
        //if width tracker > flexbox width...
        if (widthTracker > flexboxWidth) {
            //Increment row tracker
            rowTracker++;
            //Reset width tracker to negative of the flexbox gap value
            widthTracker = -40;
            console.log(projectsToDisplay);
        }
        //if row tracker < a designated row count...
        if (rowTracker < 5) {
            //Add current project to list of projects to display
            //(Will include actual projects later)
            projectsToDisplay.push({width: panelWidth});
        } else { //otherwise...
            //Break project iteration loop
            console.log(projectsToDisplay);
            break;
        }  
    }


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
                projectsToDisplay.map((project) => (
                    //Create a Project Panel component
                    <ProjectPanel width={project.width}></ProjectPanel>
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
        <div className="page">
            <h1 className="page-title">Discover</h1>

            {/* Discover Buttons change the content of the page based on which one is highlighted */}
            <div id="discover-button-wrapper">
                <DiscoverButton isActive={selectedTab === 'Projects'} onClick={() => handleButtonClick('Projects')}>Projects</DiscoverButton>
                <DiscoverButton isActive={selectedTab === 'People'} onClick={() => handleButtonClick('People')}>People</DiscoverButton>
                <SearchBar dataSets={[{ data: projects }, { data: profiles }]} onSearch={HandleSearch}></SearchBar>
            </div>

            {/* Prints all projects in the fake dataset on screen */}
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