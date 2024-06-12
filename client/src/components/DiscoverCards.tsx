import React from "react";
import { Tags } from "./Tags";

import profilePicture from "../images/blue_frog.png";
import followPicture from "../images/heart.png";

import { projects } from "../constants/fakeData";

export const DiscoverCards = () => {
    let cardData = projects[0];
    return (
        <div className="discover-card">
            <img id="discover-card-profile-picture" src={profilePicture} alt={cardData.title}/>
            <div id="discover-card-body">
                <h2 id="discover-card-name">{cardData.title}</h2>
                <p id="discover-card-description">{cardData.description}</p>
                <div id="discover-card-tag-wrapper">
                    <Tags>{cardData.tags[0]}</Tags>
                    <Tags>{cardData.tags[1]}</Tags>
                    <Tags>{cardData.tags[2]}</Tags>
                </div>
            </div>
            {/* <button id="discover-card-follow" >
                <img src={followPicture}/>
            </button> */}
        </div>
    );
}

