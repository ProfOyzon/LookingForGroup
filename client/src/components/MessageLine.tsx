import React from "react";
import { messages } from "../constants/fakeData";

export const MessageLine = ({msg, username, type}) => {
    console.log(msg);
    return(
        <div className={type}>
            <p><b>{username}</b></p>
            <p>{msg.messageContent}</p>
            <p className="date-stamp"><i>{msg.sentDate}</i></p>
        </div>
    )
}