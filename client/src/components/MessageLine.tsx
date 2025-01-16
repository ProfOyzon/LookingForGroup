import React from "react";
import { messages, profiles } from "../constants/fakeData";// FIXME: use data in db
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";

// Called in Message History to display usernames and message contents
export const MessageLine = ({ msg, username, type }) => {
    console.log(msg);

    const navigate = useNavigate();
    let profile;
    // finds the profile associated with the usernames and stores it for use in the path
    for (let p of profiles) {
        if (username == p.username) {
            profile = p;
        }
    }
    const pathQuery = `?profID=${profile._id}`;
    
    return (
        <div className={type}>
            <p className="message-line-user"onClick={() => 
                // onClick navigates to the appropriate profile page
                navigate(paths.routes.PROFILE + pathQuery)}><b>{username}</b></p>
            <p>{msg.messageContent}</p>
            <p className="date-stamp"><i>{msg.sentDate}</i></p>
        </div>
    )
}