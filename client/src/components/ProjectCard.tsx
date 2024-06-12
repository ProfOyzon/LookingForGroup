import React from "react";
import { Tags } from "./Tags";

import profilePicture from "../images/blue_frog.png";
import followPicture from "../images/heart.png";

import { projects } from "../constants/fakeData";

export const ProjectCard = ({project}) => {
    return (
        <div className="project-card">
            <img id="project-card-profile-picture" src={profilePicture} alt={project.name}/>
            <div id="project-card-body">
                <h2 id="project-card-name">{project.name}</h2>
                <p id="project-card-description">{project.description}</p>
                <div id="project-card-tag-wrapper">
                    <Tags>{project.tags[0]}</Tags>
                    <Tags>{project.tags[1]}</Tags>
                    <Tags>{project.tags[2]}</Tags>
                </div>
            </div>
            {/* <button id="project-card-follow" >
                <img src={followPicture}/>
            </button> */}
        </div>
    );
}

