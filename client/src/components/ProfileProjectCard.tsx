import { Tags } from "./Tags";
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";

import profilePicture from "../images/blue_frog.png";
import { projects } from "../constants/fakeData";
import { profiles } from "../constants/fakeData";

export const ProfileProjectCard = ({projectID, userID}) => {
    const project = projects[projectID];
    const navigate = useNavigate();
    const pathQuery = `?projID=${project._id}`;
    return (
        <div className="profile-project-card">
            <img id="profile-project-profile-picture" src={profilePicture} alt={project.name}/>
            <div id="profile-project-body">
                <h2 id="profile-project-name" onClick={() => navigate(paths.routes.PROJECT + pathQuery)}>{project.name}</h2>
                <p>as&nbsp;&nbsp;<b>{project.members.filter(member => member.userID == userID)[0].role}</b></p>
            </div>
        </div>
    );
}