import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";
//Component that will contain info about a project, used in the discovery page
//Smaller and more concise than ProjectCard.tsx

//Currently, this component serves as a placeholder

//Takes in a 'project' value which contains info on the project it will display
export const ProjectPanel = ({ width, projectData }) => {
  console.log(projectData);
  const navigate = useNavigate();
  const projectURL = `${paths.routes.NEWPROJECT}?projectID=${projectData.project.project_id}`;
  return (
    <div className={'project-panel'} style={{ width: width }}>
      <img src="assets/bannerImages/project_temp.png" alt={"project image"} />
      <div className={'project-panel-hover'} onClick={() => navigate(projectURL)}>
        <img src="assets/bannerImages/project_temp.png" alt={"project image"} />
        <h2>{projectData.project.title}</h2>
        <div id='project-panel-tags'>
          {
            projectData.project.tags.map((tag, index) => {
              let category : string;
              switch (tag.type){
                case 'Design': category = 'red'; break;
                case 'Developer': category = 'yellow'; break;
                case 'Soft': category = 'purple'; break;
                case 'Creative':
                case 'Games': category = 'green'; break;
                default : category = 'grey';
              }
              if (index < 3) {
                return(
                  <div className={`skill-tag-label label-${category}`} key={index}>{tag.tag}</div>
                )
              }
            })
          }
        </div>
        <div id="quote">{projectData.project.hook}</div>
      </div>
    </div>
  )
}