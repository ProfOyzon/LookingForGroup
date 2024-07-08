import React, { useState, useEffect } from 'react';

const VolumeSettings = () => {
    // get the initial values from local storage or set them to 50
    // instead of local storage, will eventually get the values from the database
    const initialMusicValue = localStorage.getItem('musicValue') || 50;
    const initialSfxValue = localStorage.getItem('sfxValue') || 50;

    // set the values 
    const [musicValue, setMusicValue] = useState(Number(initialMusicValue));
    const [sfxValue, setSfxValue] = useState(Number(initialSfxValue));

    // update the music value and save it to local storage
    const updateMusicValue = (event) => {
        // local storage code
        // const newValue = event.target.value;
        // setMusicValue(newValue);
        // localStorage.setItem('musicValue', newValue);

        setMusicValue(event.target.value);
    };

    // update the sound effects value and save it to local storage
    const updateSfxValue = (event) => {
        // local storage code
        // const newValue = event.target.value;
        // setSfxValue(newValue);
        // localStorage.setItem('sfxValue', newValue);

        setSfxValue(event.target.value);
    };

    // styling
    const musicStyle = {
        background: `linear-gradient(to right, #F76902 ${musicValue}%, #D0D0D0 ${musicValue}%)`
    };

    const sfxStyle = {
        background: `linear-gradient(to right, #F76902 ${sfxValue}%, #D0D0D0 ${sfxValue}%)`
    };

    return (
        <div className="setting-in-page column">
            <h3>Volume</h3>
            <div className="setting-content">
                <div className="column">
                    <div className="column">
                        <p className="text">Music</p>
                        <input type="range" min="0" max="100" value={musicValue} onChange={updateMusicValue} className="volumeSlider" style={musicStyle} />
                    </div>
                    <div className="column">
                        <p className="text">Sound Effects</p>
                        <input type="range" min="0" max="100" value={sfxValue} onChange={updateSfxValue} className="volumeSlider" style={sfxStyle} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolumeSettings;
