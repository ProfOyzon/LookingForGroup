import { projects } from "../constants/fakeData";
import { profiles } from "../constants/fakeData";
import profilePicture from "../images/blue_frog.png";

export const Endorsement = ({endorsement}) => {
    return (
        <div className="endorsement">
            <img id="profile-project-profile-picture" src={profilePicture} alt={profiles[endorsement.endorserID].name}/>
            <p><b>"{endorsement.endorsement}"</b></p>
            <p>-{profiles[endorsement.endorserID].name} on {projects[endorsement.endorseProjectID].name}</p>
        </div>
    )
}