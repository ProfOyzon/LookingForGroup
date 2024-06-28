import React, { useState, useEffect } from 'react';

const VolumeSettings = (props) => {
    ;
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

    // styling
    const musicStyle = {
        background: `linear-gradient(to right, #F76902 ${musicValue}%, #D0D0D0 ${musicValue}%)`
    };

    const sfxStyle = {
        background: `linear-gradient(to right, #F76902 ${sfxValue}%, #D0D0D0 ${sfxValue}%)`
    };

    return (
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
    );
};

export default VolumeSettings;
