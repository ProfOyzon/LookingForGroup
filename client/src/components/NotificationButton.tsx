import React from "react";
import bellIcon from "../img/bell.png";
import { DisplayNotifs } from "./NotificationBoxes";

//the notification button
export function NotifButton() {

    return (
        <div className="notif-button-wrapper">
            <button id="notif-button" onClick={HandleClick}>
                <img src={bellIcon} className="notif-button-icon" />
                <div id="notif-popup" className="hide"> 
                    <DisplayNotifs></DisplayNotifs>
                </div>
            </button>

        </div>
    )
}

function HandleClick() {
    let notifButton = document.getElementById("notif-popup") as HTMLElement;
    notifButton.classList.toggle('hide');
}