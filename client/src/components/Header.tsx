import "./pages/pages.css";
import "./Styles/styles.css";
import { SearchBar } from "./SearchBar";
import { Dropdown, DropdownButton, DropdownContent } from "./Dropdown";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import * as paths from "../constants/routes";
import profileImage from "../icons/profile-user.png";
import { sendPost } from "../functions/fetch";
import { ThemeIcon } from "./ThemeIcon";


//Header component to be used in pages

let loggedIn;

//dataSets - list of data for the searchbar to use
//onSearch - function for the searchbar to run when searching
//These are directly used in the searchbar of this component, and funciton identically so

//to-do: allow click function of searchbar to be re-defineable
//Add functions to buttons (profile/settings = navigate to those pages; light mode: toggle light/dark mode)
//(logout = logout the user and send them to home page or equivalent)

export const Header = ({ dataSets, onSearch, setTheme, theme }) => {
  const [username, setUsername] = useState<String | null>(null);
  const [email, setEmail] = useState(null);

  //Text for light mode toggle button should be opposite of current theme
  const [modeToggle, setModeToggle] = useState(theme === 'dark' ? 'Light Mode' : 'Dark Mode');
  // check the current theme and set image src to match
  // also set the text of the button to match the current theme
  useEffect(() => {
    const themeIcon = document.getElementsByClassName('theme-icon');
    for (let i = 0; i < themeIcon.length; i++) {
      const icon = themeIcon[i] as HTMLImageElement;
      const src = themeIcon[i].getAttribute('src-' + theme) || 'default-' + theme + '-src.png';
      icon.src = src;
    }
    setModeToggle(theme === 'dark' ? 'Light Mode' : 'Dark Mode');
  }, [theme]);

  const navigate = useNavigate(); //Hook for navigation

  useEffect(() => {
      const fetchUsername = async () => {
          try {

            const response2 = await fetch("/api/auth");
            console.log("Auth response: " + response2.status);

            if(response2.status != 401) {
              loggedIn = true;
              const response = await fetch("/api/users/get-username-session");
              const { data } = await response.json();
              console.log(data);
              const { username, primary_email, first_name, last_name } = await data;

              setUsername(await username);
              setEmail(await primary_email);
            }

            else {
              setUsername("Guest");
            }
            
          }   catch (err) {
            console.log("Error fetching username: " + err);
          }
      }

      fetchUsername();
  }, []);

  const handlePageChange = (path) => {
    //Have code to update sidebar display (unsure of how to do this yet)
    //Navigate to desired page
    navigate(path);
  }

  const switchTheme = () => {
    setModeToggle(theme === 'dark' ? 'Light Mode' : 'Dark Mode');
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div id='header'>
      <div id='header-searchbar'>
        <SearchBar dataSets={dataSets} onSearch={onSearch} />
      </div>
      <div id='header-buttons'>
        {/* Notififcations not being used rn */}
        {/* <Dropdown>
          <DropdownButton buttonId="notif-btn">
            <img
              className="theme-icon"
              src="assets/bell_dark.png"
              src-light="assets/bell_light.png"
              src-dark="assets/bell_dark.png"
              alt="" />
          </DropdownButton>
          <DropdownContent rightAlign={true}>This is where notification stuff will be</DropdownContent>
        </Dropdown> */}
        <Dropdown>
          <DropdownButton buttonId="profile-btn" >
            <ThemeIcon 
              light={'assets/profile_light.png'} 
              dark={'assets/profile_dark.png'}>
            </ThemeIcon>
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
              className='theme-icon' /></DropdownButton>
          <DropdownContent rightAlign={true}>
            <div id='header-profile-dropdown'>
              { (!loggedIn)
                ? <button id='header-profile-user'>
                  <img src="assets/profile_dark.png"
                  src-light="assets/profile_light.png"
                  src-dark="assets/profile_dark.png"
                  className="theme-icon"
                  alt='X' />
                  <div>{username}<br /><span id='header-profile-email'>{email}</span></div>
                  </button>
                  : <button onClick={() => handlePageChange(paths.routes.PROFILE)} id='header-profile-user'>
                <img src="assets/profile_dark.png"
                  src-light="assets/profile_light.png"
                  src-dark="assets/profile_dark.png"
                  className="theme-icon"
                  alt='X' />
                <div>{username}<br /><span id='header-profile-email'>{email}</span></div>
                </button>
              }
              <hr />
              <button onClick={switchTheme}>
                <img src="assets/white/mode.png"
                  src-light="assets/black/mode.png"
                  src-dark="assets/white/mode.png"
                  className="theme-icon"
                  alt='X' />{modeToggle}</button> {/* Light mode toggle goes here! */}
              <button onClick={() => handlePageChange(paths.routes.SETTINGS)}>
                <img src="assets/white/settings.png"
                  src-light="assets/black/settings.png"
                  src-dark="assets/white/settings.png"
                  className="theme-icon"
                  alt='X' />Settings</button>
                  { (!loggedIn)
                    ? <button onClick={() => handlePageChange(paths.routes.LOGIN)}>
                    <img src="assets/white/logout.png"
                      src-light="assets/black/logout.png"
                      src-dark="assets/white/logout.png"
                      className="theme-icon"
                      alt='X' />Log In</button>
                      : <button onClick={() => sendPost("/api/logout")}>
                      <img src="assets/white/logout.png"
                        src-light="assets/black/logout.png"
                        src-dark="assets/white/logout.png"
                        className="theme-icon"
                        alt='X' />Log Out</button>
                  }
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  )
}