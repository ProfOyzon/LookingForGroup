import "../styles.css"
import profilePlaceholder from "../../img/profile-user.png";
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";

export const ProjectMember = (props) => {
  const navigate = useNavigate();
  return (
    //Allow to be clickable later, take user to member's profile page
    <div className='project-member' onClick={() => navigate(paths.routes.PROFILE)}>
      <img src={profilePlaceholder} alt=''/>
      <h2 className='member-name' onClick={() => window.location.href="profile"}>{props.name}</h2>
      <div className='member-role'>{props.role}</div>
    </div>
  )
}