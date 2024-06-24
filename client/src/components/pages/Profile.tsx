import { useState } from "react";
import "./pages.css";
import "../styles.css";
import pfp from '../../img/profile-user.png';
import froggy from "../../images/blue_frog.png";
import {profiles} from "../../constants/fakeData";
import{projects} from "../../constants/fakeData";
import { Tags } from "../Tags";
import { ProjectCard } from "../ProjectCard";
import { Endorsement } from "../Endorsement";
import { TabButton, TabContent } from "../Tabs";
const user = profiles[0];

const Profile = (props) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className = "page">
      <section id = "profileHeader">
        <img id = "pfp" src={pfp} width="100" height="100"></img>
        <div id = "info">
          <h2 id="name">{user.name}</h2>
          <h3 id = "pronouns">{user.pronouns[0] + "/" + user.pronouns[1]}</h3>
          <div className = "header">
            <p>Featured Skills:</p>
            <div id = "featuredList" className = "list">
              {user.skills.filter(skill => skill.higlighted).map(filteredSkill => (
                <Tags>{filteredSkill.skill}</Tags> 
              ))}
            </div>
          </div>
        </div>
        <p id = "about">{user.bio}</p>
      </section>

      <section id = "preferences">
        <h2>Preferences</h2>
        <h3> Project Preferences:</h3>
        <p>{user.preferences.projectPreference}</p> 
        <h3> Role Preferences:</h3> 
        <p>{user.preferences.rolePreference}</p>
        <h3> Availablity:</h3> 
        <p>{user.preferences.availability}</p>
      </section>

      <section id = "gallery">
        <h2>Gallery</h2>
        <img id = "pfp" src={froggy} width="200" height="200"></img>
        <img id = "pfp" src={froggy} width="200" height="200"></img>
        <img id = "pfp" src={froggy} width="200" height="200"></img>
        <img id = "pfp" src={froggy} width="200" height="200"></img>
        <img id = "pfp" src={froggy} width="200" height="200"></img>
      </section>

      <section id = "links">
        <h2>Links</h2>
        <div className="list">
          {user.links.map(link => (
            <Tags>{link.text}</Tags>
          ))}
        </div>
        
      </section>

      <section id = "skills">
        <h2>Skills</h2>
        
        <div id = "proficiencies" className = "list">
        <h3>Proficiencies:</h3>
          {user.skills.filter(skill => skill.type == "proficiency").map(filteredSkill => (
            <Tags>{filteredSkill.skill}</Tags> 
          ))}
        </div>

        
        <div id = "hardSkills" className = "list">
          <h3>Hard Skills:</h3>
            {user.skills.filter(skill => skill.type == "hardSkill").map(filteredSkill => (
              <Tags>{filteredSkill.skill}</Tags> 
            ))}
        </div>

        <div id = "softSkills" className = "list">
          <h3>Soft Skills:</h3>
            {user.skills.filter(skill => skill.type == "softSkill").map(filteredSkill => (
              <Tags>{filteredSkill.skill}</Tags> 
            ))}
        </div>
      </section>

      <section id = "endorsements">
            <h2>Endorsements</h2>
            <div id = "tabList" className="list">
              <TabButton names = {getSkillNames(user.skills.filter(skill => skill.endorsed))} activeTab={activeTab} setActiveTab={setActiveTab}></TabButton>
            </div>
            <div id = "textList">
              <TabContent Children={getChildrenList(user.skills.filter(skill => skill.endorsed))} activeTab={activeTab}></TabContent>
            </div>
        </section>

        <section id = "projects">
            <h2>Projects</h2>
            <div className = "list">
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

function getSkillNames(skillList) {
  let names : string[] = [];
  for (let skill of skillList){
    names.push(skill.skill);
  }
  return names;
}

function getChildrenList (skillList) {
  let endorsements : Object[] = [];
  for (let skill of skillList){
    endorsements.push(skill.endorsements.map(endorsement =><Endorsement endorsement={endorsement}></Endorsement>))
  }
  return endorsements;
}

export default Profile;