import { Tags } from "../Tags";

export const ProfileSkills = ({user}) => {
    return (
        <section id = "profile-skills">
        <h2>Skills</h2>
        <div id = "profile-skill-list" className="profile-list">
          {user.skills.map(skill => (
            <Tags>{skill.skill}</Tags>
          ))}
        </div>
      </section>
    );
}