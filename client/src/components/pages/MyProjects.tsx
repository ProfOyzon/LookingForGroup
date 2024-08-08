import "./pages.css";
import { MyProjectsDisplay } from "../MyProjectsDisplay";
import { profiles } from "../../constants/fakeData";
import { useState } from "react";
import { PagePopup, openClosePopup } from "../PagePopup";

const MyProjects = () => {
    const [UID, setUID] = useState(profiles[0]._id);
    const [activePage, setActivePage] = useState(0);

    return (
        <div className='page'>
            My Projects

            {/* User selection */}
            <select onChange = {e => {
                setUID(Number(e.target.value));
            }}>
                {
                    profiles.map(prof => {
                        return <option value={prof._id}>{prof.username}</option>
                    })
                }
            </select>

            {/* Click -> Create new project */}
            <button id="create-proj-btn" className="orange-button" onClick={
                () => {
                    window.location.href="createProject"
                }
            }>Create</button>

            <MyProjectsDisplay userID={UID} />

    
                
        </div>
    );
}

export default MyProjects;