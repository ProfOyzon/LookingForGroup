import "./pages.css";
import pfp from '../../img/profile-user.png';
import {profiles} from "../../constants/fakeData";
import{projects} from "../../constants/fakeData";
import { Tags } from "../Tags";
import { ProjectCard } from "../ProjectCard";
const user = profiles[0];

const Profile = (props) => {
  return (
    <div>
      <section id = "profileHeader">
        <img id = "pfp" src={pfp} width="100" height="100"></img>
        <div id = "info">
        <h2 id="name">{user.name}</h2>
        <h3 id = "pronouns">{user.pronouns[0] + "/" + user.pronouns[1]}</h3>
        <div className = "header">
          <p>Featured Skills:</p>
          <div id = "featuredList" className = "skillList">
            {user.skills.filter(skill => skill.higlighted).map(filteredSkill => (
              <Tags>{filteredSkill.skill}</Tags>
            ))}
          </div>
        </div>
      </div>
      </section>

      <p id = "about">{user.bio}</p>

      <section id = "skills">
        <h2>Skills</h2>
        <h3>Proficiencies:</h3>
        <div id = "proficiencies" className = "skillList">
        </div>

        <h3>Hard Skills:</h3>
        <div id = "hardSkills" className = "skillList"></div>

        <h3>Soft Skills</h3>
        <div id = "softSkills" className = "skillList">
          {user.skills.map(skill => (
            <Tags>{skill.skill}</Tags>
          ))}
        </div>
      </section>

      <section id = "endorsements">
            <h2>Endorsements</h2>
            <div id = "tabList"></div>
            <div id = "textList"></div>
        </section>

        <section id = "projects">
            <h2>Projects</h2>
            <div id = "projectList">
              {/* {user.projects.map(proj => (
                <ProjectCard project={projects[proj]}></ProjectCard>
              ))} */}

              <ProjectCard project={projects[0]}></ProjectCard>
              <ProjectCard project={projects[0]}></ProjectCard>
              <ProjectCard project={projects[0]}></ProjectCard>
              <ProjectCard project={projects[0]}></ProjectCard>
              <ProjectCard project={projects[0]}></ProjectCard>
            </div>
        </section>
    </div>
  );
}

export default Profile;