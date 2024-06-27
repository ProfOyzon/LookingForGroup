import React, { useState, useEffect } from 'react';

const VolumeSettings = (props) => {
    const [musicValue, setMusicValue] = useState(50);
    const [sfxValue, setSfxValue] = useState(50);

    // update the music value
    const updateMusicValue = (event) => {
        setMusicValue(event.target.value);
    };

    // update the sound effects value
    const updateSfxValue = (event) => {
        setSfxValue(event.target.value);
    };

    return (
        <div className="setting-in-page">
            <div className="column">
                <div className="row">
                    <p>Music</p>
                    <input type="range" min="0" max="100" value={musicValue} onChange={updateMusicValue} className="volumeSlider" />
                </div>
                <div className="row">
                    <p>Sound Effects</p>
                    <input type="range" min="0" max="100" value={sfxValue} onChange={updateSfxValue} className="volumeSlider" />
                </div>
            </div>
        </div>
    );
};

export default VolumeSettings;
