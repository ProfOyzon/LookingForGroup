import React from "react";
import { Tags } from "./Tags";

import profilePicture from "../images/blue_frog.png";
import followPicture from "../images/heart.png";

import { projects } from "../constants/fakeData";

export const ProfileCard = ({profile}) => {
    return (
        <div className="profile-card">
            <img id="profile-card-profile-picture" src={profilePicture} alt={profile.name}/>
            <div id="profile-card-body">
                <span><h2 id="profile-card-name">{profile.name}</h2><p id="profile-card-pronouns">{profile.pronouns[0]}/{profile.pronouns[1]}</p></span>
                <p id="profile-card-description">{profile.bio}</p>
                <div id="profile-card-tag-wrapper">
                    <Tags>{profile.skills[0].skill}</Tags>
                    <Tags>{profile.skills[1].skill}</Tags>
                    <Tags>{profile.skills[2].skill}</Tags>
                </div>
            </div>
            {/* <button id="profile-card-follow" >
                <img src={followPicture}/>
            </button> */}
        </div>
    );
}

