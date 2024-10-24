import React, { useState, useEffect } from 'react';
import { PagePopup, openClosePopup } from "../PagePopup";
// import { Popup, PopupContent, PopupButton } from "../Popup";
import { softSkills } from "../../constants/skills";
import { hardSkills } from "../../constants/skills";
import { proficiencies } from "../../constants/skills";
import { projects } from "../../constants/fakeData";

// On click, this button should open the Profile Edit modal 
const EditButton = ({user}) => {
    // console.log(user);
    const [showPopup, setShowPopup] = useState(false);

    let names = user.name.split(" ");
    let firstName = names[0];
    let lastName = names[1];
    if (names.length > 2) {
        for (let i = 2; i < names.length; i++) {
            lastName += names[i];
            if (i < names.length - 1) {
                lastName += " ";
            }
        }
    }

    let pronouns = "";
    if (user.pronouns.length > 0) {
        for (let i = 0; i < user.pronouns.length; i++) {
            pronouns += user.pronouns[i];
            if (i < user.pronouns.length - 1) {
                pronouns += "/";
            }
        }
    }
    else {
        pronouns = "N/A";
    }

    // "About" 
    const page1 = <div className='edit-profile-body about'>
        <div className='edit-profile-section-1'>
            {/* Profile Pic */}
            <div className='edit-region photo'>
                <div className='edit-region-image'></div>
            </div>

            <div className='about-row row-1'>
                {/* First Name */}
                <div className='edit-region first-name'>
                    <div className='edit-region-header first-name'>First Name*</div>
                    <input type='text' className='edit-region-input first-name' placeholder={firstName}></input>
                </div>

                {/* Last Name */}
                <div className='edit-region last-name'>
                    <div className='edit-region-header last-name'>Last Name*</div>
                    <input type='text' className='edit-region-input last-name' placeholder={lastName}></input>
                </div>

                {/* Pronouns */}
                <div className='edit-region pronouns'>
                    <div className='edit-region-header pronouns'>Pronouns</div>
                    <input type='text' className='edit-region-input pronouns' placeholder={pronouns.toLowerCase()}></input>
                </div>
            </div>

            <div className='about-row row-2'>
                {/* Role */}
                <div className='edit-region role'>
                    <div className='edit-region-header role'>Role*</div>
                    <select className='edit-region-input role'>
                        <option value='test'>Test...</option>
                    </select>
                </div>

                {/* Major */}
                <div className='edit-region major'>
                    <div className='edit-region-header major'>Major*</div>
                    <select className='edit-region-input major'>
                        <option value='test'>Test...</option>
                    </select>
                </div>

                {/* Year */}
                <div className='edit-region year'>
                    <div className='edit-region-header year'>Year</div>
                    <select className='edit-region-input year'>
                        <option value='first'>1st</option>
                        <option value='second'>2nd</option>
                        <option value='third'>3rd</option>
                        <option value='fourth'>4th</option>
                        <option value='fifth'>5th</option>
                        <option value='sixth'>6th</option>
                        <option value='seventh'>7th</option>
                        <option value='eighth'>8th</option>
                        <option value='nineth'>9th</option>
                        <option value='tenth'>10th</option>
                    </select>
                </div>
            </div>

            {/* Location */}
            <div className='edit-region location'>
                <div className='edit-region-header location'>Location</div>
                <input type='text' className='edit-region-input location' placeholder='Test...'></input>
            </div>
        </div>

        <div className='edit-profile-section-2'>
            {/* Personal Quote */}
            <div className='edit-region quote'>
                <div className='edit-region-header quote'>Personal Quote</div>
                <div className='edit-region-instruct quote'>Write a fun and catchy phrase that captures your unique personality!</div>
                <div className='edit-region-text-area quote'>
                    <textarea className='edit-region-input big quote' maxLength={100} placeholder='Test...'></textarea>
                    <span className='word-limit-label quote'>0 / 100</span>
                </div>
            </div>

            {/* Fun Fact */}
            <div className='edit-region fact'>
                <div className='edit-region-header fact'>Fun Fact</div>
                <div className='edit-region-instruct fact'>Share a fun fact about yourself thata will surprise others!</div>
                <div className='edit-region-text-area fact'>
                    <textarea className='edit-region-input big fact' maxLength={100} placeholder='Test...'></textarea>
                    <span className='word-limit-label fact'>0 / 100</span>
                </div>
            </div>
        </div>

        <div className='edit-profile-section-3'>
            {/* About You */}
            <div className='edit-region quote'>
                <div className='edit-region-header you'>About You</div>
                <div className='edit-region-instruct you'>Share a brief overview of who you are, your interests, and what drives you!</div>
                <div className='edit-region-text-area you'>
                    <textarea className='edit-region-input big you' maxLength={300} placeholder={user.bio}></textarea>
                    <span className='word-limit-label you'>0 / 300</span>
                </div>
            </div>
        </div>
    </div>;

    // "Projects" 
    const page2 = <div className='edit-profile-body projects'>
        <div className='edit-region projects'>
            <div className='edit-region-header projects'>Projects</div>
            <div className='edit-region-instruct projects'>Choose to hide/show projects you've worke on.</div>
            <div className='edit-region-input projects'>
                {
                    user.projects.map((projectID) => {
                        return (<div className='list-project'>
                            <div className='inner-list-project'>
                                {projects[projectID].name}
                            </div>
                        </div>);
                    })
                }
            </div>
        </div>
    </div>

    const [filterSel, setFilterSel] = useState(0);

    let skillsList = [""];
    for (let i = 0; i < softSkills.length; i++) {
        skillsList.push(softSkills[i]);
    }
    for (let i = 0; i < hardSkills.length; i++) {
        skillsList.push(hardSkills[i]);
    }
    for (let i = 0; i < proficiencies.length; i++) {
        skillsList.push(proficiencies[i]);
    }
    skillsList.sort();
    let skillsListText = <div className='skills-list'>
        {
            skillsList.map((skill) => {
                if (skill !== "") {
                    let hasSkill = false;
                    for (let i = 0; i < user.skills.length; i++) {
                        if (user.skills[i].skill == skill) {
                            hasSkill = true;
                        }
                    }

                    if (!hasSkill) {
                        if (filterSel === 0) {
                            let skillClass = 'skill-item list';
                            if (softSkills.indexOf(skill) != -1) {
                                skillClass += ' soft';
                            }
                            else if (hardSkills.indexOf(skill) != -1) {
                                skillClass += ' hard';
                            }
                            else if (proficiencies.indexOf(skill) != -1) {
                                skillClass += ' prof';
                            }
                            return <button className={skillClass} onClick={() => {}}>#{skill.toLowerCase().replaceAll(" ", "")}</button>;
                        }
                        else if (filterSel === 1 && hardSkills.indexOf(skill) != -1) {
                            return <button className='skill-item list hard' onClick={() => {}}>#{skill.toLowerCase().replaceAll(" ", "")}</button>;
                        }
                        else if (filterSel === 2 && proficiencies.indexOf(skill) != -1) {
                            return <button className='skill-item list prof' onClick={() => {}}>#{skill.toLowerCase().replaceAll(" ", "")}</button>;
                        }
                        else if (filterSel === 3 && softSkills.indexOf(skill) != -1) {
                            return <button className='skill-item list soft' onClick={() => {}}>#{skill.toLowerCase().replaceAll(" ", "")}</button>;
                        }
                    }
                }
            })
        }
    </div>;

    let chosenSkills = <div className='chosen-skills'>
        {
            user.skills.map((skillItem) => {
                if (skillItem.skill != "") {
                    let chosenClass = "skill-item chosen";
                    chosenClass += (skillItem.type == "softSkill" ? " soft" : skillItem.type == "hardSkill" ? " hard" : skillItem.type == "proficiency" ? " prof" : "");
                    return <button className={chosenClass} onClick={() => {}}>#{skillItem.skill.toLowerCase().replaceAll(" ", "")}</button>;
                }
            })
        }
    </div>

    // "Skills" 
    const page3 = <div className='edit-profile-body skills'>
        <div className='edit-profile-skills-section'>
            {/* Skills selecting area */}
            <div className='skills-list-region'>
                <div className='skills-list-search'>
                    <i className='fa-solid fa-magnifying-glass'></i>
                    <input type='searchbar' className='skills-searchbar' placeholder='Search'></input>
                </div>

                <div className='skills-list-header'>
                    <button className='skills-list-button all' id={filterSel === 0 ? "selected" : ""} onClick={() => setFilterSel(0)}>All</button>
                    <button className='skills-list-button dev' id={filterSel === 1 ? "selected" : ""} onClick={() => setFilterSel(1)}>Developer Skills</button>
                    <button className='skills-list-button des' id={filterSel === 2 ? "selected" : ""} onClick={() => setFilterSel(2)}>Designer Skills</button>
                    <button className='skills-list-button soft' id={filterSel === 3 ? "selected" : ""} onClick={() => setFilterSel(3)}>Soft Skills</button>
                </div>

                <hr />

                {skillsListText}
            </div>

            {/* Selected skills area */}
            <div className='skills-selected-region'>
                <div className='edit-region skills'>
                    <div className='edit-region-header skills'>Selected</div>
                    <div className='edit-region-instruct skills'>Click to deselect</div>
                    <div className='edit-region-input skills'>{chosenSkills}</div>
                </div>
            </div>
        </div>
    </div>;

    const [page, setPage] = useState(1);

    let displayedPage = <></>;
    if (page === 1) {
        displayedPage = page1;
    }
    else if (page === 2) {
        displayedPage = page2;
    }
    else if (page === 3) {
        displayedPage = page3;
    }

    let button1 = <button className='profile-discover-button' onClick={() => setPage(1)}>About</button>;
    if (page === 1) {
        button1 = <button className='profile-discover-button' id="selected" onClick={() => setPage(1)}>About</button>;
    }
    let button2 = <button className='profile-discover-button' onClick={() => setPage(2)}>Projects</button>;
    if (page === 2) {
        button2 = <button className='profile-discover-button' id="selected" onClick={() => setPage(2)}>Projects</button>;
    }
    let button3 = <button className='profile-discover-button' onClick={() => setPage(3)}>Skills</button>;
    if (page === 3) {
        button3 = <button className='profile-discover-button' id="selected" onClick={() => setPage(3)}>Skills</button>;
    }

    return (
        <div id='profile-edit-button-section'>
            <button className='profile-edit-button' onClick={() => openClosePopup(showPopup, setShowPopup)}>Edit Profile</button>
            {/* <PopupButton buttonId={"profile-edit-button"} callback={() => setShowPopup}>Edit Profile</PopupButton> */}

            {/* The "Edit Profile" popup */}
            <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup}>
                <div id='edit-profile-modal'>
                    <div id='edit-profile-header'>
                        {button1}
                        {button2}
                        {button3}
                    </div>

                    <div id='edit-profile-content'>
                        {displayedPage}
                    </div>

                    <div id='edit-profile-save'>
                        {/* Save button */}
                        <button className='edit-region-save-button' onClick={() => {}}>Save Changes</button>
                    </div>
                </div>
            </PagePopup>
            {/* <Popup children={content}></Popup> */}
        </div>
    );
};

export default EditButton;