import React from "react";
import { Tags } from "./Tags";
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";

import profilePicture from "../images/blue_frog.png";
import followPicture from "../images/heart.png";

import { projects } from "../constants/fakeData";

export const ProjectCard = ({project}) => {
    const navigate = useNavigate();
    return (
        <div className="discover-card">
            <img id="discover-card-profile-picture" src={profilePicture} alt={project.name}/>
            <div id="discover-card-body">
                <h2 id="discover-card-name" onClick={() => navigate(paths.routes.PROJECT)}>{project.name}</h2>
                <p id="discover-card-description">{project.description}</p>
                <div id="discover-card-tag-wrapper">
                    <Tags>{project.tags[0]}</Tags>
                    <Tags>{project.tags[1]}</Tags>
                    <Tags>{project.tags[2]}</Tags>
                </div>
                <p id="discover-card-needed-roles"><b>Looking for:</b> {project.neededRoles.map(r => `${r.Role}(${r.amount})`).join(", ")}</p>
            </div>
            {/* <button id="project-card-follow" >
                <img src={followPicture}/>
            </button> */}
        </div>
    );
}

