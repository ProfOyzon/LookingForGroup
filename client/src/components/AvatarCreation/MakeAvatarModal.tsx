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
    { src: "images/icons/noItem.png", alt: "none" },
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
    { src: "images/icons/noItem.png", alt: "none" },
    { src: "images/icons/hats/pinkBowCenter.png", alt: "pink bow" },
    { src: "images/icons/hats/flowerCrownCenter.png", alt: "flower crown" },
    { src: "images/icons/hats/plantCenter.png", alt: "plant" },
    { src: "images/icons/hats/mushroomsCenter.png", alt: "mushrooms" },
    { src: "images/icons/hats/cowboyHatCenter.png", alt: "cowboy hat" },
    { src: "images/icons/hats/wizardHatCenter.png", alt: "wizard hat" },
    { src: "images/icons/hats/chefsHatCenter.png", alt: "chef's hat" },
    { src: "images/icons/hats/topHatCenter.png", alt: "top hat" },
];

// array of clothes images and alt text
const displayClothes = [
    { src: "images/icons/noItem.png", alt: "none" },
    { src: "images/clothes/tutu.png", alt: "tutu" },
    { src: "images/clothes/overalls.png", alt: "overalls" },
    { src: "images/clothes/cowboyVest.png", alt: "cowboy vest eith sherrif's badge" },
    { src: "images/clothes/darkJacket.png", alt: "dark jacket" },
];

// array of clothes images and alt text for the clothes option boxes
const clothesIcons = [
    { src: "images/icons/noItem.png", alt: "none" },
    { src: "images/clothes/tutu.png", alt: "tutu" },
    { src: "images/clothes/overalls.png", alt: "overalls" },
    { src: "images/clothes/cowboyVest.png", alt: "cowboy vest eith sherrif's badge" },
    { src: "images/clothes/darkJacket.png", alt: "dark jacket" },
];

// array of accessory images and alt text
const displayAccessories = [
    { src: "images/icons/noItem.png", alt: "none" },
    { src: "images/accessories/cyberGlasses.png", alt: "cyber glasses" },
    { src: "images/accessories/wand.png", alt: "wand" },
];

// array of accessory images and alt text for the accessory option boxes
const accessoryIcons = [
    { src: "images/icons/noItem.png", alt: "none" },
    { src: "images/accessories/cyberGlasses.png", alt: "cyber glasses" },
    { src: "images/accessories/wand.png", alt: "wand" },
];

const MakeAvatarModal = ({ show, onClose, setAvatarImage }) => {
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
    // current hats for each avatar when selected
    const [currentHats, setCurrentHats] = useState("");
    // current clothes for each avatar when selected
    const [currentClothes, setCurrentClothes] = useState("");
    // current accessories for each avatar when selected
    const [currentAccessories, setCurrentAccessories] = useState("");

    // update color options when selected avatar changes
    useEffect(() => {
        setColorOptions(avatars[selectedAvatar]);
    }, [selectedAvatar]);

    // change the slide index and update the selected avatar
    // scroll through each type of animal avatar
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

    // change the selected item (hat, clothes, accessory)
    // index: index of the customization item
    // type: type of customization item (hat, clothes, accessory)
    const changeItems = (index, type) => {
        // get the item based on the index and type
        const items = {
            hat: displayHats[index] ? displayHats[index].src : null, // if the item doesn't exist, set to null
            clothes: displayClothes[index] ? displayClothes[index].src : null,
            accessory: displayAccessories[index] ? displayAccessories[index].src : null,
        };

        // get the current item for the selected avatar
        const currentItem = items[type];
        const noItem = "images/icons/noItem.png"; // default no item image

        // if the item doesn't exist, return
        // image should always exist, but just in case
        if (!currentItem) return;

        // set the current item
        const currentItemState = {
            hat: setCurrentHats,
            clothes: setCurrentClothes,
            accessory: setCurrentAccessories,
        };
        
        // update the current item for all avatars
        // this is done to display the selected item on all avatars
        Object.keys(avatars).forEach((avatar) => {
            currentItemState[type]((prevItems) => ({
                ...prevItems,
                [avatar]: currentItem === noItem ? "" : currentItem,
            }));
        });
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
            case "frog":
                return "avatar-hat avatar-frog-hat";
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
        // get the images in the displayed avatar
        const avatar = document.getElementById(`currentAvatar-${selectedAvatar}`) as HTMLImageElement;
        const hat = document.getElementById(`currentHat-${selectedAvatar}`) as HTMLImageElement;
        const outfit = document.getElementById(`currentClothes-${selectedAvatar}`) as HTMLImageElement;
        const accessory = document.getElementById(`currentAccessory-${selectedAvatar}`) as HTMLImageElement;

        // check if the avatar, hat, and outfit exist (they always should but just in case)
        if (!avatar || !hat || !outfit || !accessory) return;

        // create a canvas to draw the images on
        const canvas = document.createElement("canvas");
        canvas.width = avatar.width;
        canvas.height = avatar.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // draw the images on the canvas
        // draw the avatar
        ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height);

        // draw the hat
        // adjust the hat position based on the avatar
        if (selectedAvatar === "frog") {
            ctx.drawImage(hat, 0, 10, hat.width, hat.height);
        }
        else {
            ctx.drawImage(hat, 0, 0, hat.width, hat.height);
        }

        // draw the outfit
        ctx.drawImage(outfit, 0, 0, outfit.width, outfit.height);

        // draw the accessory
        ctx.drawImage(accessory, 0, 0, accessory.width, accessory.height);

        // save the canvas as a new image and display in sidebar
        const newAvatar = canvas.toDataURL("image/png");
        setAvatarImage(newAvatar);

        onClose();

        // // update the user's avatar in the database
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

                                        <div id="avatar-outfit-container">
                                            <img src={currentClothes[key]} alt="" className="avatar-clothes" id={`currentClothes-${key}`} />
                                        </div>

                                        <div id="avatar-accessory-container">
                                            <img src={currentAccessories[key]} alt="" className="avatar-accessories" id={`currentAccessory-${key}`} />
                                        </div>
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
                                <img src="images/icons/paint-bucket.png" alt="paint bucket" className="avatar-icon" />
                            </div>
                            <div className={`avatar-tab-links ${activeTab === "avatar-hats" ? "avatar-active-link" : ""}`} onClick={() => setActiveTab("avatar-hats")}>
                                <img src="images/icons/cowboy-hat.png" alt="hat" className="avatar-icon" />
                            </div>
                            <div className={`avatar-tab-links ${activeTab === "avatar-clothes" ? "avatar-active-link" : ""}`} onClick={() => setActiveTab("avatar-clothes")}>
                                <img src="images/icons/clothes-hanger.png" alt="clothes hanger" className="avatar-icon" />
                            </div>
                            <div className={`avatar-tab-links ${activeTab === "avatar-accessories" ? "avatar-active-link" : ""}`} onClick={() => setActiveTab("avatar-accessories")}>
                                <img src="images/icons/sunglasses.png" alt="sunglasses" className="avatar-icon" />
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
                                    <div key={index} className="avatar-hat-option" onClick={() => changeItems(index, 'hat')}>
                                        <img src={hat.src} alt={hat.alt} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* clothes options */}
                        <div className={`avatar-tab-contents ${activeTab === "avatar-clothes" ? "avatar-active-tab" : ""}`} id="avatar-clothes">
                            <div className="avatar-options">
                                {clothesIcons.map((clothes, index) => (
                                    <div key={index} className="avatar-clothes-option" onClick={() => changeItems(index, 'clothes')}>
                                        <img src={clothes.src} alt={clothes.alt} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* accessories options */}
                        <div className={`avatar-tab-contents ${activeTab === "avatar-accessories" ? "avatar-active-tab" : ""}`} id="avatar-accessories">
                            <div className="avatar-options">
                                {accessoryIcons.map((accessory, index) => (
                                    <div key={index} className="avatar-accessory-option" onClick={() => changeItems(index, 'accessory')}>
                                        <img src={accessory.src} alt={accessory.alt} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* create button */}
                <div id="avatar-create">
                    <button id="avatar-createBtn" onClick={updateAvatar}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MakeAvatarModal;