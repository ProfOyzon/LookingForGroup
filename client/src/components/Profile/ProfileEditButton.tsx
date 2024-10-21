import React, { useState, useEffect } from 'react';
import { PagePopup, openClosePopup } from "../PagePopup";
// import { Popup, PopupContent, PopupButton } from "../Popup";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

// On click, this button should open the Profile Edit modal 
const EditButton = () => {
    const [showPopup, setShowPopup] = useState(false);

    // let content = (<div id='edit-profile-header'>
    //                     <button className='profile-discover-button' id='selected' onClick={() => {}}>Discover Card</button>
    //                     <button className='profile-about-button' onClick={() => {}}>About & Projects</button>
    //                     <button className='profile-skills-button' onClick={() => {}}>Skills</button>
    //                 </div>);

    return (
        <div id='profile-edit-button-section'>
            <button className='profile-edit-button' onClick={() => openClosePopup(showPopup, setShowPopup)}>Edit Profile</button>
            {/* <PopupButton buttonId={"profile-edit-button"} callback={() => setShowPopup}>Edit Profile</PopupButton> */}

            {/* The "Edit Profile" popup */}
            <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup}>
                <div id='edit-profile-header'>
                    <button className='profile-discover-button' id='selected' onClick={() => {}}>Discover Card</button>
                    <button className='profile-about-button' onClick={() => {}}>About & Projects</button>
                    <button className='profile-skills-button' onClick={() => {}}>Skills</button>
                </div>

                <div id='edit-profile-body'>
                    <div id='edit-profile-column-1'>
                        {/* Profile pic / avatar */}
                        <div className='edit-region photo'>
                            <div className='edit-region-image photo'></div>
                            <button className='edit-region-button upload'><i className='fa fa-camera'></i> Upload Photo</button>
                            <button className='edit-region-button avatar'><i className='fa-solid fa-cat'></i> Use Avatar</button>
                        </div>

                        {/* Name */}
                        <div className='edit-region name'>
                            <div className='edit-region-header name'>Name</div>
                            <input type='text' className='edit-region-input name' placeholder='TEST...'></input>
                        </div>

                        {/* Proficiency */}
                        <div className='edit-region proficiency'>
                            <div className='edit-region-header proficiency'>Proficieny</div>
                            <select className='edit-region-input proficiency'>
                                <option value={"TEST"}>TEST...</option>
                            </select>
                        </div>

                        {/* Headline */}
                        <div className='edit-region headline'>
                            <div className='edit-region-header headline'>Headline</div>
                            <div className='edit-region-instruct headline'>Introduce yourself in a sentence or two. Be fun!</div>
                            <textarea className='edit-region-input headline' placeholder='TEST...'></textarea>
                        </div>
                    </div>
                    <div id='edit-profile-column-2'>
                        {/* Pronouns */}
                        <div className='edit-region pronouns'>
                            <div className='edit-region-header pronouns'>Pronouns <i className='fa-solid fa-transgender'></i></div>
                            <input type='text' className='edit-region-input pronouns' placeholder='TE/ST'></input>
                        </div>

                        {/* Major and year */}
                        <div className='edit-region major'>
                            <div className='edit-region-header major'>Major and Year <i className='fa-solid fa-graduation-cap'></i></div>
                            <input type='text' className='edit-region-input major' placeholder='TEST, Test Year'></input>
                        </div>

                        {/* Where are you from? */}
                        <div className='edit-region where'>
                            <div className='edit-region-header where'>Where are you from? <i className='fa-solid fa-location-dot'></i></div>
                            <input type='text' className='edit-region-input where' placeholder='TEST...'></input>
                        </div>

                        {/* Favorite project */}
                        <div className='edit-region favorite'>
                            <div className='edit-region-header favorite'>Favorite Project <i className='fa-regular fa-folder'></i></div>
                            <select className='edit-region-input favorite'>
                                <option value={"TEST"}>TEST...</option>
                            </select>
                        </div>

                        {/* Fun fact */}
                        <div className='edit-region funfact'>
                            <div className='edit-region-header funfact'>Fun Fact <i className='fa-solid fa-star'></i></div>
                            <div className='edit-region-instruct funfact'>What's a short fun fact about you?</div>
                            <textarea className='edit-region-input funfact' placeholder='TEST...'></textarea>
                        </div>
                    </div>
                </div>
            </PagePopup>
            {/* <Popup children={content}></Popup> */}
        </div>
    );
};

export default EditButton;