import "./pages.css";
import "../Styles/styles.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../Header";
import { Dropdown, DropdownButton, DropdownContent } from "../Dropdown";
import { Popup, PopupButton, PopupContent } from "../Popup";
import { ProjectImageCarousel } from "../ProjectImageCarousel";
import profilePicture from "../../images/blue_frog.png";
import profileImage from "../../icons/profile-user.png";
import tallImage from "../../images/tall_img.png";
import heart from "../../icons/heart.png";
import menu from "../../icons/menu.png";
import menuImage from "../../icons/menu.png";
import * as tags from "../../constants/tags";

//use while using npm run client
let defaultProject = {
  projectUsers: [
    {userName: 'user1', position: 'job1'},
    {userName: 'user2', position: 'job2'},
    {userName: 'user3', position: 'job3'},
    {userName: 'user4', position: 'job4'},
    {userName: 'user5', position: 'job5'},
  ],
  projectContributors: [
    {userName: 'user1', position: 'job1'},
    {userName: 'user2', position: 'job2'},
    {userName: 'user3', position: 'job3'},
    {userName: 'user4', position: 'job4'},
    {userName: 'user5', position: 'job5'},
  ],
  hightlightTags: [
    {tag: "Action", type: "Creative"},
    {tag: "Rogue-Like", type: "Games"},
    {tag: "Sci-Fi", type: "Creative"},
  ],
  openPositions: [
    'Web Developer',
    'Back-end Developer',
    '2D Animator',
    'Composer',
    'UI/UX Designer'
  ]
}

const NewProject = () => {
  //Get project ID from search parameters
  let urlParams = new URLSearchParams(window.location.search)
  let projectID = urlParams.get('projectID');

  //state variable used to check whether or not data was successfully obtained from database
  let [failCheck, setFailCheck] = useState(false);

  //Function used to get project data
  const getProjectData = async () => {
    const url = `http://localhost:8081/api/projects/${projectID}`;

    try {
      let response = await fetch(url);

      const projectData = await response.json();
      console.log(projectData);
      console.log(projectData.data[0]);

      if(projectData.data[0] === undefined){
        setFailCheck(true);
        return;
      }

      setDisplayedProject(projectData.data[0]);
    } catch (error) {
      console.error(error.message);
    }
  }

  //State variable holding information on the project to be displayed
  const [displayedProject, setDisplayedProject] = useState(defaultProject);

  //Checks to see whether or not the current user is the maker/owner of the project being displayed
  const usersProject = true;

  const buttonContent = usersProject ? <>{
    <>
      <Popup>
        <PopupButton buttonId='project-info-edit'>Edit Project</PopupButton>
        <PopupContent>
          Not sure what to put here yet, still working on main page content
        </PopupContent>
      </Popup>
    </>
  }</> : <>{
    <>
      <button><img src={heart}/></button>
      <Dropdown>
        <DropdownButton><img src={menu}/></DropdownButton>
        <DropdownContent rightAlign={true}>
          <button>Share</button>
          <button>Report</button>
          <button>Leave</button>
        </DropdownContent>
      </Dropdown>
    </>
  }</>

  //Lists of users who have worked on this project
  //Members - people who actively work on the project
  const projectMembers = defaultProject.projectUsers;
  //Contributors - people who have helped, but aren't actively working on the project
  const projectContributors = defaultProject.projectContributors;
  //People list holds whatever list is currently being displayed
  const [peopleList, setPeopleList] = useState(projectMembers);

  const peopleContent = <>{
    peopleList.map((user) => (
      <div className='project-contributor'>
        <img className='project-contributor-profile' src={profilePicture}/>
        <div className='project-contributor-info'>
          <div>{user.userName}</div>
          <div>{user.position}</div>
        </div>
      </div>
    ))
  }</>

  return (
    <div className='page'>
      <Header dataSets={{data:[]}} onSearch={() => {}}/>
      
      <div id='project-page-content'>
        {/* May need to adjust width/height styles to account for description/carousel sizes */}
        <div id='project-image-carousel'>
          <ProjectImageCarousel/>
        </div>

        <div id='project-info-panel'>
          <div id='project-info-header'>
            <div id='project-title'>Title</div>
            <div id='project-info-buttons'>{buttonContent}</div>
          </div>
          <div id='project-description'>
            Description text Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur dolor error quas similique aut, earum enim voluptatum ducimus? Ipsam vero ullam labore similique, quia laudantium eum libero voluptas tenetur rem saepe. Doloribus dignissimos nam deserunt ea itaque assumenda, animi minus enim sint laboriosam omnis reprehenderit nobis quam rerum beatae magni.
          </div>
          <div id='project-status'>
            Status: <span className='project-info-highlight'>currentStatus </span> 
            <button id='project-open-positions-button'>Open Positions</button>
          </div>
          <div id='project-creation'>
            Created by: <span className='project-info-highlight'>creator</span><br/>
            Creation date
          </div>
          <div id='project-tags'>
            {
              //If more tag types are usable, use commented code for cases
              //Also, check to see how many additional tags a project has
              defaultProject.hightlightTags.map((tag) => {
                /* let category : string;
                switch (tag.type) {

                } */
                return (
                <div className={`project-tag-label label-green`}>
                  {tag.tag}
                </div>
                )
              })
            }
            <div className='project-tag-label label-grey'>+5</div>
          </div>
        </div>

        <div id='project-overview'>
          <div id='project-overview-title'>About This Project</div>
          <div id='project-overview-text'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo in aut mollitia consequuntur odio, laborum asperiores consectetur cum harum, optio odit consequatur id reiciendis? Officia exercitationem facilis quas dicta doloremque? Consequuntur laborum minima distinctio consequatur tempore atque porro neque impedit debitis. Magni, obcaecati nostrum repellendus doloribus doloremque quidem! Cumque repellendus minus, quibusdam, explicabo consectetur expedita ipsum ipsa reiciendis quisquam ad consequatur nam eligendi provident sint magni sequi dolorem laboriosam esse magnam ex quae quas laudantium. Porro facilis rem quae ad. Consequatur quidem natus harum tenetur in iusto fugit ut aut, aliquam minus placeat eius nesciunt ab. Ipsa, sint? Qui quo dicta, quos molestiae, dolorem, inventore adipisci totam vel porro illo doloribus amet debitis officia error iusto vitae possimus ipsam ex enim architecto dolores quibusdam illum rerum. Illo vitae illum eveniet amet sit quae exercitationem maiores repudiandae praesentium enim ducimus vero quam, nihil quaerat. Molestiae laborum enim dolorum ratione harum perspiciatis voluptatibus cupiditate repellendus fugit at vel maxime laudantium voluptates minus in, cum, provident quia alias ipsa voluptatum dolorem incidunt est maiores. Odit ipsa nihil illum accusamus ea quia quod nisi aperiam perspiciatis, corrupti quas officia id et sunt, vel officiis cum voluptate consequuntur accusantium facere. Facilis possimus quo quibusdam adipisci?
          </div>
          {/* Sections could also be added with some extra function, 
          title and content can be assigned to similar elements */}
          <div className='project-overview-section-header'>Purpose</div>
          <div>
            Insert purpose here
          </div>
          <div className='project-overview-section-header'>Target Audience</div>
          <div>
            Insert target audience here
          </div>
          <div id='project-overview-links-section'>
            Keep up with us!
            <div id='project-overview-links'>
              {/* Use function to insert various links here */}
            </div>
          </div>
        </div>

        <div id='project-people'>
          <div id='project-people-tabs'>
            <button className='project-people-tab'>The Team</button>
            <button className='project-people-tab'>Contributors</button>
          </div>
          <div id='project-people-content'>
            {peopleContent}
          </div>
        </div>

        <div id='project-open-positions'>
          <div id='project-open-positions-header'>Open Positions</div>
          <div id='project-open-positions-list'>
            {
              defaultProject.openPositions.map((position) => (
                <div className='project-tag-label label-grey'>{position}</div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewProject;