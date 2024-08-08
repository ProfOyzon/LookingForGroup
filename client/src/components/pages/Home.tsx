import "./pages.css";
import { ProjectCard } from "../ProjectCard";
import { ProfileCard } from "../ProfileCard";
import { DiscoverButton } from "../DiscoverButton";
import { NotifButton } from "../NotificationButton";
import { SearchBar } from "../SearchBar";
import "../Styles/styles.css";
import { projects } from "../../constants/fakeData";
import { profiles } from "../../constants/fakeData";
import { Children, useCallback } from "react";
import { useState } from 'react';
import CreditsFooter from '../CreditsFooter';

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

    // This displays all of the projects (on project cards) from the static fakeData.ts dataset
    // Eventually the discover page should display a select number of cards instead of all
    let projectContent = <>{
        projects ?
            projects.length > 0 ?
                filteredProjects.map((project) => (
                    <ProjectCard project={project}></ProjectCard>
                ))
                // If the projects array/object does not exist or has no content then nothing is displayed
                : null
            : null
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
            {discoverContent}

            {/* Footer of the page made exclusively to navigate to a project credits page. */}
            {/* This link should probably be moved to settings in the future but its in this footer for ease of access for now */}
            <CreditsFooter />

        </div>
    );
}

export default Home;