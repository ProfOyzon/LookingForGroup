import { useState } from "react";

const MyProjectsDisplayList = ({projectData}) => {
    const [status, setStatus] = useState();
    const [optionsShown, setOptionsShown] = useState(false);

    const getStatus = async () => {
        const url = `http://localhost:8081/api/projects/${projectData.project_id}`;
        try {
            let response = await fetch(url);

            const rawData = await response.json();
            setStatus(rawData.data[0].status === undefined ? "No data" : rawData.data[0].status);
        }
        catch (error) {
            console.log(error);
        }
    };

    if (status === undefined) {
        getStatus();
    }

    let optionsClass = "list-card-options-list";
    if (optionsShown) {
        optionsClass += " show";
    }

    const toggleOptions = () => {
        if (optionsShown) {
            setOptionsShown(false);
        }
        else {
            setOptionsShown(true);
        }
    };

    const createDate = (theDate: string) => {
        let dataList = theDate.split("T");
        let dateParts = dataList[0].split("-");
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    };

    return (
        <div className="my-project-list-card">
            <div className="list-card-section1">
                {/* Thumbnail */}
                {
                    projectData.thumbnail === null || projectData.thumbnail === undefined || projectData.thumbnail === ""
                        ? <div className="list-card-image" style={{backgroundColor: "white"}}></div>
                        : <img className="list-card-image" src={`/images/thumbnails/${projectData.thumbnail}`} alt={`${projectData.title} Thumbnail`}></img>
                }

                {/* Title */}
                <div className="list-card-title">{projectData.title}</div>
            </div>

            {/* Status */}
            <div className="list-card-status">{status}</div>

            {/* Data Created */}
            <div className="list-card-date">
                {
                    projectData.created_at === null || projectData.created_at === undefined || projectData.created_at === ""
                        ? "No data"
                        : createDate(projectData.created_at)
                }
            </div>

            {/* Options */}
            <div className="list-card-options">
                <button className="list-card-options-button" onClick={(e) => {toggleOptions()}}>•••</button>
                <div className={optionsClass}>
                    <button className="card-leave-button" onClick={(e) => {}}>
                        <i className="fa-slid fa-arrow-right-from-bracket" style={{fontStyle: "normal"}}></i>&nbsp; Leave Project
                    </button>
                    <button className="card-delete-button" onClick={(e) => {}}>
                        <i className="fa-solid fa-trash-can" style={{fontStyle: "normal", color: "#ff3859"}}></i>&nbsp; Delete Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyProjectsDisplayList;