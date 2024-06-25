import pfp from '../../img/profile-user.png';
import { Tags } from "../Tags";

export const ProfileHeader = ({user}) => {
    return(
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
    );
}