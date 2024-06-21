import "../styles.css";
import { MemberListing } from "./MemberListing";
import { projects } from "../../constants/fakeData";

//Used for the members tab of the project settings
export const MemberSettings = (props) => {
  let i = 0;
  return(
    <div id='member-settings'>
      <div>Search bar component here?</div>
      <button className='white-button'>Invite</button>
      <div id='member-settings-list'>
        <hr/>
        {projects[0].members.map(member => {
          i++;
          return(
            <>
            <MemberListing id={member.userID} role={member.role} num={i}/>
            <hr/>
            </>
          )
        })
        }
      </div>
    </div>
  )
}