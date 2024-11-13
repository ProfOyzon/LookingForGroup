import profilePicture from "../images/blue_frog.png";
//Component that will contain info about a project, used in the discovery page
//Smaller and more concise than ProjectCard.tsx

//Currently, this component serves as a placeholder

//Takes in a 'project' value which contains info on the project it will display
export const ProjectPanel = ({width}) => {
  return (
    <div className={'project-panel'} style={{width: width}}>
      <img src="assets/lfrog.png" alt={"project iamge"}/>
    </div>
  )
}