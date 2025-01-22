import { useNavigate } from 'react-router-dom';
import * as paths from '../constants/routes';
import placeholderThumbnail from '../images/project_temp.png';
//Component that will contain info about a project, used in the discovery page
//Smaller and more concise than ProjectCard.tsx

//Takes in a 'project' value which contains info on the project it will display
//Also takes in width (the width of this panel), and rightAlign, which determines which side the hover panel aligns with
export const ProjectPanel = ({ width, projectData, rightAlign = false }) => {
  const navigate = useNavigate();
  const projectURL = `${paths.routes.NEWPROJECT}?projectID=${projectData.project.project_id}`;
  return (
    <div className={'project-panel'} style={{ width: width }}>
      <img
        src={
          projectData.project.thumbnail != null
            ? `images/thumbnails/${projectData.project.thumbnail}`
            : placeholderThumbnail
        }
        alt={'project image'}
      />
      <div
        className={'project-panel-hover'}
        onClick={() => navigate(projectURL)}
        style={rightAlign ? { width: width, right: 0 } : { width: width }}
      >
        <img
          src={
            projectData.project.thumbnail != null
              ? `images/thumbnails/${projectData.project.thumbnail}`
              : placeholderThumbnail
          }
          alt={'project image'}
        />
        <h2>{projectData.project.title}</h2>
        <div id="project-panel-tags">
          {projectData.project.tags.map((tag, index) => {
            let category: string;
            switch (tag.type) {
              case 'Design':
                category = 'red';
                break;
              case 'Developer':
                category = 'yellow';
                break;
              case 'Soft':
                category = 'purple';
                break;
              case 'Creative':
              case 'Games':
                category = 'green';
                break;
              default:
                category = 'grey';
            }
            if (index < 3) {
              return (
                <div className={`skill-tag-label label-${category}`} key={index}>
                  {tag.tag}
                </div>
              );
            }
          })}
        </div>
        <div id="quote">{projectData.project.hook}</div>
      </div>
    </div>
  );
};
