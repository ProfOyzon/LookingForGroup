import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from '../constants/routes';
import { sendDelete } from '../functions/fetch';
import { Dropdown, DropdownButton, DropdownContent } from './Dropdown';

const MyProjectsDisplayGrid = ({ projectData, isOwner }) => {
  //Navigation hook
  const navigate = useNavigate();

  const [status, setStatus] = useState();
  const [optionsShown, setOptionsShown] = useState(false);

  const getStatus = async () => {
    const url = `/api/projects/${projectData.project_id}`;
    try {
      const response = await fetch(url);

      const rawData = await response.json();
      setStatus(rawData.data[0].status === undefined ? 'No data' : rawData.data[0].status);
    } catch (error) {
      console.log(error);
    }
  };

  if (status === undefined) {
    getStatus();
  }

  let optionsClass = 'grid-card-options-list';
  if (optionsShown) {
    optionsClass += ' show';
  }

  const toggleOptions = () => {
    if (optionsShown) {
      setOptionsShown(false);
    } else {
      setOptionsShown(true);
    }
  };

  //Constructs url linking to relevant project page
  const projectURL = `${paths.routes.NEWPROJECT}?projectID=${projectData.project_id}`;

  return (
    <div className="my-project-grid-card">
      {/* Thumbnail */}
      <img
        className="grid-card-image"
        src={(projectData.thumbnail)
          ? `/images/thumbnails/${projectData.thumbnail}`
          : `/assets/project_temp-DoyePTay.png`
        }
        alt={`${projectData.title} Thumbnail`}
        onClick={() => navigate(projectURL)}
      ></img>

      {/* Title */}
      <div className="grid-card-title" onClick={() => navigate(projectURL)}>
        {projectData.title}
      </div>

      {/* Options */}
      <Dropdown>
        <DropdownButton buttonId="grid-card-options-button">•••</DropdownButton>
        <DropdownContent rightAlign={true}>
          <div className="grid-card-options-list">
            {!isOwner ? (
              <button className="card-leave-button" onClick={(e) => { }}>
                <i
                  className="fa-solid fa-arrow-right-from-bracket"
                  style={
                    {
                      fontStyle: 'normal',
                      transform: 'rotate(180deg)',
                    }
                  }
                ></i>
                &nbsp; Leave Project
              </button>
            ) : (
              <button 
                className="card-delete-button" 
                onClick={() => { 
                  sendDelete(`/api/projects/${projectData.project_id}`);
                }}
              >
                <i
                  className="fa-solid fa-trash-can"
                  style={{ fontStyle: 'normal', color: '#ff3859' }}
                ></i>
                &nbsp; Delete Project
              </button>
            )}
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  );
};

export default MyProjectsDisplayGrid;
