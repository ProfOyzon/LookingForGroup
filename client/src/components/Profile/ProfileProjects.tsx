import { ProjectCard } from "../ProjectCard";
import{projects} from "../../constants/fakeData";
import { ProfileProjectCard } from "./ProfileProjectCard";
import edit from '../../icons/edit.png';
import { useState } from 'react';
import { PagePopup, openClosePopup } from "../PagePopup";

export const ProfileProjects = ({user}) => {
    //usestates for the "edit projects" popup
    const [showPopup, setShowPopup] = useState(false);
    let openPopups = [showPopup];

    //get a list of all the user's projects
    let projectList;
    if(user.projects.length > 0){
        projectList = user.projects.map(proj => (
            <ProfileProjectCard projectID={proj} userID={user._id}></ProfileProjectCard>
        ))
    }
    //if the user isn't part of any projects display a special message
    else{
        projectList = <p>This user is not part of any projects.</p>
    }

    return (
        <section id = "profile-projects">
            <div className="profile-name-button">
                <h1>Projects</h1>
                {/*edit projects button*/}
                {/*TODO: only show when a user views their own profile*/}
                <button className="icon-button" onClick={() => openClosePopup(showPopup, setShowPopup, openPopups)}><img src = {edit}/></button>
            </div>
            <div className = "profile-list">
                {projectList}
            </div>

            {/*edit projects window*/}
            <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup} openPopups={openPopups}>
                <div id="profile-edit-projects" className="profile-edit">
                    <h1>Edit Projects</h1>
                    <h3>Select projects to be highlighted on your page</h3>
                    <h3>My Projects: </h3>
                    <div id = "profile-edit-projects-list" className="profile-list">
                        {projectList}
                    </div>
                </div>
            </PagePopup>
        </section>
    );
}