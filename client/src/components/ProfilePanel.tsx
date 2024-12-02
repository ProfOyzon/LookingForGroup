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
  console.log(profileData);
  const navigate = useNavigate();
  const profileURL = `${paths.routes.NEWPROFILE}?userID=${profileData.user_id}`

  return (
    <div className={'profile-panel'}>
      <img src={`images/profiles/${profileData.profile_image}`} alt={"profile image"}/>
      <h2>{profileData.first_name} {profileData.last_name}</h2>
      <h3>{profileData.major}</h3>
      <div id="quote">"{profileData.headline}"</div>
      <div className={'profile-panel-hover'} onClick={() => navigate(profileURL)}>
        <div className={'profile-panel-hover-item'}>
          <img src="assets/black/role.png"
          src-light="assets/white/role.png"
          src-dark="assets/black/role.png"
          className="theme-icon"
          />
          <p>{profileData.job_title}</p>
          </div>
        <div className={'profile-panel-hover-item'}>
          <img src="assets/black/location.png"
          src-light="assets/white/location.png"
          src-dark="assets/black/location.png"
          className="theme-icon"
          />
          <p>{profileData.location}</p>
          </div>
        <div className={'profile-panel-hover-item'}>
          <img src="assets/black/pronouns.png"
          src-light="assets/white/pronouns.png"
          src-dark="assets/black/pronouns.png"
          className="theme-icon"
          />
          <p>{profileData.pronouns}</p>
          </div>
        <div className={'profile-panel-hover-item'}>
          <img src="assets/black/funfact.png"
          src-light="assets/white/funfact.png"
          src-dark="assets/black/funfact.png"
          className="theme-icon"
          />
          <p>{profileData.fun_fact}</p>
          </div>
      </div>
    </div>
  )
}