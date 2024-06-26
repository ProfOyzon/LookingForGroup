import "./pages.css";
import { MyProjectsDisplay } from "../MyProjectsDisplay";
import { profiles } from "../../constants/fakeData";
import { useState } from "react";

const MyProjects = () => {
    const [UID, setUID] = useState(profiles[0]._id);

    return (
        <div>
            My Projects
            <select onChange = {e => {
                setUID(Number(e.target.value));
            }}>
                {
                    profiles.map(prof => {
                        return <option value={prof._id}>{prof.username}</option>
                    })
                }
            </select>
            <button id="create-proj-btn" className="orange-button" onClick={
                () => {
                    // Move to project creation page
                }
            }>Create</button>
            <MyProjectsDisplay userID={UID} />
        </div>
    );
}

export default MyProjects;