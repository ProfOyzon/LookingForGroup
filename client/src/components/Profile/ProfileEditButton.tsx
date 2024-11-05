import React, { useState, useEffect } from 'react';
import { PagePopup, openClosePopup } from "../PagePopup";
// import { Popup, PopupContent, PopupButton } from "../Popup";
import { softSkills } from "../../constants/skills";
import { hardSkills } from "../../constants/skills";
import { proficiencies } from "../../constants/skills";
import { projects } from "../../constants/fakeData";
import { roles } from "../../constants/roles";
import { majors } from "../../constants/majors";

/* TO DO:
 - Pull in projects data from the server 
 - Add in code to save the data to the server 
 - Display the profile pic 
*/

// On click, this button should open the Profile Edit modal 
const EditButton = ({userData}) => {
    // console.log(userData);

    const [showPopup, setShowPopup] = useState(false);

    // "About" 
    const [rolesList, setRolesList] = useState();
    const [majorsList, setMajorsList] = useState();

    const getJobTitles = async () => {
        const url = 'http://localhost:8081/api/datasets/job-titles';

        try {
            let response = await fetch(url);

            const rawData = await response.json();
            setRolesList(rawData.data);
        }
        catch (error) {
            console.log(error);
        }
    };

    const getMajors = async () => {
        const url = 'http://localhost:8081/api/datasets/majors';

        try {
            let response = await fetch(url);

            const rawData = await response.json();
            setMajorsList(rawData.data);
        }
        catch (error) {
            console.log(error);
        }
    };

    if (rolesList === undefined) {
        getJobTitles();
    }
    if (majorsList === undefined) {
        getMajors();
    }

    const [currentFirstName, setCurrentFirstName] = useState(userData.first_name);
    const [currentLastName, setCurrentLastName] = useState(userData.last_name);
    const [currentPronouns, setCurrentPronouns] = useState(userData.pronouns);
    const [currentRole, setCurrentRole] = useState(userData.job_title);
    const [currentMajor, setCurrentMajor] = useState(userData.major);
    const [currentYear, setCurrentYear] = useState(userData.academic_year);
    const [currentLocation, setCurrentLocation] = useState(userData.location);
    const [currentQuote, setCurrentQuote] = useState(userData.headline);
    const [currentFunFact, setCurrentFunFact] = useState(userData.fun_fact);
    const [currentAbout, setCurrentAbout] = useState(userData.bio);

    const getOrdinal = (index: number) => {
        if (index === 1) {
            return "1st";
        }
        if (index === 2) {
            return "2nd";
        }
        if (index === 3) {
            return "3rd";
        }
        return `${index}th`;
    };

    let yearOptions = [<option value="blank"></option>];
    for (let i = 0; i < 10; i++) { // The "10" can be replaced with any value we choose to use as the maximum number of years 
        yearOptions.push(<option value={getOrdinal(i + 1)}>{getOrdinal(i + 1)}</option>);
    }

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
                            rolesList === undefined ? "" : rolesList.map((roleItem) => {
                                return <option value={roleItem.label}>{roleItem.label}</option>
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
                            majorsList === undefined ? "" : majorsList.map((majorItem) => {
                                return <option value={majorItem.label}>{majorItem.label}</option>
                            })
                        }
                    </select>
                </div>

                {/* Year */}
                <div className='edit-region year'>
                    <div className='edit-region-header year'>Year</div>
                    <select className='edit-region-input year' value={currentYear} onChange={(e) => {setCurrentYear(e.target.value)}}>
                        {yearOptions}
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
            <div className='edit-region you'>
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

    const updateHiddenProjects = (index: number) => {
        let tempList = new Array(0);
        for (let i = 0; i < currentHidden.length; i++) {
            tempList.push(currentHidden[i]);
        }

        tempList[index] = !tempList[index];
        setCurrentHidden(tempList);
    };

    const page2 = <div className='edit-profile-body projects'>
        <div className='edit-region projects'>
            <div className='edit-region-header projects'>Projects</div>
            <div className='edit-region-instruct projects'>Choose to hide/show projects you've worked on.</div>
            <div className='edit-region-input projects'>
                {
                    // userData.projects.map((projectID: number, index: number) => {
                    //     return (<div className='list-project'>
                    //         <div className='inner-list-project'>
                    //             {projects[projectID].name}
                    //         </div>
                    //         <div className='list-project-hide-icon'>
                    //             <button className='list-project-hide-icon-button' onClick={(e) => {updateHiddenProjects(index)}}>
                    //                 {
                    //                     currentHidden[index] ? <i className='fa-solid fa-eye-slash'></i> : <i className='fa-solid fa-eye'></i>
                    //                 }
                    //             </button>
                    //         </div>
                    //     </div>);
                    // })
                }
            </div>
        </div>
    </div>

    // "Skills" 
    const [currentSkills, setCurrentSkills] = useState(userData.skills.toSorted((a, b) => a.position - b.position));
    // const [orderedSkills, setOrderedSkills] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    const addToSkillsList = (newSkill) => {
        let found = false;
        for (let i = 0; i < currentSkills.length; i++) {
            if (currentSkills[i].type == newSkill.type && currentSkills[i].skill == newSkill.skill) {
                found = true;
            }
        }

        if (!found) {
            let tempList = new Array(0);
            for (let i = 0; i < currentSkills.length; i++) {
                tempList.push(currentSkills[i]);
            }
            tempList.push(newSkill);
            tempList.sort((a, b) => a.position - b.position);
            setCurrentSkills(tempList);
        }
    };

    const removeFromSkillsList = (index: number) => {
        let tempList = new Array(0);
        for (let i = 0; i < currentSkills.length; i++) {
            if (i != index) {
                tempList.push(currentSkills[i]);
            }
        }
        tempList.sort((a, b) => a.position - b.position);
        setCurrentSkills(tempList);
    };

    // const becomeDraggable = (element, canDrag) => {
    //     element.id = canDrag ? "draggable" : "";
    // };

    // console.log(currentSkills);
    let displayedSkillsList = <div className='chosen-skills-list'>
        {
            currentSkills.map((skillItem, index: number) => {
                if (skillItem.skill != "") {
                    let chosenClass = "skill-item chosen";
                    chosenClass += ` ${skillItem.type.toLowerCase().substring(0, 4)}`;
                    return (
                        <div className='chosen-item'>
                            ≡
                            <span className={chosenClass}>
                                <button className='chosen-button' onClick={(e) => {removeFromSkillsList(index)}}>X</button>
                                {skillItem.skill}
                            </span>
                        </div>
                    );
                }
            })
        }
    </div>

    const [currentSearch, setCurrentSearch] = useState("");
    const [skillsList, setSkillsList] = useState();

    const getSkillsList = async (type: String) => {
        if (type.toLowerCase() === "developer" || type.toLowerCase() === "designer" || type.toLowerCase() === "soft") {
            const url = `http://localhost:8081/api/datasets/skills?type=${type.toLowerCase()}`;
            try {
                let response = await fetch(url);

                const rawData = await response.json();
                // console.log(rawData.data);
                setSkillsList(rawData.data.toSorted((a, b) => {
                    if (a.label.toLowerCase() < b.label.toLowerCase()) {
                        return -1;
                    }
                    if (a.label.toLowerCase() > b.label.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                }));
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            const url = `http://localhost:8081/api/datasets/skills`;
            try {
                let response = await fetch(url);

                const rawData = await response.json();
                setSkillsList(rawData.data);
            }
            catch (error) {
                console.log(error);
            }
        }
    };

    if (skillsList === undefined) {
        getSkillsList("developer");
    }
    
    const [filterSel, setFilterSel] = useState(0);
    // 0 -> Developer Skills -> Hard Skills 
    // 1 -> Designer Skills -> Proficiencies 
    // 2 -> Soft Skills -> Soft Skills 
    const changeFilter = (val: number) => {
        if (currentSearch === "") {
            setFilterSel(val);
            switch (val) {
                case 0:
                    getSkillsList("developer");
                    break;
                
                case 1:
                    getSkillsList("designer");
                    break;
                
                case 2:
                    getSkillsList("soft");
                    break;
            }
        }
    }

    let filterButton1 = <button className='skills-filter-button' id={filterSel === 0 ? "selected" : ""} onClick={() => changeFilter(0)}>Developer Skills</button>;
    let filterButton2 = <button className='skills-filter-button' id={filterSel === 1 ? "selected" : ""} onClick={() => changeFilter(1)}>Designer Skills</button>;
    let filterButton3 = <button className='skills-filter-button' id={filterSel === 2 ? "selected" : ""} onClick={() => changeFilter(2)}>Soft Skills</button>;

    let filteredSkillsListDisplay = <div className='skills-list'></div>;
    if (currentSearch !== "") {
        filteredSkillsListDisplay = <div className='skills-list'>{
            skillsList === undefined ? "" : skillsList.map((skillItem) => {
                if (skillItem.label.substring(0, currentSearch.length).toLowerCase() == currentSearch.toLowerCase()) {
                    let skillClass = `skill-item-button ${skillItem.type.toLowerCase().substring(0, 4)}`;
                    let found = false;
                    for (let i = 0; i < currentSkills.length; i++) {
                        if (currentSkills[i].skill == skillItem.label) {
                            found = true;
                        }
                    }
                    if (found) {
                        skillClass += " chosen";
                    }

                    return <button className={skillClass} onClick={(e) => {
                        addToSkillsList({id: skillItem.skill_id, type: skillItem.type, skill: skillItem.label, position: currentSkills.length})
                    }}>
                        {found ? "✓" : "+"}&nbsp;&nbsp;&nbsp;{skillItem.label}
                    </button>;
                }
            })
        }</div>;
    }
    else {
        filteredSkillsListDisplay = <div className='skills-list'>{
            skillsList === undefined ? "" : skillsList.map((skillItem) => {
                let skillClass = `skill-item-button ${skillItem.type.toLowerCase().substring(0, 4)}`;
                let found = false;
                for (let i = 0; i < currentSkills.length; i++) {
                    if (currentSkills[i].skill == skillItem.label) {
                        found = true;
                    }
                }
                if (found) {
                    skillClass += " chosen";
                }

                return <button className={skillClass} onClick={(e) => {
                    addToSkillsList({id: skillItem.skill_id, type: skillItem.type, skill: skillItem.label, position: currentSkills.length})
                }}>
                    {found ? "✓" : "+"}&nbsp;&nbsp;&nbsp;{skillItem.label}
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
                {filteredSkillsListDisplay}
            </div>
        </div>
    </div>;

    // "Links" 
    const [currentLinks, setCurrentLinks] = useState(userData.links);

    const getLinksDropDown = (currentType: string, index: number) => {
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

    const addLinkToList = (newLink: { text: string, url: string }) => {
        let tempList = new Array(0);
        for (let i = 0; i < currentLinks.length; i++) {
            tempList.push(currentLinks[i]);
        }
        tempList.push(newLink);
        setCurrentLinks(tempList);
    };

    const addNewLink = () => {
        addLinkToList({text: 'instagram', url: ''});
    };

    const removeLink = (index: number) => {
        let tempList = new Array(0);
        for (let i = 0; i < currentLinks.length; i++) {
            if (i != index) {
                tempList.push(currentLinks[i]);
            }
        }
        setCurrentLinks(tempList);
    };

    const updateType = (index: number, newType: string) => {
        let tempList = [index == 0 ? {text: newType, url: currentLinks[0].url} : currentLinks[0]];
        for (let i = 1; i < currentLinks.length; i++) {
            tempList.push(index == i ? {text: newType, url: currentLinks[i].url} : currentLinks[i]);
        }
        setCurrentLinks(tempList);
    };

    const updateURL = (index: number, newURL: string) => {
        let tempList = [index == 0 ? {text: currentLinks[0].text, url: newURL} : currentLinks[0]];
        for (let i = 1; i < currentLinks.length; i++) {
            tempList.push(index == 0 ? {text: currentLinks[i].text, url: newURL} : currentLinks[i]);
        }
        setCurrentLinks(tempList);
    };

    const page4 = <div className='edit-profile-body links'>
        <div className='edit-profile-section'>
            <div className='edit-region links'>
                <div className='edit-region-header links'>Social Links</div>
                <div className='edit-region-instruct links'>Provide the links to pages you wish to include on your page.</div>
                <div className='edit-region-links-list'>
                    {
                        // currentLinks.map((linkItem: { text: string, url: string }, index: number) => {
                        //     return (
                        //         <div className='edit-region-link-item'>
                        //             {getLinksDropDown(linkItem.text, index)}
                        //             <div className='edit-region-input links'>
                        //                 <input type='text' className='edit-region-input-text'
                        //                     placeholder='URL' value={linkItem.url} onChange={(e) => {updateURL(index, e.target.value)}}></input>
                        //                 <button className='remove-button' onClick={(e) => {removeLink(index)}}>—</button>
                        //             </div>
                        //         </div>
                        //     );
                        // })
                    }
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

    const saveNewData = () => {
        // TO DO: Add in code to save the data to the server 

        openClosePopup(showPopup, setShowPopup);
    };

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
                        <button className='edit-region-save-button' onClick={() => {saveNewData()}}>Save Changes</button>
                    </div>
                </div>
            </PagePopup>
            {/* <Popup children={content}></Popup> */}
        </div>
    );
};

export default EditButton;