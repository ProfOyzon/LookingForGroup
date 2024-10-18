import React, { useState, useEffect } from 'react';
import { PagePopup, openClosePopup } from "../PagePopup";

// On click, this button should open the Profile Edit modal 
const EditButton = () => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div id='profile-edit-button-section'>
            <button className='profile-edit-button' onClick={() => openClosePopup(showPopup, setShowPopup)}>Edit Profile</button>

            {/* Edit Profile popup */}
            <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup}>
                <div id='edit-profile-header'>
                    <button className='profile-discover-button' id='selected' onClick={() => {}}>Discover Card</button>
                    <button className='profile-about-button' onClick={() => {}}>About & Projects</button>
                    <button className='profile-skills-button' onClick={() => {}}>Skills</button>
                </div>
            </PagePopup>
        </div>
    );
};

export default EditButton;