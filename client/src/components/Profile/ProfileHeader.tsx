import pfp from '../../img/profile-user.png';
import { Tags } from "../Tags";

export const ProfileHeader = ({user}) => {
    return(
        <section className='profile-section' id = "profile-header">
        <img id = "profile-pfp" src={pfp} width="100" height="100"></img>
        <div id = "profile-info">
          <h2 id="profile-name">{user.name}</h2>
          <h3 id = "profile-pronouns">{user.pronouns[0] + "/" + user.pronouns[1]}</h3>
          <div className = "profile-highlighted-skills">
            <p>Featured Skills:</p>
            <div id = "profile-featured-list" className = "profile-list">
              {user.skills.filter(skill => skill.higlighted).map(filteredSkill => (
                <Tags>{filteredSkill.skill}</Tags> 
              ))}
            </div>
          </div>
        </div>
        <p id = "profile-bio">{user.bio}</p>
      </section>
    );
}