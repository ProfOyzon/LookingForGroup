import profilePicture from "../images/blue_frog.png";
//Component that will contain info about a project, used in the discovery page
//Smaller and more concise than ProjectCard.tsx

//Currently, this component serves as a placeholder

//Takes in a 'project' value which contains info on the project it will display
export const ProjectPanel = ({ width }) => {
  return (
    <div className={'project-panel'} style={{ width: width }}>
      <img src="assets/bannerImages/project_temp.png" alt={"project image"} />
      <div className={'project-panel-hover'}>
        <img src="assets/bannerImages/project_temp.png" alt={"project image"} />
        <h2>Project Title</h2>
        <h3>Tags Tags Tags</h3>
        <div id="quote">Immerse yourself in Little Nightmares, a dark whimsical tale that will confront you with your childhood fears! Help Six escape The Maw – a vast, mysterious vessel inhabited by corrupted souls looking for their next meal.</div>
      </div>
    </div>
  )
}