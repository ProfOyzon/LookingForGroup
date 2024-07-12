import "./pages.css";

import React, { useState, useEffect } from 'react';
import MakeAvatarModal from "../AvatarCreation/MakeAvatarModal";
import VolumeSettings from "../SettingsPageComponents/VolumeSetting";
import NotificationSettings from "../SettingsPageComponents/NotificationSetting";


const Settings = ({setAvatarImage}) => {
  // state variables
  const [activeTab, setActiveTab] = useState("general");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  return (
    <div className="page">
      {/* <div id="containerId"><NotifButton></NotifButton></div> */}
      <h1 className="page-title">Settings</h1>

      <div id="settings-page">
        {/*************************************************************

          Tabs 

          *************************************************************/}
        <div className="settings-page-tabs">
          <div className={`settings-page-tab-links ${activeTab === "general" ? "settings-page-active-link" : ""}`} onClick={() => setActiveTab("general")}>
            General
          </div>
          <div className={`settings-page-tab-links ${activeTab === "privacy" ? "settings-page-active-link" : ""}`} onClick={() => setActiveTab("privacy")}>
            Privacy
          </div>
          <div className={`settings-page-tab-links ${activeTab === "syncing" ? "settings-page-active-link" : ""}`} onClick={() => setActiveTab("syncing")}>
            Syncing
          </div>
          <div className={`settings-page-tab-links ${activeTab === "account" ? "settings-page-active-link" : ""}`} onClick={() => setActiveTab("account")}>
            Account
          </div>
        </div>

        {/*************************************************************

          General settings 

          *************************************************************/}
        <div className={`settings-page-tab-contents ${activeTab === "general" ? "settings-page-active-tab" : ""}`} id="general">
          <div className="setting-in-page">
            <h3>My Avatar</h3>
            <button id="editAvatarBtn" onClick={() => { setShowAvatarModal(true); }}>Edit Avatar</button>
            <MakeAvatarModal
              show={showAvatarModal}
              onClose={() => { setShowAvatarModal(false); }}
              setAvatarImage={setAvatarImage}
              // onConfirm={() => {
              //   setShowAvatarModal(false);
              // }}
            />
          </div>

          <div className="setting-in-page">
            <h3>Language
            </h3>
            <div className="setting-content">
              <select id="language-select">
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>
          </div>

          <NotificationSettings />

          <div className="setting-in-page">
            <h3>Dark Mode
              <br></br>
              <span>Change the theme of the page</span>
            </h3>
            <div className="setting-content">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="setting-in-page">
            <h3>Autoplay
              <br></br>
              <span>Videos will play automatically</span>
            </h3>
            <div className="setting-content">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <VolumeSettings />

          <div id="setting-spacer" ></div>

        </div>

        {/*************************************************************

          Privacy settings 

          *************************************************************/}
        <div className={`settings-page-tab-contents ${activeTab === "privacy" ? "settings-page-active-tab" : ""}`} id="privacy">
          <div>privacy settings go here</div>
          <div className="setting-in-page">
            <h3>Profile View
              <br></br>
              <span>Who can view your profile</span>
            </h3>
            <div className="setting-content"></div>
          </div>

          <div className="setting-in-page">
            <h3>Followers
              <br></br>
              <span>Who can follow your profile</span>
            </h3>
            <div className="setting-content"></div>
          </div>

          <div className="setting-in-page">
            <h3>Messages
              <br></br>
              <span>Who can message you or messages you want to see</span>
            </h3>
            <div className="setting-content"></div>
          </div>

          <div className="setting-in-page">
            <h3>Data
              <br></br>
              <span>What data can be collected</span>
            </h3>
            <div className="setting-content"></div>
          </div>

          <div id="setting-spacer" ></div>
        </div>

        {/*************************************************************

          Syncing options

          *************************************************************/}
        <div className={`settings-page-tab-contents ${activeTab === "syncing" ? "settings-page-active-tab" : ""}`} id="syncing">
          <div>syncing options go here</div>
          <div className="setting-in-page">
            <h3></h3>
            <div className="setting-content"></div>
          </div>

          <div id="setting-spacer" ></div>
        </div>

        {/*************************************************************

          Account settings 

          *************************************************************/}
        <div className={`settings-page-tab-contents ${activeTab === "account" ? "settings-page-active-tab" : ""}`} id="account">
          <div>account settings go here</div>
          <div className="setting-in-page">
            <h3>Password
              <br></br>
              <span>Change your password</span>
            </h3>
            <div className="setting-content"></div>
          </div>

          <div className="setting-in-page">
            <h3>Email
              <br></br>
              <span>Change your email</span>
            </h3>
            <div className="setting-content"></div>
          </div>

          <div className="setting-in-page">
            <h3>Delete Account
              <br></br>
              <span>Permanently delete your account</span>
            </h3>
            <div className="setting-content"></div>
          </div>

          <div id="setting-spacer" ></div>
        </div>

      </div>
    </div>
  );
}

export default Settings;