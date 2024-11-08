import "./pages/pages.css";
import "./Styles/styles.css";
import { SearchBar } from "./SearchBar";
import { Dropdown, DropdownButton, DropdownContent } from "./Dropdown";
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";
import bell from "../icons/bell.png";
import profileImage from "../icons/profile-user.png";

//Header component to be used in pages
//dataSets - list of data for the searchbar to use
//onSearch - function for the searchbar to run when searching
//These are directly used in the searchbar of this component, and funciton identically so

//to-do: allow click function of searchbar to be re-defineable
//Add functions to buttons (profile/settings = navigate to those pages; light mode: toggle light/dark mode)
//(logout = logout the user and send them to home page or equivalent)
export const Header = ({dataSets, onSearch}) => {
  const navigate = useNavigate(); //Hook for navigation

  const handlePageChange = (path) => {
    //Have code to update sidebar display (unsure of how to do this yet)
    //Navigate to desired page
    navigate(path);
  }
  
  return(
    <div id='header'>
        <div id='header-searchbar'>
          <SearchBar dataSets={dataSets} onSearch={onSearch}/>
        </div>
        <div id='header-buttons'>
          <Dropdown>
            <DropdownButton><img src={bell} className="navIcon" alt="Notifications" /></DropdownButton>
            <DropdownContent rightAlign={true}>This is where notification stuff will be</DropdownContent>
          </Dropdown>
          <Dropdown>
            <DropdownButton><img src={profileImage} className="navIcon" alt="User" /><img className="navIcon" alt="V"/></DropdownButton>
            <DropdownContent rightAlign={true}>
              <div id='header-profile-dropdown'>
                <button onClick={() => handlePageChange(paths.routes.PROFILE)} id='header-profile-user'>
                  <img src={profileImage} alt='X'/>
                  <div>Username<br/><span id='header-profile-email'>user@rit.edu</span></div>
                </button>
                <hr/>
                <button onClick={() => {}}><img src={profileImage} alt='X'/>Light Mode</button> {/* Light mode toggle goes here! */}
                <button onClick={() => handlePageChange(paths.routes.SETTINGS)}><img src={profileImage} alt='X'/>Settings</button>
                <button onClick={() => {}}><img src={profileImage} alt='X'/>Log out</button>
              </div>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
  )
}