import { PagePopup } from "./PagePopup";
import { Tags } from "../components/Tags";
import frog from "../images/blue_frog.png"

export const ProjectCreationWindow = ({activePage, setActivePage}) => {
    const pages = [CreationPage1(), CreationPage2(), CreationPage3()]

    return(
        <div>
        {pages[activePage]}
        
        <div id = "create-project-button-list">
        <button className="white-button">cancel</button>
        <button className="white-button">save draft</button>
        <button className="white-button" onClick={() => setActivePage(Math.max(activePage - 1, 0))}>back</button>
        <button className="orange-button" onClick={() => setActivePage(Math.min(activePage + 1, 2))}>next</button>
        </div>
        </div>
    );
}

const CreationPage1 = () => {
    return(
        <div>
        <h2>New Project</h2>
        <div id = "create-page-1">
            <img id = "create-project-add-image" src= {frog} height="200vh" width="200vw"></img>
            
            <div>
            <input type="text" id="create-project-name" defaultValue="Project Name"/>
            
                <div className = "profile-list">
                    <p>Project Type</p>
                    <Tags>Game</Tags>
                    <Tags>Website</Tags>
                    <Tags>Mobile App</Tags>
                    <Tags>Film/Video</Tags>
                    <Tags>Social</Tags>
                </div>
            </div>
            
            <div id = "create-dates">
                <label> Start: <input type="date" id="create-project-start"/></label>
                <label> End: <input type="date" id="create-project-start"/></label>
            </div>
        </div>

        <textarea id="create-project-desc" defaultValue="Project Description"/>
        </div>
    )
}

const CreationPage2 = () => {
    return(
        <div id = "create-page-2">
            <h2>Members</h2>
            <h3>Roles</h3>
            <button className="white-button">Add Role</button>
            <div id = "create-project-roles">
                <div>
                    <input type="text" id="create-project-role-name" defaultValue="Role Name"/>
                    <label>Color:
                        <select id="create-project-role-color">
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                        </select>
                    </label>
                </div>
                <label>Project Files:
                    <select id="create-project-project-files">
                        <option value="edit">Can Edit</option>
                        <option value="view">Can View</option>
                        <option value="none">None</option>
                    </select>
                </label>
                <label>Project Settings:
                    <select id="create-project-project-files">
                        <option value="edit">Can Edit</option>
                        <option value="view">Can View</option>
                        <option value="none">None</option>
                    </select>
                </label>
                <div>
                    <button className="white-button">Delete</button>
                    <button className="orange-button">Save</button>
                </div>
                
            </div>

            <h3>Invite Members</h3>
            <label> Enter Email: <input type="text" id="create-project-invite"/></label>
            <button className="white-button">Invite</button>
        </div>
    )
}

const CreationPage3 = () => {
    let virtualSpaceType = "cozy"
    return(
        <div>
            <h2>Virtual Space</h2>
            <p>You can edit this later</p>

            <img id = "create-project-add-image" src= {frog} width = "200" height="200"></img>
            <p id = "create-project-virtual-space-name">{virtualSpaceType}</p>
            <div>
                <img id = "create-project-add-image" src= {frog} onClick={() => {virtualSpaceType = "cozy"}}></img>
                <img id = "create-project-add-image" src= {frog} onClick={() => {virtualSpaceType = "scary"}}></img>
                <img id = "create-project-add-image" src= {frog} onClick={() => {virtualSpaceType = "weird"}}></img>
                <img id = "create-project-add-image" src= {frog} onClick={() => {virtualSpaceType = "cool"}}></img>
                <img id = "create-project-add-image" src= {frog} onClick={() => {virtualSpaceType = "cute"}}></img>
            </div>
        </div>
    )
}


            
