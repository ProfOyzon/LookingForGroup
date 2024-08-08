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

    // THINGS TO DO:
    // ADD FOLLOWING BUTTON AND OTHER STUFF TO CARDS
    // MAKE PAGE MOBILE FRIENDLY
    // ADD SEARCH BAR
    // MAKE THINGS ON THE CARD CLICKABLE
    // MORE

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

    let projectContent = <>{
        projects ?
            projects.length > 0 ?
                filteredProjects.map((project) => (
                    <ProjectCard project={project}></ProjectCard>
                ))
                : null
            : null
    }</>;

    let profileContent = <>{
        profiles ?
            profiles.length > 0 ?
                filteredProfiles.map((profile) => (
                    <ProfileCard profile={profile}></ProfileCard>
                ))
                : null
            : null
    }</>;

    let discoverContent = selectedTab === 'Projects' ? projectContent : profileContent;

    const handleButtonClick = (selectedButton) => {
        setSelectedTab(selectedButton);
    }


    return (
        <div className="page">
            {/* Notifications are in the navigation bar for now */}
            {/* <div id="containerId"><NotifButton></NotifButton></div> */}

            <h1 className="page-title">Discover</h1>

            <div id="discover-button-wrapper">
                <DiscoverButton isActive={selectedTab === 'Projects'} onClick={() => handleButtonClick('Projects')}>Projects</DiscoverButton>
                <DiscoverButton isActive={selectedTab === 'People'} onClick={() => handleButtonClick('People')}>People</DiscoverButton>
                <SearchBar dataSets={[{ data: projects }, { data: profiles }]} onSearch={HandleSearch}></SearchBar>

            </div>

            {/* Prints all projects in the fake dataset on screen */}
            {discoverContent}
            {/* <ProfileCard profile={profiles[0]}></ProfileCard> */}

            <CreditsFooter />

        </div>
    );
}

export default Home;