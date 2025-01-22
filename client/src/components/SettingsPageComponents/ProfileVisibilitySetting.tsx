import React, { useState, useEffect } from 'react';

const ProfileVisibilirySetting = () => {
  return (
    <div className="setting-in-page">
      <h3>
        Profile Visibility
        <br></br>
        <span>Manage what others can view on your profile</span>
      </h3>
      <div className="setting-content">
        <div className="column">
          <div className="row">
            <p className="text">View Profile</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="row">
            <p className="text">View Following</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="row">
            <p className="text">View Favorites</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="row">
            <p className="text">View Activity</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVisibilirySetting;
