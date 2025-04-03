import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from '../constants/routes';
import { Dropdown, DropdownButton, DropdownContent } from './Dropdown';

const MyProjectsDisplayList = ({ projectData }) => {
  // Navigation hook
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

  const deleteProject = async () => {
    const url = `/api/projects/${projectData.project_id}`;
    try {
      // send a DELETE request to the API
      const response = await fetch(url, {
        method: 'DELETE',
      });

      // check if the delete request was successful
      if (response.ok) {
        console.log('Project deleted successfully');
      } else {
        console.log('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  let optionsClass = 'list-card-options-list';
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

  const createDate = (theDate: string) => {
    const dataList = theDate.split('T');
    const dateParts = dataList[0].split('-');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  };

  //Constructs url linking to relevant project page
  const projectURL = `${paths.routes.NEWPROJECT}?projectID=${projectData.project_id}`;

  return (
    <div className="my-project-list-card">
      <div className="list-card-section1">
        {/* Thumbnail */}
        <img
          className="list-card-image"
          src={(projectData.thumbnail)
            ? `/images/thumbnails/${projectData.thumbnail}`
            : `/assets/project_temp-DoyePTay.png`
          }
          alt={`${projectData.title} Thumbnail`}
          onClick={() => navigate(projectURL)}
        ></img>

        {/* Title */}
        <div 
          className="list-card-title"
          onClick={() => navigate(projectURL)}
        >{projectData.title}</div>
      </div>

      {/* Status */}
      <div className="list-card-status">{status}</div>

      {/* Data Created */}
      <div className="list-card-date">
        {projectData.created_at === null ||
          projectData.created_at === undefined ||
          projectData.created_at === ''
          ? 'No data'
          : createDate(projectData.created_at)}
      </div>

      {/* Options */}
      <Dropdown>
        <DropdownButton buttonId="list-card-options-button">•••</DropdownButton>
        <DropdownContent rightAlign={true}>
          <div className="list-card-options-list">
            <button className="card-leave-button" onClick={(e) => { }}>
              <i
                className="fa-slid fa-arrow-right-from-bracket"
                style={{ fontStyle: 'normal' }}
              ></i>
              &nbsp; Leave Project
            </button>
            <button
              className="card-delete-button"
              onClick={() => {
                deleteProject();
              }}
            >
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

export default MyProjectsDisplayList;
