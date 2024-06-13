import React from "react";
import { ProjectCard } from "./ProjectCard";
import { profiles } from "../constants/fakeData";
import { projects } from "../constants/fakeData";

export const MyProjectsDisplay = (userID : number) => {
    let display = <div id="my_projects_display">No projects found, create one to get started!</div>

    let user = profiles[0];
    for(let prof of profiles){
        if(prof._id == userID){
            user = prof;
            break;
        }
    }

    if(user.projects){
        display.props = "";
        for(let proj of projects){
            if(user.projects.includes(proj._id)){
               display.props += <ProjectCard project={proj} />;
            }
        }
    }

    return display;
}