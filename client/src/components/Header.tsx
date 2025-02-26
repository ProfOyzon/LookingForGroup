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
import { useState, useEffect, useRef, useContext } from 'react';
import * as paths from '../constants/routes';
import profileImage from '../icons/profile-user.png';
import { sendPost } from '../functions/fetch';
import { ThemeIcon } from './ThemeIcon';
import { ThemeContext } from '../contexts/ThemeContext';

//Header component to be used in pages

let loggedIn;

//dataSets - list of data for the searchbar to use
//onSearch - function for the searchbar to run when searching
//These are directly used in the searchbar of this component, and funciton identically so

//to-do: allow click function of searchbar to be re-defineable
//Add functions to buttons (profile/settings = navigate to those pages; light mode: toggle light/dark mode)
//(logout = logout the user and send them to home page or equivalent)

export const Header = ({ dataSets, onSearch }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState(null);

  // Pull the theme and setTheme function from useState() via a context
  const theme = useContext(ThemeContext)['theme'];
  const setTheme = useContext(ThemeContext)['setTheme'];

  //Text for light mode toggle button should be opposite of current theme
  const [modeToggle, setModeToggle] = useState(theme === 'dark' ? 'Light Mode' : 'Dark Mode');

  const navigate = useNavigate(); //Hook for navigation

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response2 = await fetch('/api/auth');
        console.log('Auth response: ' + response2.status);

        if (response2.status != 401) {
          loggedIn = true;
          const response = await fetch('/api/users/get-username-session');
          const { data } = await response.json();
          console.log(data);
          const { username, primary_email, first_name, last_name } = await data;

          setUsername(await username);
          setEmail(await primary_email);
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
  };

  const switchTheme = () => {
    setModeToggle(theme === 'dark' ? 'Light Mode' : 'Dark Mode');
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div id="header">
      <div id="header-searchbar">
        <SearchBar dataSets={dataSets} onSearch={onSearch} />
      </div>
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
        <Dropdown>
          <DropdownButton buttonId="profile-btn">
            <ThemeIcon
              light={'assets/profile_light.png'}
              dark={'assets/profile_dark.png'}
              id={'profile-img-icon'}
            />
            <ThemeIcon
              light={'assets/dropdown_light.png'}
              dark={'assets/dropdown_dark.png'}
              id="dropdown-arrow"
            />
          </DropdownButton>
          <DropdownContent rightAlign={true}>
            <div id="header-profile-dropdown">
              {!loggedIn ? (
                <button id="header-profile-user">
                  <ThemeIcon
                    light={'assets/profile_light.png'}
                    dark={'assets/profile_dark.png'}
                    alt={'X'}
                  />
                  <div>
                    {username}
                    <br />
                    <span id="header-profile-email">{email}</span>
                  </div>
                </button>
              ) : (
                <button onClick={() => handleProfileAccess()} id="header-profile-user">
                  <ThemeIcon
                    light={'assets/profile_light.png'}
                    dark={'assets/profile_dark.png'}
                    alt={'X'}
                  />
                  <div>
                    {username}
                    <br />
                    <span id="header-profile-email">{email}</span>
                  </div>
                </button>
              )}
              <hr />
              <button onClick={switchTheme}>
                <ThemeIcon
                  light={'assets/black/mode.png'}
                  dark={'assets/white/mode.png'}
                  alt={'X'}
                />
                {modeToggle}
              </button>{' '}
              {/* Light mode toggle goes here! */}
              <button onClick={() => handlePageChange(paths.routes.SETTINGS)}>
                <ThemeIcon
                  light={'assets/black/settings.png'}
                  dark={'assets/white/settings.png'}
                  alt={'X'}
                />
                Settings
              </button>
              {!loggedIn ? (
                <button onClick={() => handlePageChange(paths.routes.LOGIN)}>
                  <ThemeIcon
                    light={'assets/black/logout.png'}
                    dark={'assets/white/logout.png'}
                    alt={'X'}
                  />
                  Log In
                </button>
              ) : (
                <button onClick={() => sendPost('/api/logout')}>
                  <ThemeIcon
                    light={'assets/black/logout.png'}
                    dark={'assets/white/logout.png'}
                    alt={'X'}
                  />
                  Log Out
                </button>
              )}
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
};
