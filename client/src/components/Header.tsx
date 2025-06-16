//Styles
import './Styles/credits.css';
import './Styles/discoverMeet.css';
import './Styles/emailConfirmation.css';
import './Styles/general.css';
import './Styles/loginSignup.css';
import './Styles/messages.css';
import './Styles/notification.css';
import './Styles/profile.css';
import './Styles/projects.css';
import './Styles/settings.css';
import './Styles/pages.css';

import { SearchBar } from './SearchBar';
import { Dropdown, DropdownButton, DropdownContent } from './Dropdown';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import * as paths from '../constants/routes';
import { sendPost } from '../functions/fetch';
import { ThemeIcon } from './ThemeIcon';
import { ThemeContext } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom'; // Hook to access the current location

//Header component to be used in pages

export let loggedIn = false;

//dataSets - list of data for the searchbar to use
//onSearch - function for the searchbar to run when searching
//These are directly used in the searchbar of this component, and funciton identically so

//to-do: allow click function of searchbar to be re-defineable
//Add functions to buttons (profile/settings = navigate to those pages; light mode: toggle light/dark mode)
//(logout = logout the user and send them to home page or equivalent)

export const Header = ({ dataSets, onSearch, hideSearchBar = false }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState(null);
  const [profileImg, setProfileImg] = useState<string>('');
  const location = useLocation(); // Hook to access the current location

  // Pull the theme and setTheme function from useState() via a context
  const theme = useContext(ThemeContext)['theme'];
  const setTheme = useContext(ThemeContext)['setTheme'];

  //Text for light mode toggle button should be opposite of current theme
  const [modeToggle, setModeToggle] = useState(theme === 'dark' ? 'Light Mode' : 'Dark Mode');

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response2 = await fetch('/api/auth');

        if (response2.status != 401) {
          loggedIn = true;
          const response = await fetch('/api/users/get-username-session');
          const { data } = await response.json();
          const { username, primary_email, first_name, last_name, profile_image } = await data;

          setUsername(await username);
          setEmail(await primary_email);
          setProfileImg(await profile_image);
        } else {
          setUsername('Guest');
        }
      } catch (err) {
        console.log('Error fetching username: ' + err);
      }
    };

    fetchUsername();
  }, []);

  const handlePageChange = (path) => {
    //Have code to update sidebar display (unsure of how to do this yet)
    //Navigate to desired page
    navigate(path);
  };

  const handleProfileAccess = async () => {
    // navigate to Profile, attach userID
    const response = await fetch('/api/auth');
    const { data } = await response.json();
    navigate(`${paths.routes.PROFILE}?userID=${data}`);

    // Collapse the dropwdown if coming from another user's page
    if (window.location.href.includes("profile")) {
      window.location.reload();
    }
  };

  const switchTheme = () => {
    setModeToggle(theme === 'dark' ? 'Dark Mode' : 'Light Mode');
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div id="header">
      {/* Conditional rendering for search bar */}
      {(!hideSearchBar) && (
      <div id="header-searchbar">
        <SearchBar dataSets={dataSets} onSearch={onSearch} />
      </div>
      )}
      <div id="header-buttons">
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

        {/* This is the top-right dropdown menu. */}
        <Dropdown>
          {/* This is the button to open the dropdown menu */}
          <DropdownButton buttonId="profile-btn">
            {(profileImg) ? (
              <img
                src={`images/profiles/${profileImg}`}
                id={'profile-img-icon'}
                className={'rounded'}
              />
            ) : (
              <ThemeIcon
                light={'assets/profile_light.svg'}
                dark={'assets/profile_dark.svg'}
                id={'profile-img-icon'}
              />
            )}
            <ThemeIcon
              light={'assets/dropdown_light.svg'}
              dark={'assets/dropdown_dark.svg'}
              id="dropdown-arrow"
            />
          </DropdownButton>

          {/* These are its elements once opened (unique for logged out/in) */}
          <DropdownContent rightAlign={true}>
            {!loggedIn ? (
              <div id="header-profile-dropdown" style={{ height: 150 }}>

                {/* (Blank) Profile Icon */}
                <button id="header-profile-user">
                  <ThemeIcon
                    light={'assets/profile_light.svg'}
                    dark={'assets/profile_dark.svg'}
                    alt={'profile'}
                  />
                  <div>
                    {username}
                    <br />
                    <span id="header-profile-email">{email}</span>
                  </div>
                </button>

                <hr />

                {/* Dark/Light Theme Switcher */}
                <button onClick={switchTheme}>
                  <ThemeIcon
                    light={'assets/black/mode.svg'}
                    dark={'assets/white/mode.svg'}
                    alt={'current mode'}
                  />
                  {modeToggle}
                </button>{' '}

                {/* LOG IN Button */}
                <button onClick={() => navigate(paths.routes.LOGIN, { state: { from: location.pathname } })}>
                  <ThemeIcon
                    light={'assets/black/logout.svg'}
                    dark={'assets/white/logout.svg'}
                    alt={'log in'}
                  />
                  Log In
                </button>
              </div>

            ) : (
              <div id="header-profile-dropdown" style={{ height: 200 }}>

                {/* Profile Icon (if user has one) */}
                <button onClick={() => handleProfileAccess()} id="header-profile-user">
                  {(profileImg) ? (
                    <img
                      src={`images/profiles/${profileImg}`}
                      className={'rounded'}
                      alt={'profile'}
                    />
                  ) : (
                    <ThemeIcon
                      light={'assets/profile_light.svg'}
                      dark={'assets/profile_dark.svg'}
                      alt={'profile'}
                    />
                  )}
                  <div>
                    {username}
                    <br />
                    <span id="header-profile-email">{email}</span>
                  </div>
                </button>

                <hr />

                {/* Dark/Light Theme Switcher */}
                <button onClick={switchTheme}>
                  <ThemeIcon
                    light={'assets/black/mode.svg'}
                    dark={'assets/white/mode.svg'}
                    alt={'current mode'}
                  />
                  {modeToggle}
                </button>{' '}

                {/* Settings Link */}
                <button onClick={() => handlePageChange(paths.routes.SETTINGS)}>
                  <ThemeIcon
                    light={'assets/black/settings.svg'}
                    dark={'assets/white/settings.svg'}
                    alt={'settings'}
                  />
                  Settings
                </button>

                {/* LOG OUT Button */}
                <button onClick={() => sendPost('/api/logout')}>
                  <ThemeIcon
                    light={'assets/black/logout.svg'}
                    dark={'assets/white/logout.svg'}
                    alt={'log out'}
                  />
                  Log Out
                </button>
              </div>
            )}
          </DropdownContent>
        </Dropdown>
      </div>
    </div >
  );
};