import React, { useState, useEffect } from 'react';
import './makeAvatar.css';

// avatar types and images for each color (three variations)
const avatars = {
    cat: ["images/avatars/blackCat.png", "images/avatars/orangeCat.png", "images/avatars/whiteCat.png"],
    dog: ["images/avatars/brownDog.png", "images/avatars/blackDog.png", "images/avatars/tanDog.png"],
    frog: ["images/avatars/greenFrog.png", "images/avatars/bluegreenFrog.png", "images/avatars/blueFrog.png"],
    fox: ["images/avatars/orangeFox.png", "images/avatars/redFox.png", "images/avatars/tanFox.png"],
}

// array of hat images and alt text
// these hat images are not centered,
// it's the same size as the avatar images, and positioned based on the cat avatar to be the right height
// ex. if you place these images directly on top of the cat avatar, they will be positioned correctly
// in the case of the frog, since it's head is a bit lower, it uses it's own className and just lowers the hat position
const displayHats = [
    { src: "images/icons/hats/noHat.png", alt: "none" },
    { src: "images/hats/pinkBow.png", alt: "pink bow" },
    { src: "images/hats/flowerCrown.png", alt: "flower crown" },
    { src: "images/hats/plant.png", alt: "plant" },
    { src: "images/hats/mushrooms.png", alt: "mushrooms" },
    { src: "images/hats/cowboyHat.png", alt: "cowboy hat" },
    { src: "images/hats/wizardHat.png", alt: "wizard hat" },
    { src: "images/hats/chefsHat.png", alt: "chef's hat" },
    { src: "images/hats/topHat.png", alt: "top hat" },
]

// array of hat images and alt text for the hat option boxes
// these images are different, the hats are centered in the image
const hatIcons = [
    { src: "images/icons/hats/noHat.png", alt: "none" },
    { src: "images/icons/hats/pinkBowCenter.png", alt: "pink bow" },
    { src: "images/icons/hats/flowerCrownCenter.png", alt: "flower crown" },
    { src: "images/icons/hats/plantCenter.png", alt: "plant" },
    { src: "images/icons/hats/mushroomsCenter.png", alt: "mushrooms" },
    { src: "images/icons/hats/cowboyHatCenter.png", alt: "cowboy hat" },
    { src: "images/icons/hats/wizardHatCenter.png", alt: "wizard hat" },
    { src: "images/icons/hats/chefsHatCenter.png", alt: "chef's hat" },
    { src: "images/icons/hats/topHatCenter.png", alt: "top hat" },
];

const MakeAvatarModal = ({ show, onClose, onConfirm }) => {
    // initialize state variables
    // current slide index
    const [slideIndex, setSlideIndex] = useState(1);
    // current selected avatar type
    const [selectedAvatar, setSelectedAvatar] = useState("cat");
    // color options for the selected avatar
    const [colorOptions, setColorOptions] = useState(avatars.cat);
    // active customization tab (color or hats)
    const [activeTab, setActiveTab] = useState("avatar-color");

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
    const changeHat = (index) => {
        const hat = displayHats[index].src;

        setCurrentHats((prevHats) => ({
            ...prevHats,
            // if the hat is the cancel icon, remove the hat
            [selectedAvatar]: hat === "images/icons/hats/noHat.png" ? "" : hat,
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
                return "avatar-hat avatar-frog-hat";
            // case "fox":
            //     return "hat fox-hat";
            default:
                return "avatar-hat";
        }
    };

    // if the modal is not shown, return null
    if (!show) {
        return null;
    }

    // save and update the avatar
    const updateAvatar = () => {
        // placeholder
        // alert("Avatar updated!");

        // get the images in the displayed avatar
        const avatar = document.getElementById(`currentAvatar-${selectedAvatar}`) as HTMLImageElement;
        const hat = document.getElementById(`currentHat-${selectedAvatar}`) as HTMLImageElement;

        // check if the avatar and hat exist (they always should but just in case)
        if (!avatar || !hat) return;
        
        // create a canvas to draw the images on
        const canvas = document.createElement("canvas");
        canvas.width = avatar.width;
        canvas.height = avatar.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // draw the images on the canvas
        ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height);

        // adjust the hat position based on the avatar
        if (selectedAvatar === "frog") {
            ctx.drawImage(hat, 0, 10, hat.width, hat.height);
        } 
        else {
            ctx.drawImage(hat, 0, 0, hat.width, hat.height);
        }

        // save the canvas as a new image
        const updateAvatar = canvas.toDataURL("image/png");

        // update the user's avatar in the database
        // for now just open the image in a new tab
        const newTab = window.open();
        if (!newTab) return;

        newTab.document.write(`<img src="${updateAvatar}" />`);
    };

    // render the page
    return (
        <div className="avatar-modal">
            <div className="MakeAvatar">
                <div className="avatar-close-btn" onClick={onClose}>
                    <img src="images/icons/cancel.png" alt="close" />
                </div>

                <h1 id="avatar-customize-title">Customize Avatar</h1>

                <div id="avatar-select">
                    {/* previous button */}
                    <button className="avatar-arrowBtn" onClick={() => plusSlides(-1)}>
                        <img src="images/icons/arrow-right.png" alt="left arrow" className="avatar-left-btn avatar-btn-icon" />
                    </button>

                    {/* displayed avatar */}
                    <div id="avatar">
                        {/* avatar container */}
                        <div className="avatar-slideshow">
                            {Object.keys(avatars).map((key, index) => (
                                <div
                                    className="avatar-slide"
                                    key={key}
                                    style={{ display: slideIndex === index + 1 ? "flex" : "none" }}
                                >
                                    {/* avatar */}
                                    <div className="myAvatar" id={key} >
                                        <div id="avatar-hat-container">
                                            <img src={currentHats[key]} alt="" className={getHatClass(key)} id={`currentHat-${key}`} />
                                        </div>

                                        <img src={currentColors[key]} alt={key} className="avatar-animals" id={`currentAvatar-${key}`} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* dot indicators */}
                        <div style={{ textAlign: "center" }}>
                            {Object.keys(avatars).map((_, index) => (
                                <span
                                    className={`avatar-slide-dot ${slideIndex === index + 1 ? "active-avatar" : ""}`}
                                    key={index}
                                    onClick={() => currentSlide(index + 1)}
                                ></span>
                            ))}
                        </div>
                    </div>

                    {/* next button */}
                    <button className="avatar-arrowBtn" onClick={() => plusSlides(1)}>
                        <img src="images/icons/arrow-right.png" alt="right arrow" className="avatar-btn-icon" />
                    </button>
                </div>

                {/* avatar customization options */}
                <div id="avatar-customization">
                    <div id="avatar-customize-options">

                        {/* tab links */}
                        <div className="avatar-tabs">
                            <div className={`avatar-tab-links ${activeTab === "avatar-color" ? "avatar-active-link" : ""}`} onClick={() => setActiveTab("avatar-color")}>
                                <img src="images/icons/paint-bucket.png" alt="palette" className="avatar-icon" />
                            </div>
                            <div className={`avatar-tab-links ${activeTab === "avatar-hats" ? "avatar-active-link" : ""}`} onClick={() => setActiveTab("avatar-hats")}>
                                <img src="images/icons/cowboy-hat.png" alt="palette" className="avatar-icon" />
                            </div>
                        </div>

                        {/* color options */}
                        <div className={`avatar-tab-contents ${activeTab === "avatar-color" ? "avatar-active-tab" : ""}`} id="avatar-color">
                            <div className="avatar-options">
                                {colorOptions.map((color, index) => (
                                    <div key={index} className="avatar-color-option">
                                        <img src={color} alt={`avatar-color-option-${index}`} onClick={() => changeColor(color)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* hat options */}
                        <div className={`avatar-tab-contents ${activeTab === "avatar-hats" ? "avatar-active-tab" : ""}`} id="avatar-hats">
                            <div className="avatar-options">
                                {hatIcons.map((hat, index) => (
                                    <div key={index} className="avatar-hat-option" onClick={() => changeHat(index)}>
                                        <img src={hat.src} alt={hat.alt} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* create button */}
                <div id="avatar-create">
                    <button id="avatar-createBtn" onClick={() => { updateAvatar(); onConfirm(); }}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MakeAvatarModal;