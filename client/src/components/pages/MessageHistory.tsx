import React from "react";
import { messages } from "../../constants/fakeData";
import { MessageLine } from "../MessageLine";
import { profiles } from "../../constants/fakeData";

const MessageHistory = (props) => {
    // TEMP, these will be alterable in the future
    const asUser = 0;
    const fromUser = 1;

    const getName = (id: number) => {
        for(let p of profiles){
            if(p._id == id) return p.username;
        }
    }

    return(
        <div>
            {
                messages.map(m => {
                    if(asUser == m.recipientID && fromUser == m.senderID){
                        return (
                            <MessageLine msg={m}  username={getName(fromUser)} type="recieved-msg" />
                        );
                    }
                    else if(asUser == m.senderID && fromUser == m.recipientID){
                        return (
                            <MessageLine msg={m}  username={getName(asUser)} type="sent-msg" />
                        );
                    }
                })
            }
        </div>
    )
}

export default MessageHistory;