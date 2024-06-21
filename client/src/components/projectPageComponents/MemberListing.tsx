import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { profiles } from "../../constants/fakeData";

const moreSettingsToggle = (i) => {
  let currentId = 'member-settings-dropdown-' + i;
  document.getElementById(currentId).classList.toggle("settings-show");
}

export const MemberListing = (props) => {
  return(
    <div className='member-settings-listing'>
    <img className='member-settings-profile' src={profilePlaceholder} alt=''/>
    <span className='member-settings-name'>{profiles[props.id].name}</span>
    <span className='member-settings-role'>{props.role}</span>
    <button className='member-settings-edit'><img src=''/></button>
    <button className='member-settings-more' onClick={() => moreSettingsToggle(props.num)}>
      <img className='member-settings-more-img' src='' alt='...'/></button>
    <div id={'member-settings-dropdown-' + props.num} className='settings-hide'>
      <button className='white-button'>Add/Remove Admin Role</button>
      <button className='white-button'>Add/Remove Mentor Role</button>
      <button className='white-button'>Remove Member</button>
    </div>
    </div>
  )
}