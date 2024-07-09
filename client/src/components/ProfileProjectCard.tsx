import { Tags } from "./Tags";
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";

import profilePicture from "../images/blue_frog.png";
import { projects } from "../constants/fakeData";
import { profiles } from "../constants/fakeData";

//used in the profile page under the "projects" section
//displays the project name and the person's role

export const ProfileProjectCard = ({projectID, userID}) => {
    const project = projects[projectID];
    const navigate = useNavigate();
    return (
        <div className="profile-project-card">
            <img id="profile-project-profile-picture" src={profilePicture} alt={project.name}/>
            <div id="profile-project-body">
                <h2 id="profile-project-name" onClick={() => navigate(paths.routes.PROJECT)}>{project.name}</h2>
                <p>as&nbsp;&nbsp;<b>{project.members.filter(member => member.userID == userID)[0].role}</b></p>
            </div>
        </div>
    );
}