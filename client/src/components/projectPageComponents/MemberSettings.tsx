import "../styles.css";
import { MemberListing } from "./MemberListing";
import { SearchBar } from "../SearchBar";
import { projects } from "../../constants/fakeData";
import { useState } from 'react';

//This component is used in the project member view of the Project page
//Contains the layout of the 'Member' tab in the project settings menu
//There is a button that should allow for inviting users to become project members assuming they are an admin or similar
//When rendered, displays a list of project members that are rendered with several 'MemberListing' components
//Uses a 'SearchBar' component to assist with sorting through project members
//Currently, the SearchBar does not function correctly due to how it and the current data is structured
//    It currently searches through the project's member data rather than profile data, and no data on user's names are present there
//    'true' and 'false' also manage to return results despite there being no indicators present within the display due to boolean values used in the data

//A projectId value is passed in to load members of the corresponding project

//Used for the members tab of the project settings
export const MemberSettings = (props) => {
  let i = 0;
  const projectData = projects.find(p => p._id === Number(props.projectId)) || projects[0];

  const [memberData, setMemberData] = useState(projectData.members);

  //Called when searchbar is used to remake member list
  const updateMembers = (members) => {
    setMemberData(members[0]);
  }

  return(
    <div id='member-settings'>
      <div id='member-settings-header'>
      <SearchBar dataSets={[{data: projectData.members}]} onSearch={updateMembers}/>
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