import pfp from '../../img/profile-user.png';
import discordImg from '../../img/discord.png'
import twitterImg from '../../img/x.png'
import messageImg from '../../img/message.png'
import resumeImg from '../../img/resume.png'
import { Tags } from "../Tags";

export const ProfileHeader = ({user}) => {
    return(
        <section className='profile-section' id = "profile-header">
          <div>
            <img id = "profile-pfp" src={pfp} width="100" height="100"></img>
            <div id = "profile-info">
              <h2 id="profile-name">{user.name}</h2>
              <h3 id = "profile-pronouns">{user.pronouns[0] + "/" + user.pronouns[1]}</h3>
              <div className="profile-list" id = "profile-links">
                {/*TODO: allow user to set their own links and icons for links- not just discord/twitter*/}
                {/*right now just uses 4 set icons/links*/}
                {/*TODO: have user's resume show up in a popup window*/}

                <button className='icon-button' onClick={() => window.location.href="https://discord.com"}><img src={discordImg}></img></button>
                <button className='icon-button' onClick={() => window.location.href="https://twitter.com"}><img src={twitterImg}></img></button>
                <button className='icon-button' onClick={() => window.location.href="messages"}><img src={messageImg}></img></button>
                <button className='icon-button'><img src={resumeImg}></img></button>
                
              </div>
            </div>
          </div>
        <p id = "profile-bio">{user.bio}</p>
      </section>
    );
}