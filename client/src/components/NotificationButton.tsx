import React from "react";
import bellIcon from "../img/bell.png";

let notifications = [

    { message: "Notification 1", time: new Date('2024-06-15T10:00:00Z') },
    { message: "Notification 2", time: new Date('2024-06-12T06:00:00Z') },
    { message: "Notification 3", time: new Date('2024-06-10T07:00:00Z') },
    { message: "Notification 4", time: new Date('2024-06-12T05:00:00Z') },
    { message: "Notification 5", time: new Date('2024-06-23T09:00:00Z') },
    { message: "Notification 6", time: new Date('2024-06-22T08:00:00Z') },
    { message: "Notification 7", time: new Date('2024-06-01T11:00:00Z') },
    { message: "Notification 8", time: new Date('2024-07-12T12:00:00Z') },

]

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

function CreateNotifs() {
    let sortedNotifs = notifications.sort((a, b) => a.time.getTime() - b.time.getTime());

    return (
        <>
        {sortedNotifs.map(notif => (
            <>
            <div className="date-sent-header">
                <p>{notif.time.getMonth()}-{notif.time.getDate()}-{notif.time.getFullYear()}</p>
            </div>
            <div className="notif-popup-boxes">
                <p>{notif.message} --- Time: {notif.time.getHours()}:{notif.time.getMinutes()}</p>
            </div>
            </>
        ))}
        </>
    )
}

function HandleClick() {
    let notifButton = document.getElementById("notif-popup") as HTMLElement;
    notifButton.classList.toggle('hidden');
}