import React, { useState, useEffect } from 'react';

const NotificationSettings = () => {
  return (
    <div className="setting-in-page">
      <h3>Notifications</h3>
      <div className='setting-content'>
        <div className="column">
          <div className="row">
            <p className='text'>All notifications</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
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
    </div>
  );
};

export default NotificationSettings;
