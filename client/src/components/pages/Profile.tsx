import "./pages.css";
import "../styles.css";
import {profiles} from "../../constants/fakeData";
import { ProfileHeader } from "../Profile/ProfileHeader";
import { ProfilePreferences } from "../Profile/ProfilePreferences";
import { ProfileGallery } from "../Profile/ProfileGallery";
import { ProfileLinks } from "../Profile/ProfileLinks";
import { ProfileSkills } from "../Profile/ProfileSkills";
import { ProfileEndorsements } from "../Profile/ProfileEndorsements";
import { ProfileProjects } from "../Profile/ProfileProjects";
import { useState } from "react";

const Profile = (props) => {
  const [UID, setUID] = useState(profiles[0]._id);
  const user = profiles[UID];
  
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
          <ProfileGallery/>
          <ProfileLinks user={user}/>
        </div>
        <div>
          <ProfileSkills user={user}/>
          <ProfileEndorsements user={user}/>
          <ProfileProjects user={user}/>
        </div>
      </div>
    </div>
  );
}

export default Profile;