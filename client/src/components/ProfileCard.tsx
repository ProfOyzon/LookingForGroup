import React from "react";
import { Tags } from "./Tags";
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";

import profilePicture from "../images/blue_frog.png";
import followPicture from "../images/heart.png";

import { projects } from "../constants/fakeData";

// This is used by the Discover Page to display Profile information
export const ProfileCard = ({profile}) => {
    const navigate = useNavigate();
    const pathQuery = `?profID=${profile._id}`;
    return (
        <div className="discover-card">
            <img id="discover-card-profile-picture" src={profilePicture} alt={profile.name}/>
            <div id="discover-card-body">
                <span><h2 id="discover-card-name" onClick={() => navigate(paths.routes.PROFILE + pathQuery)}>{profile.name}</h2>
                {/* The pronouns are pulled from an array, and are mapped/joined together with / */}
                <p id="discover-card-pronouns">{profile.pronouns.map(p => `${p}`).join("/")}</p></span>
                <p id="discover-card-description">{profile.bio}</p>
                <div id="discover-card-tag-wrapper">
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

