import profilePicture from '../images/blue_frog.png';
import profileImage from '../icons/profile-user.png';
import { useNavigate } from 'react-router-dom';
import { ThemeIcon } from './ThemeIcon';
import * as paths from '../constants/routes';
//Component that will contain info about a profile, used in the discovery page (for now)
//Smaller and more concise than ProfileCard.tsx

//Takes in a 'profile' value which contains info on the profile it will display
export const ProfilePanel = ({ profileData }) => {
  console.log(profileData);

  const navigate = useNavigate();
  const profileURL = `${paths.routes.NEWPROFILE}?userID=${profileData.user_id}`;

  return (
    <div className={'profile-panel'}>
      <img src={`images/profiles/${profileData.profile_image}`} alt={'profile image'} />
      <h2>
        {profileData.first_name} {profileData.last_name}
      </h2>
      <h3>{profileData.major}</h3>
      <div id="quote">"{profileData.headline}"</div>
      <div className={'profile-panel-hover'} onClick={() => navigate(profileURL)}>
        <div className={'profile-panel-hover-item'}>
          <ThemeIcon light={'assets/white/role.png'} dark={'assets/black/role.png'} />
          <p>{profileData.job_title}</p>
        </div>
        <div className={'profile-panel-hover-item'}>
          <ThemeIcon light={'assets/white/location.png'} dark={'assets/black/location.png'} />
          <p>{profileData.location}</p>
        </div>
        <div className={'profile-panel-hover-item'}>
          <ThemeIcon light={'assets/white/pronouns.png'} dark={'assets/black/pronouns.png'} />
          <p>{profileData.pronouns}</p>
        </div>
        <div className={'profile-panel-hover-item'}>
          <ThemeIcon light={'assets/white/funfact.png'} dark={'assets/black/funfact.png'} />
          <p>{profileData.fun_fact}</p>
        </div>
      </div>
    </div>
  );
};
