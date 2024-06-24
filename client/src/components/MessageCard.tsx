import React from "react";
import { profiles } from "../constants/fakeData";
import profilePicture from "../images/blue_frog.png";

export const MessageCard = ({ msg }) => {
    if (!msg) return;
    const getS = () => {
        for (let p of profiles) {
            if (p._id == msg.senderID) {
                return p;
            }
        }
        console.log("ERROR: invalid sender ID")
        return;
    }
    const sender = getS();
    if (!sender) return;
    return (
        <div className="discover-card" id="message-card">
            <img src={profilePicture} id="discover-card-profile-picture" />
            <div id="discover-card-body">
                <h2 id="discover-card-name">{sender.name}</h2>
                <div id="discover-card-description">
                    <p>{msg.messageConent}</p>
                    <p><i>{msg.sentDate}</i></p>
                </div>
            </div>
        </div>
    )
}