import React from "react";
import { Tags } from "./Tags";
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as paths from "../constants/routes";

import profilePicture from "../images/blue_frog.png";
import followPicture from "../images/heart.png";

import { projects } from "../constants/fakeData";

/*const projectNavigate = (project) => {
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    setSearchParams({p : project._id});
    navigate(paths.routes.PROJECT, searchParams);
}*/

export const ProjectCard = ({project}) => {
    const navigate = useNavigate();
    let pathQuery = `?projID=${project._id}`;
    return (
        <div className="discover-card">
            <img id="discover-card-profile-picture" src={profilePicture} alt={project.name}/>
            <div id="discover-card-body">
                <h2 id="discover-card-name" onClick={() => navigate(paths.routes.PROJECT + pathQuery)}>{project.name}</h2>
                <p id="discover-card-description">{project.description}</p>
                <div id="discover-card-tag-wrapper">
                    <Tags>{project.tags[0]}</Tags>
                    <Tags>{project.tags[1]}</Tags>
                    <Tags>{project.tags[2]}</Tags>
                </div>
                {/* The needed roles are pulled from an array and are mapped along with the needed amounts */}
                <p id="discover-card-needed-roles"><b>Looking for:</b> {project.neededRoles.map(r => `${r.Role}(${r.amount})`).join(", ")}</p>
            </div>
            {/* <button id="project-card-follow" >
                <img src={followPicture}/>
            </button> */}
        </div>
    );
}

