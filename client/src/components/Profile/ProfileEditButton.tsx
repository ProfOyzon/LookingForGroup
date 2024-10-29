import React, { useState, useEffect } from 'react';
import { PagePopup, openClosePopup } from "../PagePopup";
// import { Popup, PopupContent, PopupButton } from "../Popup";
import { softSkills } from "../../constants/skills";
import { hardSkills } from "../../constants/skills";
import { proficiencies } from "../../constants/skills";
import { projects } from "../../constants/fakeData";
import { roles } from "../../constants/roles";
import { majors } from "../../constants/majors";

// On click, this button should open the Profile Edit modal 
const EditButton = ({user}) => {
    // console.log(user);
    const [showPopup, setShowPopup] = useState(false);

    // "About" 
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

    const [currentFirstName, setCurrentFirstName] = useState(firstName);
    const [currentLastName, setCurrentLastName] = useState(lastName);
    const [currentPronouns, setCurrentPronouns] = useState(pronouns.toLowerCase());
    const [currentRole, setCurrentRole] = useState("");
    const [currentMajor, setCurrentMajor] = useState("");
    const [currentYear, setCurrentYear] = useState("blank");
    const [currentLocation, setCurrentLocation] = useState("");
    const [currentQuote, setCurrentQuote] = useState("");
    const [currentFunFact, setCurrentFunFact] = useState("");
    const [currentAbout, setCurrentAbout] = useState(user.bio);

    const page1 = <div className='edit-profile-body about'>
        <div className='edit-profile-section-1'>
            {/* Profile Pic */}
            <div className='edit-region photo'>
                <div className='edit-region-image photo'>
                    <div className='edit-region-button-div photo'>
                        <button className='edit-region-button photo'><i className='fa-solid fa-camera'></i></button>
                    </div>
                </div>
            </div>

            <div className='about-row row-1'>
                {/* First Name */}
                <div className='edit-region first-name'>
                    <div className='edit-region-header first-name'>First Name*</div>
                    <input type='text' className='edit-region-input first-name'
                        value={currentFirstName} onChange={(e) => {setCurrentFirstName(e.target.value)}}></input>
                </div>

                {/* Last Name */}
                <div className='edit-region last-name'>
                    <div className='edit-region-header last-name'>Last Name*</div>
                    <input type='text' className='edit-region-input last-name'
                        value={currentLastName} onChange={(e) => {setCurrentLastName(e.target.value)}}></input>
                </div>

                {/* Pronouns */}
                <div className='edit-region pronouns'>
                    <div className='edit-region-header pronouns'>Pronouns</div>
                    <input type='text' className='edit-region-input pronouns'
                        value={currentPronouns} onChange={(e) => {setCurrentPronouns(e.target.value)}}></input>
                </div>
            </div>

            <div className='about-row row-2'>
                {/* Role */}
                <div className='edit-region role'>
                    <div className='edit-region-header role'>Role*</div>
                    <select className='edit-region-input role' value={currentRole} onChange={(e) => {setCurrentRole(e.target.value)}}>
                        <option value="none" disabled>Select</option>
                        {
                            roles.map((role) => {
                                return <option value={role.toLowerCase()}>{role}</option>
                            })
                        }
                    </select>
                </div>

                {/* Major */}
                <div className='edit-region major'>
                    <div className='edit-region-header major'>Major*</div>
                    <select className='edit-region-input major' value={currentMajor} onChange={(e) => {setCurrentMajor(e.target.value)}}>
                        <option value="none" disabled>Select</option>
                        {
                            majors.map((major) => {
                                return <option value={major.toLowerCase()}>{major}</option>
                            })
                        }
                    </select>
                </div>

                {/* Year */}
                <div className='edit-region year'>
                    <div className='edit-region-header year'>Year</div>
                    <select className='edit-region-input year' value={currentYear} onChange={(e) => {setCurrentYear(e.target.value)}}>
                        <option value="blank"></option>
                        <option value='1'>1st</option>
                        <option value='2'>2nd</option>
                        <option value='3'>3rd</option>
                        <option value='4'>4th</option>
                        <option value='5'>5th</option>
                        <option value='6'>6th</option>
                        <option value='7'>7th</option>
                        <option value='8'>8th</option>
                        <option value='9'>9th</option>
                        <option value='10'>10th</option>
                    </select>
                </div>
            </div>

            {/* Location */}
            <div className='edit-region location'>
                <div className='edit-region-header location'>Location</div>
                <input type='text' className='edit-region-input location'
                    value={currentLocation} onChange={(e) => {setCurrentLocation(e.target.value)}}></input>
            </div>
        </div>

        <div className='edit-profile-section-2'>
            {/* Personal Quote */}
            <div className='edit-region quote'>
                <div className='edit-region-header quote'>Personal Quote</div>
                <div className='edit-region-instruct quote'>Write a fun and catchy phrase that captures your unique personality!</div>
                <div className='edit-region-text-area quote'>
                    <textarea className='edit-region-input big quote' maxLength={100}
                        value={currentQuote.substring(0, 100)} onChange={(e) => {setCurrentQuote(e.target.value)}}></textarea>
                    <span className='word-limit-label quote'>{currentQuote.length} / 100</span>
                </div>
            </div>

            {/* Fun Fact */}
            <div className='edit-region fact'>
                <div className='edit-region-header fact'>Fun Fact</div>
                <div className='edit-region-instruct fact'>Share a fun fact about yourself thata will surprise others!</div>
                <div className='edit-region-text-area fact'>
                    <textarea className='edit-region-input big fact' maxLength={100}
                        value={currentFunFact.substring(0, 100)} onChange={(e) => {setCurrentFunFact(e.target.value)}}></textarea>
                    <span className='word-limit-label fact'>{currentFunFact.length} / 100</span>
                </div>
            </div>
        </div>

        <div className='edit-profile-section-3'>
            {/* About You */}
            <div className='edit-region quote'>
                <div className='edit-region-header you'>About You</div>
                <div className='edit-region-instruct you'>Share a brief overview of who you are, your interests, and what drives you!</div>
                <div className='edit-region-text-area you'>
                    <textarea className='edit-region-input big you' maxLength={600}
                        value={currentAbout.substring(0, 600)} onChange={(e) => {setCurrentAbout(e.target.value)}}></textarea>
                    <span className='word-limit-label you'>{currentAbout.length} / 600</span>
                </div>
            </div>
        </div>
    </div>;

    // "Projects" 
    const [currentHidden, setCurrentHidden] = useState([false, false, false]);

    const updateHiddenProjects = (index) => {
        let tempList = [currentHidden[0]];
        for (let i = 1; i < currentHidden.length; i++) {
            tempList.push(currentHidden[i]);
        }

        tempList[index] = !tempList[index];
        setCurrentHidden(tempList);
    };

    const page2 = <div className='edit-profile-body projects'>
        <div className='edit-region projects'>
            <div className='edit-region-header projects'>Projects</div>
            <div className='edit-region-instruct projects'>Choose to hide/show projects you've worke on.</div>
            <div className='edit-region-input projects'>
                {
                    user.projects.map((projectID, index) => {
                        return (<div className='list-project'>
                            <div className='inner-list-project'>
                                {projects[projectID].name}
                            </div>
                            <div className='list-project-hide-icon'>
                                <button className='list-project-hide-icon-button' onClick={(e) => {updateHiddenProjects(index)}}>
                                    {
                                        currentHidden[index] ? <i className='fa-solid fa-eye-slash'></i> : <i className='fa-solid fa-eye'></i>
                                    }
                                </button>
                            </div>
                        </div>);
                    })
                }
            </div>
        </div>
    </div>

    // "Skills" 
    const [currentSkills, setCurrentSkills] = useState(user.skills);
    // const [orderedSkills, setOrderedSkills] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    const addToSkillsList = (newSkill) => {
        let found = false;
        for (let i = 0; i < currentSkills.length; i++) {
            if (currentSkills[i].type == newSkill.type && currentSkills[i].skill == newSkill.skill) {
                found = true;
            }
        }

        if (!found) {
            // let tempList = {type: String, skill: String}[0];
            let tempList = [];
            for (let i = 0; i < currentSkills.length; i++) {
                tempList.push(currentSkills[i]);
            }
            tempList.push(newSkill);
            setCurrentSkills(tempList);
        }
    };

    const removeFromSkillsList = (index) => {
        let tempList = [];
        for (let i = 0; i < currentSkills.length; i++) {
            if (i != index) {
                tempList.push(currentSkills[i]);
            }
        }
        setCurrentSkills(tempList);
    };

    // const becomeDraggable = (element, canDrag) => {
    //     element.id = canDrag ? "draggable" : "";
    // };

    let displayedSkillsList = <div className='chosen-skills-list'>
        {
            currentSkills.map((skillItem, index) => {
                if (skillItem.skill != "") {
                    let chosenClass = "skill-item chosen";
                    // chosenClass += (skillItem.type == "softSkill" ? " soft" : skillItem.type == "hardSkill" ? " hard" : skillItem.type == "proficiency" ? " prof" : "");
                    chosenClass += ` ${skillItem.type.substring(0, 4)}`;
                    let chosenName = skillItem.skill;
                    return (
                        <div className='chosen-item'>
                            ≡
                            <span className={chosenClass}>
                                <button className='chosen-button' onClick={(e) => {removeFromSkillsList(index)}}>X</button>
                                {chosenName}
                            </span>
                        </div>
                    );
                }
            })
        }
    </div>

    const [currentSearch, setCurrentSearch] = useState("");
    
    const [filterSel, setFilterSel] = useState(0);
    // 0 -> Developer Skills -> Hard Skills 
    // 1 -> Designer Skills -> Proficiencies 
    // 2 -> Soft Skills -> Soft Skills 
    const changeFilter = (val) => {
        if (currentSearch === "") {
            setFilterSel(val);
        }
    }

    let filterButton1 = <button className='skills-filter-button' id={filterSel === 0 ? "selected" : ""} onClick={() => changeFilter(0)}>Developer Skills</button>;
    let filterButton2 = <button className='skills-filter-button' id={filterSel === 1 ? "selected" : ""} onClick={() => changeFilter(1)}>Designer Skills</button>;
    let filterButton3 = <button className='skills-filter-button' id={filterSel === 2 ? "selected" : ""} onClick={() => changeFilter(2)}>Soft Skills</button>;

    let filteredSkillsList = <div className='skills-list'></div>;
    if (currentSearch !== "") {
        let tempList = [hardSkills[0]];
        for (let i = 1; i < hardSkills.length; i++) {
            tempList.push(hardSkills[i]);
        }
        for (let i = 0; i < proficiencies.length; i++) {
            tempList.push(proficiencies[i]);
        }
        for (let i = 0; i < softSkills.length; i++) {
            tempList.push(softSkills[i]);
        }
        tempList.sort();

        filteredSkillsList = <div className='skills-list'>{
            tempList.map((skill) => {
                if (skill.substring(0, currentSearch.length).toLowerCase() == currentSearch.toLowerCase()) {
                    let skillType = "";
                    if (hardSkills.indexOf(skill) != -1) {
                        skillType = "hardSkill";
                    }
                    if (proficiencies.indexOf(skill) != -1) {
                        skillType = "proficiency";
                    }
                    if (softSkills.indexOf(skill) != -1) {
                        skillType = "softSkill";
                    }

                    let skillClass = `skill-item-button ${skillType.substring(0, 4)}`;
                    let found = false;
                    for (let i = 0; i < currentSkills.length; i++) {
                        if (currentSkills[i].skill == skill) {
                            found = true;
                        }
                    }
                    if (found) {
                        skillClass += " chosen";
                    }

                    return <button className={skillClass} onClick={(e) => {addToSkillsList({type: skillType, skill: skill})}}>
                        {found ? "✓" : "+"}&nbsp;&nbsp;&nbsp;{skill}
                    </button>;
                }
            })
        }</div>;
    }
    else if (filterSel === 0) {
        let tempList = [hardSkills[0]];
        for (let i = 1; i < hardSkills.length; i++) {
            tempList.push(hardSkills[i]);
        }
        tempList.sort();

        filteredSkillsList = <div className='skills-list'>{
            tempList.map((skill) => {
                let skillClass = "skill-item-button hard";
                let found = false;
                for (let i = 0; i < currentSkills.length; i++) {
                    if (currentSkills[i].skill == skill) {
                        found = true;
                    }
                }
                if (found) {
                    skillClass += " chosen";
                }

                return <button className={skillClass} onClick={(e) => {addToSkillsList({type: "hardSkill", skill: skill})}}>
                    {found ? "✓" : "+"}&nbsp;&nbsp;&nbsp;{skill}
                </button>;
            })
        }</div>;
    }
    else if (filterSel === 1) {
        let tempList = [proficiencies[0]];
        for (let i = 1; i < proficiencies.length; i++) {
            tempList.push(proficiencies[i]);
        }
        tempList.sort();

        filteredSkillsList = <div className='skills-list'>{
            tempList.map((skill) => {
                let skillClass = "skill-item-button prof";
                let found = false;
                for (let i = 0; i < currentSkills.length; i++) {
                    if (currentSkills[i].skill == skill) {
                        found = true;
                    }
                }
                if (found) {
                    skillClass += " chosen";
                }

                return <button className={skillClass} onClick={(e) => {addToSkillsList({type: "proficiency", skill: skill})}}>
                    {found ? "✓" : "+"}&nbsp;&nbsp;&nbsp;{skill}
                </button>;
            })
        }</div>;
    }
    else if (filterSel === 2) {
        let tempList = [softSkills[0]];
        for (let i = 1; i < softSkills.length; i++) {
            tempList.push(softSkills[i]);
        }
        tempList.sort();

        filteredSkillsList = <div className='skills-list'>{
            tempList.map((skill) => {
                let skillClass = "skill-item-button soft";
                let found = false;
                for (let i = 0; i < currentSkills.length; i++) {
                    if (currentSkills[i].skill == skill) {
                        found = true;
                    }
                }
                if (found) {
                    skillClass += " chosen";
                }

                return <button className={skillClass} onClick={(e) => {addToSkillsList({type: "softSkill", skill: skill})}}>
                    {found ? "✓" : "+"}&nbsp;&nbsp;&nbsp;{skill}
                </button>;
            })
        }</div>;
    }

    const page3 = <div className='edit-profile-body skills'>
        <div className='edit-profile-skills-section'>
            {/* Current skills area */}
            <div className='selected-skills-region'>
                <div className='edit-region-header skills'>Selected</div>
                <div className='edit-region-instruct skills'>Drag and drop to reorder</div>
                {displayedSkillsList}
            </div>

            {/* All skills area */}
            <div className='skills-list-region'>
                {/* Search Bar */}
                <div className='skills-search'>
                    <i className='fa-solid fa-magnifying-glass'></i>
                    <input type='text' className='skill-searchbar'
                        value={currentSearch} onChange={(e) => {setCurrentSearch(e.target.value)}} placeholder='Search'></input>
                </div>

                {/* Filter Tabs */}
                <div className='skills-header'>
                    {filterButton1}
                    {filterButton2}
                    {filterButton3}
                </div>

                {/* Skills List */}
                {filteredSkillsList}
            </div>
        </div>
    </div>;

    // "Links" 
    const [currentLinks, setCurrentLinks] = useState(user.links);
    const [currentLinksCount, setCurrentLinksCount] = useState(user.links.length);

    const getLinksDropDown = (currentType, index) => {
        let dropDownList = <select className='link-options-list' value={currentType} onChange={(e) => {updateType(index, e.target.value)}}>
            <option value="Select" disabled>Select</option>
            <option value="instagram">&#xf16d; &nbsp;&nbsp; Instagram</option>
            <option value="twitter">&#xe61b; &nbsp;&nbsp; X</option>
            <option value="facebook">&#xf39e; &nbsp;&nbsp;&nbsp; Facebook</option>
            <option value="discord">&#xf392; &nbsp; Discord</option>
            <option value="bluesky">&#xe671; &nbsp; Bluesky</option>
            <option value="linkedin">&#xf08c; &nbsp;&nbsp; LinkedIn</option>
            <option value="youtube">&#xf167; &nbsp;&nbsp; YouTube</option>
            <option value="steam">&#xf1b6; &nbsp;&nbsp; Steam</option>
            <option value="itch.io">&#xf83a; &nbsp;&nbsp; Itch.io</option>
            <option value="other">&#xf0c1; &nbsp;&nbsp; Other</option>
        </select>;

        return dropDownList;
    };

    const addLinkToList = (newLink = {text: String, url: String}) => {
        let tempList = [];
        for (let i = 0; i < currentLinks.length; i++) {
            tempList.push(currentLinks[i]);
        }
        tempList.push(newLink);
        setCurrentLinks(tempList);
    };

    const removeLinkFromList = (theLink = {text: String, url: String}) => {
        let tempList = [];
        for (let i = 0; i < currentLinks.length; i++) {
            if (!(currentLinks[i].text == theLink.text && currentLinks[i].url == theLink.url)) {
                tempList.push(currentLinks[i]);
            }
        }
        setCurrentLinks(tempList);
    };

    const addNewLink = () => {
        setCurrentLinksCount(currentLinksCount + 1);
        addLinkToList({text: '', url: ''});
    };

    const removeLink = (index) => {
        setCurrentLinksCount(currentLinksCount - 1);
        removeLinkFromList(currentLinks[index]);
    };

    const updateType = (index, newType) => {
        let tempList = [index == 0 ? {text: newType, url: currentLinks[0].url} : currentLinks[0]];
        for (let i = 1; i < currentLinks.length; i++) {
            tempList.push(index == i ? {text: newType, url: currentLinks[i].url} : currentLinks[i]);
        }
        setCurrentLinks(tempList);
    };

    const updateURL = (index, newURL) => {
        let tempList = [index == 0 ? {text: currentLinks[0].text, url: newURL} : currentLinks[0]];
        for (let i = 1; i < currentLinks.length; i++) {
            tempList.push(index == 0 ? {text: currentLinks[i].text, url: newURL} : currentLinks[i]);
        }
        setCurrentLinks(tempList);
    };

    let linksList = [];
    for (let i = 0; i < currentLinksCount; i++) {
        let tempLink;
        if (i >= currentLinks.length || currentLinks.length == 0) {
            tempLink = <div className='edit-region-link-item'>
                {getLinksDropDown("", i)}
                <div className='edit-region-input links'>
                    <input type='text' className='edit-region-input-text'
                        placeholder='URL' onChange={(e) => {updateURL(i, e.target.value)}}></input>
                    <button className='remove-button' onClick={(e) => {removeLink(i)}}>—</button>
                </div>
            </div>;
        }
        else {
            tempLink = <div className='edit-region-link-item'>
                {getLinksDropDown(currentLinks[i].text, i)}
                <div className='edit-region-input links'>
                    <input type='text' className='edit-region-input-text'
                        value={currentLinks[i].url} onChange={(e) => {updateURL(i, e.target.value)}}></input>
                    <button className='remove-button' onClick={(e) => {removeLink(i)}}>—</button>
                </div>
            </div>;
        }
        linksList.push(tempLink);
    }

    const page4 = <div className='edit-profile-body links'>
        <div className='edit-profile-section'>
            <div className='edit-region links'>
                <div className='edit-region-header links'>Social Links</div>
                <div className='edit-region-instruct links'>Provide the links to pages you wish to include on your page.</div>
                <div className='edit-region-links-list'>
                    {linksList}
                    <div className='edit-region-button-section links'>
                        <button className='edit-region-button links' onClick={(e) => {addNewLink()}}>+ <em>Add social profile</em></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    // Overall page 
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
    else if (page === 4) {
        displayedPage = page4;
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
    let button4 = <button className='profile-discover-button' onClick={() => setPage(4)}>Links</button>;
    if (page === 4) {
        button4 = <button className='profile-discover-button' id="selected" onClick={() => setPage(4)}>Links</button>;
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
                        {button4}
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