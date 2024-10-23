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
    // console.log(projects);
    const [showPopup, setShowPopup] = useState(false);

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

    // "Discovery Card" 
    const page1 = <div className='edit-profile-body discover'>
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
                <input type='text' className='edit-region-input name' placeholder={user.name}></input>
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
                <input type='text' className='edit-region-input pronouns' placeholder={pronouns}></input>
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
                    {
                        user.projects.map((projectID) => {
                            return <option value={projectID}>{projects[projectID].name}</option>
                        })
                    }
                </select>;
            </div>

            {/* Fun fact */}
            <div className='edit-region funfact'>
                <div className='edit-region-header funfact'>Fun Fact <i className='fa-solid fa-star'></i></div>
                <div className='edit-region-instruct funfact'>What's a short fun fact about you?</div>
                <textarea className='edit-region-input funfact' placeholder='TEST...'></textarea>
            </div>
        </div>
    </div>;

    // "About & Projects" 
    const page2 = <div className='edit-profile-body about'>
        <div className='edit-profile-about-section'>
            {/* About you */}
            <div className='edit-region about'>
                <div className='edit-region-header about'>About You</div>
                <div className='edit-region-instruct about'>Give yourself a more detailed bio than your headline.</div>
                <textarea className='edit-region-input wide about' placeholder={user.bio}></textarea>
            </div>

            {/* Looking for */}
            {/* <div className='edit-region looking'>
                <div className='edit-region-header looking'>Looking For</div>
                <div className='edit-region-instruct looking'>Describe your project/work/group preferences here.</div>
                <textarea className='edit-region-input wide looking' placeholder='TEST...'></textarea>
            </div> */}

            {/* Projects */}
            <div className='edit-region projects'>
                <div className='edit-region-header projects'>Projects</div>
                <div className='edit-region-instruct projects'>Choose to hide/show projects you've worked on.<br />Drag and drop images to change order.</div>
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
    </div>;

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

            {/* Skills */}
            <div className='edit-region skills'>
                <div className='edit-region-header skills'>Skills</div>
                <div className='edit-region-instruct skills'>Click to unselect</div>
                <div className='edit-region-input skills'>{chosenSkills}</div>
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

    let button1 = <button className='profile-discover-button' onClick={() => setPage(1)}>Discover Card</button>;
    if (page === 1) {
        button1 = <button className='profile-discover-button' id="selected" onClick={() => setPage(1)}>Discover Card</button>;
    }
    let button2 = <button className='profile-discover-button' onClick={() => setPage(2)}>About & Projects</button>;
    if (page === 2) {
        button2 = <button className='profile-discover-button' id="selected" onClick={() => setPage(2)}>About & Projects</button>;
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