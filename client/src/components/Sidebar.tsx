import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";
import { useSelector } from 'react-redux';
import LFGLogoLight from "../images/lfg light mode logo.png";
import LFGLogoDark from "../images/lfg dark mode logo.png";

import Notifications from './pages/Notifications';

//Style changes to do:
//Remove blue background image, replace with single color (or gradient?)
//Change shape of active buttons to be more rounded
//Remove notification button

const SideBar = ({ avatarImage, setAvatarImage }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = useSelector((state: any) => state.page.MOBILE_BREAKPOINT);

  // const [headerText, setHeaderText] = useState('Group'); // State to manage the h1 text
  const navigate = useNavigate(); // Hook for navigation
  const currentURL = window.location.pathname;

  let startingPage: string;

  // Check to see what page we are on
  switch (window.location.pathname) {
    case '/discover': startingPage = 'Discover'; break;
    case '/meet': startingPage = 'Meet'; break;
    case '/myProjects': startingPage = 'My Projects'; break;
    case '/messages': startingPage = 'Messages'; break;
    case '/profile': startingPage = 'Profile'; break;
    case '/settings': startingPage = 'Settings'; break;
    default: startingPage = 'Discover';
  }

  const [activePage, setActivePage] = useState(startingPage); // State to manage the active page [Discover, Meet, My Projects, Messages, Profile, Settings]

  const [showNotifications, setShowNotifications] = useState(false); // State to manage the notifications modal

  // Function to handle the button clicks and update the h1 text
  const handleTextChange = (text, path) => {
    // setHeaderText(text);
    setActivePage(text);
    navigate(path); // Navigate to the specified path
  };

  React.useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth));
  })

  // Mobile layout
  if (width < breakpoint) {
    return (
      <div>
        <div className="sideBarContainer">
          <div className='containerButtonSideBar'>
            <button className={activePage === 'Discover' ? 'active' : ''} onClick={() => handleTextChange('Discover', paths.routes.HOME)}>
              <img src="images/icons/nav/discover.png" className="navIcon" alt="Home" />
            </button>
            <button className={activePage === 'My Projects' ? 'active' : ''} onClick={() => handleTextChange('My Projects', paths.routes.MYPROJECTS)}>
              <img src="images/icons/nav/projects.png" className="navIcon" alt="Projects" />
            </button>

            {/* <button onClick={() => { setShowNotifications(!showNotifications); }}>
            <img src={bell} className="navIcon" alt="Notifications" />
          </button> */}

            <button className={activePage === 'Messages' ? 'active' : ''} onClick={() => handleTextChange('Messages', paths.routes.MESSAGES)}>
              <img src="images/icons/nav/msg-nav.png" className="navIcon" alt="Messages" />
            </button>
            <button className={activePage === 'Profile' ? 'active' : ''} onClick={() => handleTextChange('Profile', paths.routes.PROFILE)}>
              <img src="images/icons/nav/profile-white.png" className="navIcon" alt="Profile" />
            </button>
            <button className={activePage === 'Settings' ? 'active' : ''} onClick={() => handleTextChange('Settings', paths.routes.SETTINGS)}>
              <img src="images/icons/nav/settings.png" className="navIcon" alt="Setting" />
            </button>
          </div>
        </div>

        {/* <Notifications show={showNotifications} onClose={() => { setShowNotifications(!showNotifications); }} /> */}
      </div>
    );
  }

  // Desktop layout
  return (
    <div>
      <div className="SideBarContainer">
        <div className='headerContainer'>
          <h1>lfg.</h1>
        </div>

        <div className='containerButtonSideBar'>
          <button className={activePage === 'Discover' ? 'active' : ''} onClick={() => handleTextChange('Discover', paths.routes.HOME)}>
            <img
              className='theme-icon'
              src="assets/black/compass.png"
              src-light="assets/black/compass.png"
              src-dark="assets/white/compass.png"
              alt="" /> Discover
          </button>
          <button className={activePage === 'Meet' ? 'active' : ''} onClick={() => handleTextChange('Meet', paths.routes.MEET)}>
            <img
              className='theme-icon'
              src="assets/black/meet.png"
              src-light="assets/black/meet.png"
              src-dark="assets/white/meet.png"
              alt="" /> Meet
          </button>
          <button className={activePage === 'My Projects' ? 'active' : ''} onClick={() => handleTextChange('My Projects', paths.routes.MYPROJECTS)}>
            <img
              className='theme-icon'
              src="assets/black/folder.png"
              src-light="assets/black/folder.png"
              src-dark="assets/white/folder.png"
              alt="" /> My Projects
          </button>
          {/* <button className={activePage === 'Following' ? 'active' : ''} onClick={() => handleTextChange('Following', paths.routes.SETTINGS)}>
            <img
              className='theme-icon'
              src="assets/black/following.png"
              src-light="assets/black/following.png"
              src-dark="assets/white/following.png"
              alt="" /> Following
          </button> */}

          {/* <button onClick={() => { setShowNotifications(!showNotifications); }}>
          <img src={bell} className="navIcon" alt="Notifications" />
        </button> */}

          {/* <button className={activePage === 'Messages' ? 'active' : ''} onClick={() => handleTextChange('Messages', paths.routes.MESSAGES)}>
          <img src="images/icons/nav/msg-nav.png" className="navIcon" alt="Messages" /> Messages
        </button> */}
          {/* <button className={activePage === 'Profile' ? 'active' : ''} onClick={() => handleTextChange('Profile', paths.routes.PROFILE)}>
          <img src="assets/icons/nav/profile-white.png" className="navIcon" alt="Profile" /> Profile
        </button> */}
          {/* <button className={activePage === 'Settings' ? 'active' : ''} onClick={() => handleTextChange('Settings', paths.routes.SETTINGS)}>
          <img src="images/icons/nav/settings.png" className="navIcon" alt="Setting" /> Settings
        </button> */}
        </div>

        {/* <div className='Logout'>
        <button onClick={() => { navigate(paths.routes.LOGIN) }}>Log Out</button>
      </div> */}
        <div className='Create'>
          <button>
            <img
              className='theme-icon'
              src="assets/create_dark.png"
              src-light="assets/create_light.png"
              src-dark="assets/create_dark.png"
              alt="" /> Create</button>
        </div>
      </div>

      <Notifications show={showNotifications} onClose={() => { setShowNotifications(false); }} />
    </div>
  );
};

export default SideBar;