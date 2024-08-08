import React from "react";
import { MessageCard } from "./MessageCard";
import { messages, profiles } from "../constants/fakeData";
import { SearchBar } from "./SearchBar";
import { useState, useCallback } from "react";

export const MessagesDisplay = ({ userID }) => {

    // --- Searching ---
    let searchList = [{}];
    searchList.pop();

    const [filteredMessages, setFilteredMessages] = useState(messages);

    // takes the search results and filters them into a new array to be properly displayed
    const HandleSearch = useCallback((results) => {
        let filteredBlocks = [results[0]];
        filteredBlocks.pop();
        let isMessage = false;
        let alreadyFiltered = false;
        for (let r of results[0]) {
            for (let m of messages) {
                if (r == m) {
                    if(filteredBlocks.includes(r)){
                        alreadyFiltered = true;
                    }
                    if (!alreadyFiltered) {
                        filteredBlocks.push(r);
                        isMessage = true;
                    }
                }
            }
            // if the result is a profile, this finds the associated message and adds that to the array
            if (!isMessage) {
                for (let p of profiles) {
                    if (r == p) {
                        for (let m of messages) {
                            if (p._id == m.senderID) {
                                if(filteredBlocks.includes(m)){
                                    alreadyFiltered = true;
                                }
                                if (!alreadyFiltered) {
                                    filteredBlocks.push(m);
                                }
                            }
                        }
                    }
                }
            }
            alreadyFiltered = false;
            isMessage = false;
        }
        setFilteredMessages(filteredBlocks);
    }, []);

    // adds all the messages received by the user, and all the profiles >
    // the user has recieved messages from into an array to be searched
    for (let m of messages) {
        if (m.recipientID == userID) {
            for (let p of profiles) {
                if (m.senderID == p._id) {
                    searchList.push(p);
                }
            }
            searchList.push(m);
        }
    }

    return (
        <div>
            <SearchBar dataSets={[{ data: searchList }]} onSearch={HandleSearch}></SearchBar>
            {
                filteredMessages.map(msg => {
                    if (msg.recipientID == userID) {
                        return (
                            <MessageCard msg={msg} />
                        )
                    }
                }
                )
            }
        </div>
    )
}