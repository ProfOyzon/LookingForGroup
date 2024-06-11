import React, { useState } from 'react';
import './styles.css';
import homeIcon from '../img/AhomeIcon.png';
import Bell from '../img/bell.png';
import folder from '../img/folder.png';
import message from '../img/message.png';
import profile from '../img/profile-user.png';
import setting from '../img/setting.png';
import search from '../img/search.png';


const SideBar = () => {
  const [headerText, setHeaderText] = useState('Group'); // State to manage the h1 text

  // Function to handle the button clicks and update the h1 text
  const handleTextChange = (text) => {
    setHeaderText(text);
  };

  return (
    <div className='SideBarContainer'>
      <div className='headerContainer'>
        <h1>Looking For {headerText}</h1>  
      </div>
      
      <div className='ProfileContainer'>
        <span className="dot"></span>
      </div>
      
      <h1>UserName</h1>
      
      <div className='containerButtonSideBar'>
        <button onClick={() => handleTextChange('Discovery')}> <img src={homeIcon} width="32" height="32" alt="Home" /> Home </button>
        <button onClick={() => handleTextChange('My Projects')}> <img src={folder} width="32" height="32" alt="Projects" /> My Projects</button>
        <button onClick={() => handleTextChange('Messages')}> <img src={message} width="32" height="32" alt="Messages" /> Messages</button>
        <button onClick={() => handleTextChange('Profile')}> <img src={profile} width="32" height="32" alt="Profile" /> Profile</button>
        <button onClick={() => handleTextChange('Settings')}> <img src={setting} width="32" height="32" alt="Setting" /> Settings</button>
      </div>

      <div className='Logout'>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default SideBar;