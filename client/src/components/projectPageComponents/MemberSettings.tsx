import "../styles.css";
import { MemberListing } from "./MemberListing";
import { SearchBar } from "../SearchBar";
import { projects } from "../../constants/fakeData";
import { useState } from 'react';

//Used for the members tab of the project settings
export const MemberSettings = (props) => {
  let i = 0;

  const [memberData, setMemberData] = useState(projects[0].members);

  //Called when searchbar is used to remake member list
  const updateMembers = (members) => {
    setMemberData(members);
  }

  return(
    <div id='member-settings'>
      <div id='member-settings-header'>
      <SearchBar data={projects[0].members} onSearch={updateMembers}/>
      <button className='white-button'>Invite</button>
      </div>
      <div id='member-settings-list'>
        <hr/>
        {memberData.map(member => {
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