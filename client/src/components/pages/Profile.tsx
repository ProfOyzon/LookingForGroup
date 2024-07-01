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
  const [UID, setUID] = useState(profiles[0]._id);
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
          <ProfileSkills user={user}/>
          <ProfilePreferences user={user}/>
        </div>
        <div>
          <ProfileProjects user={user}/>
        </div>
      </div>
        <ProfileEndorsements user={user}/>
        <ProfileGallery/>
    </div>
  );
}

export default Profile;