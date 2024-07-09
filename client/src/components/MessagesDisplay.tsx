import React from "react";
import { MessageCard } from "./MessageCard";
import { messages } from "../constants/fakeData";
import { SearchBar } from "./SearchBar";
import { useState, useCallback } from "react";

export const MessagesDisplay = ({userID}) => {

    // --- Searching ---
    const [filteredMessages, setFilteredMessages] = useState(messages);

    const HandleSearch = useCallback((results) => {
        setFilteredMessages(results[0]);
      }, []);

    return(
        <div>
            <SearchBar dataSets={[{ data: messages }]} onSearch={HandleSearch}></SearchBar>
            {
                filteredMessages.map(msg => {
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