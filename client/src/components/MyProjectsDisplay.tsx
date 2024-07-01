import React from "react";
import { ProjectCard } from "./ProjectCard";
import { profiles } from "../constants/fakeData";
import { projects } from "../constants/fakeData";

export const MyProjectsDisplay = ({userID}) => {
    return (
        <div>
            {projects.map(proj => {
                let prof = profiles[0];
                for(let p of profiles){
                    if(p._id == userID){
                        prof = p;
                        break;
                    }
                }

                if(prof.projects.includes(proj._id)){
                    return <ProjectCard project={proj} />
                }
            })}
        </div>
    );
}