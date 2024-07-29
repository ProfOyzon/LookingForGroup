import React, { useState } from "react";
import { DisplayNotifs2 } from "../NotificationBoxes";

const Notifications = ({ show, onClose }) => {
  return (
    <div className={`notifications-container ${show ? 'show' : ''}`}>
      <div className="notifications-header">
        <button onClick={onClose}></button>
      </div>
      <div className="notifications-body">
        {/* add notifications here */}
        {/* <p>No new notifications</p> */}
        <DisplayNotifs2></DisplayNotifs2>
      </div>
    </div>
  );
};

export default Notifications;