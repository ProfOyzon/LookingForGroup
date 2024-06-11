import React from "react";
import { Tags } from "./Tags";

import profilePicture from "../images/blue_frog.png";
import followPicture from "../images/heart.png";

export const DiscoverCards = () => {
    return (
        <div className="discover-card">
            <img id="discover-card-profile-picture" src={profilePicture}/>
            <div id="discover-card-body">
                <h2 id="discover-card-name">Cool Game</h2>
                <p id="discover-card-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam autem eius placeat. Neque praesentium esse, maiores quae consectetur inventore non at amet delectus tempore, suscipit incidunt et harum omnis ducimus.</p>
                <div id="discover-card-tag-wrapper">
                    <Tags>Game</Tags>
                    <Tags>Cool</Tags>
                    <Tags>New</Tags>
                </div>
            </div>
            {/* <button id="discover-card-follow" >
                <img src={followPicture}/>
            </button> */}
        </div>
    );
}

