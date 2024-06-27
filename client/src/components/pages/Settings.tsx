import "./pages.css";

import React, { useState, useEffect } from 'react';
import MakeAvatarModal from "../AvatarCreation/MakeAvatarModal";

const Settings = (props) => {
  // state variables
  const [activeTab, setActiveTab] = useState("general");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // update the avatar
  const updateAvatar = () => {
    // placeholder
    alert("Avatar updated!");
  };

  // 

  return (
    <div className="page">
      {/* <div id="containerId"><NotifButton></NotifButton></div> */}
      <h1 className="page-title">Settings</h1>

      {/* tabs */}
      <div className="settings-page-tabs">
        <div className={`settings-page-tab-links ${activeTab === "general" ? "settings-page-active-link" : ""}`} onClick={() => setActiveTab("general")}>
          General
        </div>
        <div className={`settings-page-tab-links ${activeTab === "account" ? "settings-page-active-link" : ""}`} onClick={() => setActiveTab("account")}>
          Account
        </div>
      </div>

      {/* general settings */}
      <div className={`settings-page-tab-contents ${activeTab === "general" ? "settings-page-active-tab" : ""}`} id="general">
        <div>general settings go here,<br></br> these are just some placeholders/examples for now</div>
        <div className="setting-in-page">
          <h5></h5>
          <button id="editAvatarBtn" onClick={() => { setShowAvatarModal(true); }}>Edit Avatar</button>
        </div>

        <div className="setting-in-page">
          <h5>Language</h5>
          <select id="language-select">
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>
        </div>

        <div className="setting-in-page">
          <h5>Notifications</h5>
          <div className="row">
            <p className='text'>All notifications</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className='setting-in-page'>
          <h5></h5>
          <div className="column">
            <div className="row">
              <p className='text'>Messages</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="row">
              <p className='text'>Tags/Mentions</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="row">
              <p className='text'>Project Post Activity</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="row">
              <p className='text'>Push Notifications</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="row">
              <p className='text'>Desktop Notifications</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="setting-in-page">
          <h5>Dark Mode</h5>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="setting-in-page">
          <h5>Autoplay</h5>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="setting-in-page">
          <h5>Volume</h5>
        </div>

      </div>

      {/* account settings */}
      <div className={`settings-page-tab-contents ${activeTab === "account" ? "settings-page-active-tab" : ""}`} id="account">
        <div>account settings go here,<br></br> these are just some placeholders/examples for now</div>
        <div className="setting-in-page">
          <h5></h5>
        </div>
      </div>

      <MakeAvatarModal
        show={showAvatarModal}
        onClose={() => { setShowAvatarModal(false); }}
        onConfirm={() => {
          setShowAvatarModal(false);
          updateAvatar();
        }}
      />
    </div>
  );
}

export default Settings;