import profilePicture from "../images/blue_frog.png";
import profileImage from "../icons/profile-user.png";
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";
//Component that will contain info about a profile, used in the discovery page (for now)
//Smaller and more concise than ProfileCard.tsx

//Currently, this component serves as a placeholder

//Note: data names may need changing when using data from the server and not fakeData.ts

//Takes in a 'profile' value which contains info on the project it will display
//Replace extra content with actual data using 'profileData' later
export const ProfilePanel = ({profileData, height}) => {
  const navigate = useNavigate();

  return (
    <div className={'profile-panel'} style={{height: height}}>
      <img src={profilePicture} alt={"profile iamge"}/>
      <h2>{profileData.name}</h2>
      <h3>Major</h3>
      <div>{profileData.bio}</div>
      <div className={'profile-panel-hover'} onClick={() => navigate(paths.routes.PROFILE)}>
        <div className={'profile-panel-hover-item'}><img src={profileImage}/>Profession</div>
        <div className={'profile-panel-hover-item'}><img src={profileImage}/>Location</div>
        <div className={'profile-panel-hover-item'}><img src={profileImage}/>Pronouns</div>
        <div className={'profile-panel-hover-item'}><img src={profileImage}/>Fun fact</div>
      </div>
    </div>
  )
}