import React, { useState } from 'react';
import '../Css/SideBar.css';

const SideBar = () => {
  const [headerText, setHeaderText] = useState('Group'); // State to manage the h1 text

  // Function to handle the button clicks and update the h1 text
  const handleTextChange = (text) => {
    setHeaderText(text);
  };

  return (
    <div className='SideBarContainer'>
      <div className='headerContiner'>
      <h1>Looking For {headerText}</h1>  
      </div>
      

      <div className = 'ProfileContainer'>
      <span class="dot">
     
      </span>
      </div>
      <h1>UserName</h1>
      <div className='containerButtonSideBar'>
        <button onClick={() => handleTextChange('Discovery')}>Discovery</button>
        <button onClick={() => handleTextChange('My Feed')}>My Feed</button>
        <button onClick={() => handleTextChange('My Projects')}>My Projects</button>
        <button onClick={() => handleTextChange('Messages')}>Messages</button>
        <button onClick={() => handleTextChange('Profile')}>Profile</button>
        <button onClick={() => handleTextChange('Settings')}>Settings</button>
      </div>

      <div className='Logout'>
      <button>Logout</button>
      </div>
    </div>
  );
};

export default SideBar;