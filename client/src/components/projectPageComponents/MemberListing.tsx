import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { profiles } from "../../constants/fakeData";

export const MemberListing = (props) => {
  return(
    <div className='member-settings-listing'>
    <img className='member-settings-profile' src={profilePlaceholder} alt=''/>
    <span className='member-settings-name'>{profiles[props.id].name}</span>
    <span className='member-settings-role'>{props.role}</span>
    <button className='member-settings-edit'><img src=''/></button>
    <button className='member-settings-more'><img src='' alt='...'/></button>
    </div>
  )
}