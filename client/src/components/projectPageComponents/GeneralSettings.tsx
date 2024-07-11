import "../styles.css"
import profilePlaceholder from "../../img/profile-user.png";
import { projects } from "../../constants/fakeData";

//This component is used in the project member view of the project page
//Contains the layout of the 'General' tab of the project settings menu
//Should contain info regarding details of the project, as well as the ability to change said details
//This includes what picture the project uses as a profile, the name of the project,
//  The theme of its virtual space, and whether or not the project is currently hiring new people
//  More project options may need to be added in the future depending on the overall site design
//Also contains a save button that should write any changes made in this menu to the database
//There is currently an issue where swapping between the tabs of the settings window will reset any inputs
//  made within this tab if they weren't saved. Ideally, this shouldn't happen unless the entire settings
//  window is closed without saving.
/// Note: project data is currently hardcoded to only render the first project in the database
/// Should try to pass in a project id number later to allow for rendering relevant project data

// projectId is passed through props, which is used to ensure correct data is pulled

export const GeneralSettings = (props) => {
  const projectData = projects.find(p => p._id === Number(props.projectId)) || projects[0];
  return(
    <div id='general-settings'>
      <img id='picture-edit' src={profilePlaceholder} alt='project'/>
      <button id='edit-button' className='white-button'>Edit Picture</button>
      <input id='name-edit' name='project-name' type='text' defaultValue={projectData.name}></input>
      <select id='theme-select'>
        <option value='classic'>Classic</option>
        <option value='cute'>Cute</option>
        <option value='western'>Western</option>
        <option value='fantasy'>Fantasy</option>
        <option value='cyberpunk'>Cyberpunk</option>
      </select>
      <div id='hiring-checkbox'>
          <label>Is Hiring: </label>
          <input name='is-hiring' type='checkbox' id='is-hiring'/>
        </div>
    </div>
  )
}