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

  // toggle light/dark mode
  const setTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeIcon = document.getElementsByClassName('theme-icon');

    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');

      // save to local storage
      localStorage.setItem('theme', 'light');

      // change icons
      for (let i = 0; i < themeIcon.length; i++) {
        themeIcon[i].src = themeIcon[i].getAttribute('src-light');
      }
    } 
    else {
      document.documentElement.setAttribute('data-theme', 'dark');

      // save to local storage
      localStorage.setItem('theme', 'dark');

      // change icons
      for (let i = 0; i < themeIcon.length; i++) {
        themeIcon[i].src = themeIcon[i].getAttribute('src-dark');
      }
    }
  };
  
  return(
    <div id='header'>
        <div id='header-searchbar'>
          <SearchBar dataSets={dataSets} onSearch={onSearch}/>
        </div>
        <div id='header-buttons'>
          <Dropdown>
            <DropdownButton buttonId="notif-btn">
              <img 
              className="theme-icon"
              src="assets/bell_dark.png"
              src-light="assets/bell_light.png"
              src-dark="assets/bell_dark.png"
               alt="" />
            </DropdownButton>
            <DropdownContent rightAlign={true}>This is where notification stuff will be</DropdownContent>
          </Dropdown>
          <Dropdown> 
            <DropdownButton buttonId="profile-btn">
              <img 
              src="assets/profile_dark.png" 
              src-light="assets/profile_light.png"
              src-dark="assets/profile_dark.png"
              alt="" 
              id="profile-img-icon"
              className='theme-icon'
              />
              
              <img 
              src="assets/dropdown_dark.png" 
              src-light="assets/dropdown_light.png"
              src-dark="assets/dropdown_dark.png"
              alt="" 
              id="dropdown-arrow"
              className='theme-icon'/></DropdownButton>
            <DropdownContent rightAlign={true}>
              <div id='header-profile-dropdown'>
                <button onClick={() => handlePageChange(paths.routes.PROFILE)} id='header-profile-user'>
                  <img src="assets/profile_dark.png" 
                  src-light="assets/profile_light.png"
                  src-dark="assets/profile_dark.png"
                  className="theme-icon"
                  alt='X'/>
                  <div>Username<br/><span id='header-profile-email'>user@rit.edu</span></div>
                </button>
                <hr/>
                <button onClick={setTheme}>
                  <img src="assets/white/mode.png"
                  src-light="assets/black/mode.png"
                  src-dark="assets/white/mode.png"
                  className="theme-icon"
                   alt='X'/>Light Mode</button> {/* Light mode toggle goes here! */}
                <button onClick={() => handlePageChange(paths.routes.SETTINGS)}>
                  <img src="assets/white/settings.png"
                  src-light="assets/black/settings.png"
                  src-dark="assets/white/settings.png"
                  className="theme-icon"
                   alt='X'/>Settings</button>
                <button onClick={() => {}}>
                  <img src="assets/white/logout.png" 
                  src-light="assets/black/logout.png"
                  src-dark="assets/white/logout.png"
                  className="theme-icon"
                  alt='X'/>Log out</button>
              </div>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
  )
}