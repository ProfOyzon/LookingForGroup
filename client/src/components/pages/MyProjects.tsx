import "./pages.css";
// import { MyProjectsDisplay } from "../MyProjectsDisplay";
// import { profiles } from "../../constants/fakeData";
import { useState } from "react";
// import { PagePopup, openClosePopup } from "../PagePopup";
import ToTopButton from "../ToTopButton";
import MyProjectsDisplayList from "../MyProjectsDisplayList";
import MyProjectsDisplayGrid from "../MyProjectsDisplayGrid";

const MyProjects = () => {
    // const [UID, setUID] = useState(profiles[0]._id);
    // const [activePage, setActivePage] = useState(0);

    const [displayMode, setDisplayMode] = useState("grid");
    // Can be: 
    // - grid 
    // - list 
    const [sortMethod, setSortMethod] = useState("newest");
    // Can be: 
    // - newest 
    // - oldest 
    // - a-z 
    // - z-a 
    const [projectsList, setProjectsList] = useState();

    const getProjects = async (userID: number) => {
        const url = `http://localhost:8081/api/users/${userID}/projects`;
        try {
            let response = await fetch(url);

            const rawData = await response.json();
            setProjectsList(rawData.data);
        }
        catch (error) {
            console.log(error);
        }
    };

    if (projectsList === undefined) {
        getProjects(1);
    }

    const sortProjects = () => {
        if (projectsList !== undefined) {
            let tempList = new Array(0);
            for (let i = 0; i < projectsList.length; i++) {
                tempList.push(projectsList[i]);
            }

            switch (sortMethod) {
                case "newest":
                    return tempList.toSorted((a, b) => a.project_id - b.project_id);
                    break;
                
                case "oldest":
                    return tempList.toSorted((a, b) => b.project_id - a.project_id);
                    break;
                
                case "a-z":
                    return tempList.toSorted((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
                    break;
                
                case "z-a":
                    return tempList.toSorted((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
                    break;
            }
        }
    };

    const toggleDisplayMode = () => {
        if (displayMode === "grid") {
            setDisplayMode("list");
        }
        else if (displayMode === "list") {
            setDisplayMode("grid");
        }
    };

    let projectListSection = <></>;
    if (displayMode === "grid") {
        let tempList = sortProjects();
        projectListSection = <>
            {/* Projects List */}
            <div className="my-projects-grid">
                {
                    tempList === undefined ? "" : tempList.map((project) => {
                        return <MyProjectsDisplayGrid projectData={project}></MyProjectsDisplayGrid>
                    })
                }
            </div>
        </>;
    }
    else if (displayMode === "list") {
        let tempList = sortProjects();
        projectListSection = <>
            {/* Projects List Header */}
            <div className="my-projects-list-header">
                <div className="project-header-label title">Project Title</div>
                <div className="project-header-label status">Status</div>
                <div className="project-header-label date">Date Created</div>
                <div className="project-header-label options"></div>
            </div>

            {/* Projects List */}
            <div className="my-projects-list">
                {
                    tempList === undefined ? "" : tempList.map((project) => {
                        return <MyProjectsDisplayList projectData={project}></MyProjectsDisplayList>
                    })
                }
            </div>
        </>;
    }

    return (
        <div className='page' id="my-projects">
            {/* Search Bar and PFP */}

            {/* Banner */}

            {/* Header */}
            <div className="my-projects-header-row">
                {/* All Projects Button */}
                <button className="my-projects-all-projects-button" onClick={(e) => {}}>All Projects</button>

                {/* Sort By Drop Down */}
                <select className="my-projects-sort-list" value={sortMethod} onChange={(e) => {setSortMethod(e.target.value)}}>
                    <option value="sort" disabled>Sort by</option>
                    <option value="newest">&#xf017;&nbsp; Newest</option>
                    <option value="oldest">&#xf017;&nbsp; Oldest</option>
                    <option value="a-z">&#xf062;&nbsp; A-Z</option>
                    <option value="z-a">&#xf063;&nbsp; Z-A</option>
                </select>

                {/* Display Switch */}
                <div className="my-projects-display-switch" onClick={(e) => {toggleDisplayMode()}}>
                    <div className="display-switch-option list" id={displayMode === "list" ? "selected" : ""}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                    <div className="display-switch-option grid" id={displayMode === "grid" ? "selected" : ""}>
                        <i className="fa-solid fa-border-all"></i>
                    </div>
                </div>

                {/* New Project Button */}
                <button className="my-projects-new-project-button" onClick={(e) => {}}>+ New Project</button>
            </div>

            <hr />

            {/* Project Grid/List */}
            {projectListSection}
        </div>
    );
}

export default MyProjects;