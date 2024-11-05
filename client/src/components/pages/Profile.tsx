import "./pages.css";
import "../Styles/styles.css";
import {profiles} from "../../constants/fakeData";
import { ProfileHeader } from "../Profile/ProfileHeader";
import { ProfileInterests } from "../Profile/ProfileInterests";
import { ProfileSkills } from "../Profile/ProfileSkills";
import { ProfileEndorsements } from "../Profile/ProfileEndorsements";
import { ProfileProjects } from "../Profile/ProfileProjects";
import { useState } from "react";
import ToTopButton from "../ToTopButton";
import EditButton from "../Profile/ProfileEditButton";

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

  {/*usestates for selectors*/}
  const [UID, setUID] = useState(profileData._id);
  const user = profiles[UID];

  window.scrollTo(0,0);

  const [userData, setUserData] = useState();

  const getUserData = async (userID: number) => {
    const url = `http://localhost:8081/api/users/${userID}`;
    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      });
      const rawData = await response.json();

      setUserData(rawData.data[0]);
    }
    catch (error) {
      console.log(error);
    }
  };
  if (userData === undefined) {
    getUserData(1);
  }

  return (
    <div className = "page">
      {/*selector at the top to switch between users */}
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
      {userData === undefined ? "" : <EditButton userData={userData}/>}

      {/* Scroll To Top button */}
      <ToTopButton />
    </div>
  );
}

export default Profile;