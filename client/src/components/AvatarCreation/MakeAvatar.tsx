import React, { useState, useEffect } from 'react';
import './makeAvatar.css';

// avatar types and images for each color
const avatars = {
    cat: ["images/avatars/blackCat.png", "images/avatars/orangeCat.png", "images/avatars/whiteCat.png"],
    dog: ["images/avatars/brownDog.png", "images/avatars/blackDog.png", "images/avatars/tanDog.png"],
    frog: ["images/avatars/greenFrog.png", "images/avatars/bluegreenFrog.png", "images/avatars/blueFrog.png"],
    fox: ["images/avatars/orangeFox.png", "images/avatars/redFox.png", "images/avatars/tanFox.png"],
}
// array of hat images and alt text
const hats = [
    { src: "images/hats/noHat.png", alt: "none" },
    { src: "images/hats/pinkBow.png", alt: "pink bow" },
    { src: "images/hats/flowerCrown.png", alt: "flower crown" },
    { src: "images/hats/cowboyHat.png", alt: "cowboy hat" },
    { src: "images/hats/wizardHat.png", alt: "wizard hat" },
    { src: "images/hats/chefsHat.png", alt: "chef's hat" },
    { src: "images/hats/topHat.png", alt: "top hat" },
    { src: "images/hats/beanie.png", alt: "beanie" },
]

const MakeAvatar = () => {
    // initialize state variables
    // current slide index
    const [slideIndex, setSlideIndex] = useState(1);
    // current selected avatar type
    const [selectedAvatar, setSelectedAvatar] = useState("cat");
    // color options for the selected avatar
    const [colorOptions, setColorOptions] = useState(avatars.cat);
    // active customization tab (color or hats)
    const [activeTab, setActiveTab] = useState("color");

    // current color
    const [currentColors, setCurrentColors] = useState({
        cat: avatars.cat[0],
        dog: avatars.dog[0],
        frog: avatars.frog[0],
        fox: avatars.fox[0],
    });
    // current hats for the selected avatar
    const [currentHats, setCurrentHats] = useState({
        cat: "",
        dog: "",
        frog: "",
        fox: "",
    });

    // update color options when selected avatar changes
    useEffect(() => {
        setColorOptions(avatars[selectedAvatar]);
    }, [selectedAvatar]);

    // change the slide index and update the selected avatar
    const plusSlides = (n) => {
        let newSlideIndex = slideIndex + n;
        const totalAvatars = Object.keys(avatars).length;
        if (newSlideIndex > totalAvatars) newSlideIndex = 1;
        if (newSlideIndex < 1) newSlideIndex = totalAvatars;
        setSlideIndex(newSlideIndex);
        setSelectedAvatar(Object.keys(avatars)[newSlideIndex - 1]);
    };

    // set the slide index to the value and update the selected avatar
    const currentSlide = (n) => {
        setSlideIndex(n);
        setSelectedAvatar(Object.keys(avatars)[n - 1]);
    };

    // change the selected hat
    const changeHat = (hat) => {
        setCurrentHats((prevHats) => ({
            ...prevHats,
            // if the hat is the cancel icon, remove the hat
            [selectedAvatar]: hat === "images/hats/noHat.png" ? "" : hat,
        }));
    };

    // change the color of the avatar
    const changeColor = (color) => {
        setCurrentColors((prevColors) => ({
            ...prevColors,
            [selectedAvatar]: color,
        }));
    };

    // get the class for the hat image 
    // in the case where the hat needs to be in different locations for each avatar
    // based on the selected avatar to display the hat correctly (location)
    const getHatClass = (avatar) => {
        switch (avatar) {
            // case "cat":
            //     return "hat cat-hat";
            // case "dog":
            //     return "hat dog-hat";
            case "frog":
                return "hat frog-hat";
            // case "fox":
            //     return "hat fox-hat";
            default:
                return "hat";
        }
    };

    // render the page
    return (
        <div className="MakeAvatar">
            <h1 id="customize-title">Customize Avatar</h1>

            <div id="avatar-select">
                {/* previous button */}
                <button className="arrowBtn" onClick={() => plusSlides(-1)}>
                    <img src="images/icons/arrow-right.png" alt="left arrow" className="left-btn btn-icon" />
                </button>

                {/* displayed avatar */}
                <div id="avatar">
                    {/* avatar container */}
                    <div className="slideshow">
                        {Object.keys(avatars).map((key, index) => (
                            <div
                                className="avatar-slide"
                                key={key}
                                style={{ display: slideIndex === index + 1 ? "flex" : "none" }}
                            >
                                {/* avatar */}
                                <div className="myAvatar" id={key} >
                                    <div id="hat-container">
                                    <img src={currentHats[key]} alt="" className={getHatClass(key)}/>
                                    </div>

                                    <img src={currentColors[key]} alt={key} className="animals" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* dot indicators */}
                    <div style={{ textAlign: "center" }}>
                        {Object.keys(avatars).map((_, index) => (
                            <span
                                className={`slide-dot ${slideIndex === index + 1 ? "active" : ""}`}
                                key={index}
                                onClick={() => currentSlide(index + 1)}
                            ></span>
                        ))}
                    </div>
                </div>

                {/* next button */}
                <button className="arrowBtn" onClick={() => plusSlides(1)}>
                    <img src="images/icons/arrow-right.png" alt="right arrow" className="btn-icon" />
                </button>
            </div>

            {/* avatar customization options */}
            <div id="avatar-customization">
                <div id="customize-options">

                    {/* tab links */}
                    <div className="tabs">
                        <div className={`tab-links ${activeTab === "color" ? "active-link" : ""}`} onClick={() => setActiveTab("color")}>
                            <img src="images/icons/paint-bucket.png" alt="palette" className="icon" />
                        </div>
                        <div className={`tab-links ${activeTab === "hats" ? "active-link" : ""}`} onClick={() => setActiveTab("hats")}>
                            <img src="images/icons/cowboy-hat.png" alt="palette" className="icon" />
                        </div>
                    </div>

                    {/* color options */}
                    <div className={`tab-contents ${activeTab === "color" ? "active-tab" : ""}`} id="color">
                        <div className="options">
                            {colorOptions.map((color, index) => (
                                <div key={index} className="color-option">
                                    <img src={color} alt={`color-option-${index}`} onClick={() => changeColor(color)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* hat options */}
                    <div className={`tab-contents ${activeTab === "hats" ? "active-tab" : ""}`} id="hats">
                        <div className="options">
                            {hats.map((hat, index) => (
                                <div key={index} className="hat-option" onClick={() => changeHat(hat.src)}>
                                    <img src={hat.src} alt={hat.alt} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* create button */}
            <div id="avatar-create">
                <button id="createBtn" onClick={() => alert("Avatar Created!")}>
                    Create!
                </button>
            </div>
        </div>
    );
}

export default MakeAvatar;