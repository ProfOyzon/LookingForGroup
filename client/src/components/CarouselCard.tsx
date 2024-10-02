import React from "react";
import { Tags } from "./Tags";
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as paths from "../constants/routes";

import profilePicture1 from "../images/blue_frog.png";
import profilePicture2 from "../images/ritchie.png";
import followPicture from "../images/heart.png";

import { projects } from "../constants/fakeData";

// This is used by the Discover Page to display Project information in a carousel 
export const ProjectCard = ({project}) => {
    // Updates the url to point toward the project being clicked
    const navigate = useNavigate();
    let pathQuery = `?projID=${project._id}`;
    return (
        <div className="carousel-card">
            {/* <img id="carousel-card-profile-picture" src={profilePicture1} alt={project.name}/> */}
            <div id="carousel-card-pfp-container">
                <img id="carousel-card-profile-picture" src={profilePicture2} alt={project.name}/>
            </div>
            <div id="carousel-card-body">
                {/* When the title is clicked it navigates to the project page */}
                <h2 id="carousel-card-name" onClick={() => navigate(paths.routes.PROJECT + pathQuery)}>
                    {project.name}
                </h2>
                
                {/* Character limit is currently 200; there's no specific reason why 200 */}
                <div id="carousel-card-description">
                    <p>
                        {project.description}
                    </p>
                </div>
                
                <div id="carousel-card-tag-wrapper">
                    <Tags>{project.tags[0]}</Tags>
                    <Tags>{project.tags[1]}</Tags>
                    <Tags>{project.tags[2]}</Tags>
                </div>
                
                {/* The needed roles are pulled from an array in fakeData.ts and are mapped along with the needed amounts */}
                <p id="carousel-card-needed-roles">
                    <b>Looking for:</b> {project.neededRoles.map(r => `${r.Role}(${r.amount})`).join(", ")}
                </p>
            </div>
        </div>
    );
}

// This is used by the Discover Page to display Profile information in a carousel 
export const ProfileCard = ({profile}) => {
    const navigate = useNavigate();
    const pathQuery = `?profID=${profile._id}`;
    return (
        <div className="carousel-card">
            {/* <img id="carousel-card-profile-picture" src={profilePicture1} alt={profile.name}/> */}
            <div id="carousel-card-pfp-container">
                <img id="carousel-card-profile-picture" src={profilePicture1} alt={profile.name}/>
            </div>
            <div id="carousel-card-body">
                <span>
                    {/* When the title is clicked it navigates to the profile page */}
                    <h2 id="carousel-card-name" onClick={() => navigate(paths.routes.PROFILE + pathQuery)}>{profile.name}</h2>
                    {/* The pronouns are pulled from an array in fakeData.ts, and are mapped/joined together with / */}
                    <p id="carousel-card-pronouns">{profile.pronouns.map(p => `${p}`).join("/")}</p>
                </span>

                <p id="carousel-card-description">
                    {profile.bio}
                </p>

                <div id="carousel-card-tag-wrapper">
                    <Tags>{profile.skills[0].skill}</Tags>
                    <Tags>{profile.skills[1].skill}</Tags>
                    <Tags>{profile.skills[2].skill}</Tags>
                </div>
            </div>
        </div>
    );
}

// export default {ProjectCard, ProfileCard };