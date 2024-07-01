import { projects } from "../constants/fakeData";
import { profiles } from "../constants/fakeData";

export const Endorsement = ({endorsement}) => {
    console.log(profiles[endorsement.endorserID])
    return (
        <div className="endorsement">
            <p><b>"{endorsement.endorsement}"</b></p>
            <p>-{profiles[endorsement.endorserID].name} on {projects[endorsement.endorseProjectID].name}</p>
        </div>
    )
}