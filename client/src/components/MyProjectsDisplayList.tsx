import { useState } from "react";

const MyProjectsDisplayList = ({projectData}) => {
    const [thumbnail, setThumbnail] = useState(`/images/thumbnails/${projectData.thumbnail}`);
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

    const toggleOptions = () => {
        setOptionsShown(!optionsShown);
    };

    return (
        <div className="my-project-list-card">
            <div className="list-card-section1">
                {/* Thumbnail */}
                {
                    projectData.thumbnail === null || projectData.thumbnail === undefined || projectData.thumbnail === ""
                        ? <img className="list-card-image" src={thumbnail} alt={`${projectData.title} Thumbnail`} style={{border: "1px solid black"}}></img>
                        : <img className="list-card-image" src={thumbnail} alt={`${projectData.title} Thumbnail`}></img>
                }

                {/* Title */}
                <div className="list-card-title">{projectData.title}</div>
            </div>

            {/* Status */}
            <div className="list-card-status">{status}</div>

            {/* Data Created */}
            <div className="list-card-date">{"No data"}</div>

            {/* Options */}
            <button className="list-card-options-button" onClick={(e) => {toggleOptions()}}>•••</button>

            {/* Options List */}
        </div>
    );
};

export default MyProjectsDisplayList;