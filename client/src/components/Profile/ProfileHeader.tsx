import pfp from '../../img/profile-user.png';
import discordImg from '../../img/discord.png';
import twitterImg from '../../img/x.png';
import messageImg from '../../img/message.png';
import resumeImg from '../../img/resume.png';
import menu from '../../img/menu.png';
import { PagePopup, openClosePopup } from "../PagePopup";
import { useState } from 'react';

const toggleUserOptions = () => {
  let popup = document.getElementById("user-options-popup");
  popup ? popup.classList.toggle("show") : console.log('element not found');
}

export const ProfileHeader = ({user}) => {
  const [showPopup, setShowPopup] = useState(false);
  let openPopups = [showPopup];

    return(
      <div id = "profile-header-wrapper">
        <div id = "profile-header">
          <img id = "profile-pfp" src={pfp} width="100" height="100"></img>
          <div id = "profile-info">
            <div className = "profile-name-button">
              <h2 id="profile-name">{user.name}</h2>
              <button className="icon-button" onClick = {toggleUserOptions}><img src = {menu}/></button>
              <div id='user-options-popup' className='hide'>
                <button className='white-button'>Share Profile</button>
                <button className='white-button'>Favorite</button>
                <button className='white-button'>Block</button>
                <button className='white-button'>Report</button>
              </div>
            </div>
            <h3 id = "profile-username">@{user.username}</h3>
            <h3 id = "profile-pronouns">{user.pronouns[0] + "/" + user.pronouns[1]}</h3>
            <div className="profile-list" id = "profile-links">
              {/*TODO: allow user to set their own links and icons for links- not just discord/twitter*/}
              {/*right now just uses 4 set icons/links*/}

              <button className='icon-button' onClick={() => window.location.href="https://discord.com"}><img src={discordImg}></img></button>
              <button className='icon-button' onClick={() => window.location.href="https://twitter.com"}><img src={twitterImg}></img></button>
              <button className='icon-button' onClick={() => window.location.href="messages"}><img src={messageImg}></img></button>
              <button className='icon-button' onClick={() => openClosePopup(showPopup, setShowPopup, openPopups)} ><img src={resumeImg}></img></button>

              <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup} openPopups={openPopups}>
                <div id='profile-resume-window'>
                    {/*TODO: have user's resume show up here*/}
                    <p>resume goes here</p>
                </div>
              </PagePopup>

            </div>
          </div>
        </div>
        <p id = "profile-bio"><b>About Me:</b><br/>{user.bio}</p>
      </div>
    );
}