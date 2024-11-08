import "./pages.css";
import "../Styles/styles.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../Header";
import profilePicture from "../../images/blue_frog.png";
import profileImage from "../../icons/profile-user.png";
import menuImage from "../../icons/menu.png";
import * as tags from "../../constants/tags";

//use while using npm run client
let defaultProject = {}

const NewProject = () => {

  let urlParams = new URLSearchParams(window.location.search)
  let projectID = urlParams.get('projectID');

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

  const [displayedProject, setDisplayedProject] = useState(defaultProject);

}

export default NewProject;