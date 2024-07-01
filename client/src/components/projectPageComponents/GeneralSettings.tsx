import "../styles.css"
import profilePlaceholder from "../../img/profile-user.png";
import { projects } from "../../constants/fakeData";

//Used for the general tab of project settings
/// Note: Should try and pass in project id number later
export const GeneralSettings = (props) => {
  return(
    <div id='general-settings'>
      <img id='picture-edit' src={profilePlaceholder} alt='project'/>
      <button id='edit-button' className='white-button'>Edit Picture</button>
      <input id='name-edit' name='project-name' type='text' defaultValue={projects[0].name}></input>
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