  // NavbarMenu.js

import React from 'react';
import './styles.css'; // Import your CSS file for styling

const NavbarMenu = () => {
  return (
    <div className="navBarContainer">
      <div className="navBartitle">Looking for Group</div>
      <div className="navBarlinks">
        <div className="navBaritem">
          Project
          <div className="dropdown-content">
            <div className="dropdown-column">
              <a href="#project-sub1">Project Sub1</a>
              <a href="#project-sub2">Project Sub2</a>
            </div>
            <div className="dropdown-column"></div>
          </div>
        </div>
        <div className="navBaritem">
          Developer
          <div className="dropdown-content">
            <div className="dropdown-column">
              <a href="#developer-sub1">Developer Sub1</a>
              <a href="#developer-sub2">Developer Sub2</a>
            </div>
            <div className="dropdown-column"></div>
          </div>
        </div>
        <div className="navBaritem">
          Designer
          <div className="dropdown-content">
            <div className="dropdown-column">
              <a href="#designer-sub1">Designer Sub1</a>
              <a href="#designer-sub2">Designer Sub2</a>
            </div>
            <div className="dropdown-column"></div>
          </div>
        </div>
        <div className="navBaritem">
          Mentor
          <div className="dropdown-content">
            <div className="dropdown-column">
              <a href="#mentor-sub1">Mentor Sub1</a>
              <a href="#mentor-sub2">Mentor Sub2</a>
            </div>
            <div className="dropdown-column"></div>
          </div>
        </div>
      </div>

      <div className="navBarButtonsContainer">
      <button className='navBarButtons'>Login</button>
      <button className='navBarButtons'>Sign Up</button>

      </div>
    </div>
  );
};

export default NavbarMenu;