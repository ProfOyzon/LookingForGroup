import "../styles.css"
import profilePlaceholder from "../../img/profile-user.png";

export const ProjectMember = (props) => {
  return (
    //Allow to be clickable later, take user to member's profile page
    <div className='project-member'>
      <img src={profilePlaceholder} alt=''/>
      <h2 className='member-name' onClick={() => window.location.href="profile"}>{props.name}</h2>
      <div className='member-role'>{props.role}</div>
    </div>
  )
}