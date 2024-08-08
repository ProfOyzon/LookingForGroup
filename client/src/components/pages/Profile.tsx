import "./pages.css";
import "../Styles/styles.css";
import {profiles} from "../../constants/fakeData";
import { ProfileHeader } from "../Profile/ProfileHeader";
import { ProfileInterests } from "../Profile/ProfileInterests";
import { ProfileSkills } from "../Profile/ProfileSkills";
import { ProfileEndorsements } from "../Profile/ProfileEndorsements";
import { ProfileProjects } from "../Profile/ProfileProjects";
import { useState } from "react";

const Profile = (props) => {
  //Get profile id from search query
  let urlParams = new URLSearchParams(window.location.search);
  let profileID = urlParams.get('profID');

  //If nothing is found, use a default id
  if (profileID === null) {
    profileID = '0';
  }

  //Find profile data using id & assign it to a value to use
  const profileData = profiles.find(p => p._id === Number(profileID)) || profiles[0];
  
  const [UID, setUID] = useState(profileData._id);
  const user = profiles[UID];

  window.scrollTo(0,0);
  
  return (
    <div className = "page">
      <select onChange = {e => {
                setUID(Number(e.target.value));
            }}>
                {
                    profiles.map(prof => {
                        return <option value={prof._id}>{prof.username}</option>
                    })
                }
            </select>
      <div id="profile-page">
        <ProfileHeader user={user}/>
        <ProfileInterests user={user}/>
        <div>
          <ProfileSkills user={user}/>
          <ProfileEndorsements user={user}/>
        </div>
          <ProfileProjects user={user}/>
      </div>
    </div>
  );
}

export default Profile;