import { Tags } from "../Tags";

export const ProfileSkills = ({user}) => {
    return (
        <section className="profile-section" id = "profile-skills">
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
    );
}