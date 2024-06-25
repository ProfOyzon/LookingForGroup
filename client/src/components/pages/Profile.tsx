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

const user = profiles[0];

const Profile = (props) => {
  return (
    <div className = "page">
      <ProfileHeader user={user}/>
      <ProfilePreferences user={user}/>
      <ProfileGallery/>
      <ProfileLinks user={user}/>
      <ProfileSkills user={user}/>
      <ProfileEndorsements user={user}/>
      <ProfileProjects/>
    </div>
  );
}

export default Profile;