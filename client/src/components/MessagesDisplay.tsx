import React from "react";
import { MessageCard } from "./MessageCard";
import { messages } from "../constants/fakeData";

export const MessagesDisplay = ({userID}) => {
    return(
        <div>
            {
                messages.map(msg => {
                    if(msg.recipientID == userID){
                        return (
                            <MessageCard msg={msg} />
                        )
                    }
                })
            }
        </div>
    )
}