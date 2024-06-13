import "./pages.css";
import { ProjectCard } from "../ProjectCard";
import { ProfileCard } from "../ProfileCard";
import { DiscoverButton } from "../DiscoverButton";
import { SearchBar } from "../SearchBar";
import "../styles.css";
import { projects } from "../../constants/fakeData";
import { profiles } from "../../constants/fakeData";
import { Children } from "react";
import {useState} from 'react';

const Home = (props) => {

    // THINGS TO DO:
    // CHANGE CARD CONTENTS TO MATCH CLICKED BUTTON
    // ADD FOLLOWING BUTTON AND OTHER STUFF TO CARDS
    // MAKE PAGE MOBILE FRIENDLY
    // ADD SEARCH BAR
    // MAKE THINGS ON THE CARD CLICKABLE
    // MORE

    let DEFAULT_TAB = 'Projects';
    let [selectedTab, setSelectedTab] = useState(DEFAULT_TAB);
    let projectButton = document.querySelector(".discover-button-active") as HTMLInputElement;

    let placeholderText = projectButton.value;

    const handleButtonClick = (selectedButton) => {
        setSelectedTab(selectedButton);
    }

    
    return (
        <div className="discover-main-content">
            <h1 className="page-title">Discover</h1>
            <div id="discover-button-wrapper">                
                <DiscoverButton isActive={selectedTab === 'Projects'} onClick={() => handleButtonClick('Projects')}>Projects</DiscoverButton>
                <DiscoverButton isActive={selectedTab === 'People'} onClick={() => handleButtonClick('People')}>People</DiscoverButton>
                <SearchBar currentSelection={placeholderText}></SearchBar>
                
            </div>

            {/* Prints all projects in the fake dataset on screen */}
            {
                projects ?
                    projects.length > 0 ?
                        projects.map((project) => (
                            <ProjectCard project={project}></ProjectCard>
                        ))
                        :null
                            :null
            }
            <ProfileCard profile={profiles[0]}></ProfileCard>
            <ProjectCard project={projects[0]}></ProjectCard>
        </div>
    );
}

export default Home;