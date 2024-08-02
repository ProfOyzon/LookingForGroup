import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import * as paths from "../constants/routes";
import { useSelector } from 'react-redux';

import Notifications from './pages/Notifications';

// To Do:
// Make mobile friendly version stay at bottom of screen
// Ensure page content is not covered by sidebar
// Decide how/if width changes with window size
// Have profile pic displayed if a user is logged in


const SideBar = ({ avatarImage, setAvatarImage }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = useSelector((state: any) => state.page.MOBILE_BREAKPOINT);

  const [headerText, setHeaderText] = useState('Group'); // State to manage the h1 text
  const navigate = useNavigate(); // Hook for navigation

  const [activePage, setActivePage] = useState('Group'); // State to manage the active page [Home, My Projects, Messages, Profile, Settings]

  const [showNotifications, setShowNotifications] = useState(false); // State to manage the notifications modal

  // Function to handle the button clicks and update the h1 text
  const handleTextChange = (text, path) => {
    setHeaderText(text);
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
          <button className={activePage === 'Group' ? 'active' : ''} onClick={() => handleTextChange('Group', paths.routes.HOME)}>
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
        <h1>Logo</h1>

        {/* notification bell */}
        <button onClick={() => { setShowNotifications(!showNotifications); }}>
          <img src="images/icons/nav/notif.png" className="navIcon" alt="Notifications" />
        </button>
      </div>

      {/* <div className='ProfileContainer'>
        <div className="displayProfilePic">
          <img src={avatarImage} alt="Profile Pic" />
        </div>
      </div>

      {/* <h1>UserName</h1> */}

      <div className='containerButtonSideBar'>
        <button className={activePage === 'Group' ? 'active' : ''} onClick={() => handleTextChange('Group', paths.routes.HOME)}>
          <img src="images/icons/nav/discover.png" className="navIcon" alt="Discover" /> Discover
        </button>
        <button className={activePage === 'My Projects' ? 'active' : ''} onClick={() => handleTextChange('My Projects', paths.routes.MYPROJECTS)}>
          <img src="images/icons/nav/projects.png" className="navIcon" alt="Projects" /> My Projects
        </button>

        {/* <button onClick={() => { setShowNotifications(!showNotifications); }}>
          <img src={bell} className="navIcon" alt="Notifications" />
        </button> */}

        <button className={activePage === 'Messages' ? 'active' : ''} onClick={() => handleTextChange('Messages', paths.routes.MESSAGES)}>
          <img src="images/icons/nav/msg-nav.png" className="navIcon" alt="Messages" /> Messages
        </button>
        <button className={activePage === 'Profile' ? 'active' : ''} onClick={() => handleTextChange('Profile', paths.routes.PROFILE)}>
          <img src="images/icons/nav/profile-white.png" className="navIcon" alt="Profile" /> Profile
        </button>
        <button className={activePage === 'Settings' ? 'active' : ''} onClick={() => handleTextChange('Settings', paths.routes.SETTINGS)}>
          <img src="images/icons/nav/settings.png" className="navIcon" alt="Setting" /> Settings
        </button>
      </div>

      <div className='Logout'>
        <button onClick={() => { navigate(paths.routes.LOGIN) }}>Log Out</button>
      </div>
      </div>

      <Notifications show={showNotifications} onClose={() => { setShowNotifications(false); }} />
    </div>
  );
};

export default SideBar;