import React from "react";
import bellIcon from "../img/bell.png";
import { CreateNotifs } from "./NotificationBoxes";

export function NotifButton() {

    return (
        <div className="notif-button-wrapper">
            <button id="notif-button" onClick={HandleClick}>
                <img src={bellIcon} className="notif-button-icon" />
                <div id="notif-popup" className="hidden">
                    <CreateNotifs></CreateNotifs>
                </div>
            </button>

        </div>
    )
}



function HandleClick() {
    let notifButton = document.getElementById("notif-popup") as HTMLElement;
    notifButton.classList.toggle('hidden');
}