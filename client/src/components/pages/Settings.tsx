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