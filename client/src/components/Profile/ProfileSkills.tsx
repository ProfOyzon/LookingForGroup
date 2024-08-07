import { Tags } from "../Tags";
import edit from '../../img/edit.png';
import { PagePopup, openClosePopup } from "../PagePopup";
import { useState } from 'react';
import { SearchBar } from "../SearchBar";
import { softSkills } from "../../constants/skills";
import { hardSkills } from "../../constants/skills";
import { proficiencies } from "../../constants/skills";

export const ProfileSkills = ({user}) => {
  /*fill out the skills list*/
  let listContent;
  listContent = user.skills.map(skill => {
    /*add a special class to the highlighted skills for customization*/
    if(skill.highlighted) {
      return <Tags className = "profile-highlighted-skill">{skill.skill}</Tags>
    }
    else{
      return <Tags>{skill.skill}</Tags>
    }
  })

  const [showPopup, setShowPopup] = useState(false);
  let openPopups = [showPopup];

  const Search = (results) => {
    /*TODO: search code goes here*/
  }

  return (
      <section id = "profile-skills">
      <div className="profile-name-button">
          <h1>Skills</h1>
          <button className="icon-button" onClick={() => openClosePopup(showPopup, setShowPopup, openPopups)}><img src = {edit}/></button>
        </div>
      <div id = "profile-skill-list" className="profile-list">
        {listContent}
      </div>

      <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup} openPopups={openPopups}>
        <div id="profile-edit-skills" className="profile-edit">
            <h1>Edit Skills</h1>
            <h3>Select 5 skills to be highlighted on your page</h3>
            <SearchBar dataSets={[{ data: hardSkills }, { data: softSkills }, {data: proficiencies}]} onSearch={Search}></SearchBar>

            <h3>My Skills: </h3>
            <div id = "profile-edit-skills-list" className="profile-list">
              {listContent}
            </div>
        </div>
      </PagePopup>
    </section>
  );
}