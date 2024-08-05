import "./pages.css";
import "../styles.css";
import {profiles} from "../../constants/fakeData";
import { ProfileHeader } from "../Profile/ProfileHeader";
import { ProfilePreferences } from "../Profile/ProfilePreferences";
import { ProfileGallery } from "../Profile/ProfileGallery";
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
      <ProfileHeader user={user}/>
      <div id="profile-page">
        <div>
          <ProfilePreferences user={user}/>
          <ProfileSkills user={user}/>
        </div>
        <div>
          <ProfileProjects user={user}/>
          <ProfileEndorsements user={user}/>
        </div>
      </div>
        <ProfileGallery/>
    </div>
  );
}

export default Profile;