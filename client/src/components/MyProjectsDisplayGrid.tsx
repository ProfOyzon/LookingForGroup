import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from '../constants/routes';
import { Dropdown, DropdownButton, DropdownContent } from './Dropdown';

const MyProjectsDisplayGrid = ({ projectData }) => {
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
      {projectData.thumbnail === null ||
      projectData.thumbnail === undefined ||
      projectData.thumbnail === '' ? (
        <div
          className="grid-card-image"
          style={{ backgroundColor: 'white' }}
          onClick={() => navigate(projectURL)}
        ></div>
      ) : (
        <img
          className="grid-card-image"
          src={`/images/thumbnails/${projectData.thumbnail}`}
          alt={`${projectData.title} Thumbnail`}
          onClick={() => navigate(projectURL)}
        ></img>
      )}

      {/* Title */}
      <div className="grid-card-title" onClick={() => navigate(projectURL)}>
        {projectData.title}
      </div>

      {/* Options */}
      <Dropdown>
        <DropdownButton buttonId="grid-card-options-button">•••</DropdownButton>
        <DropdownContent rightAlign={true}>
          <div className="grid-card-options-list">
            <button className="card-leave-button" onClick={(e) => {}}>
              <i
                className="fa-slid fa-arrow-right-from-bracket"
                style={{ fontStyle: 'normal' }}
              ></i>
              &nbsp; Leave Project
            </button>
            <button className="card-delete-button" onClick={(e) => {}}>
              <i
                className="fa-solid fa-trash-can"
                style={{ fontStyle: 'normal', color: '#ff3859' }}
              ></i>
              &nbsp; Delete Project
            </button>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  );
};

export default MyProjectsDisplayGrid;
