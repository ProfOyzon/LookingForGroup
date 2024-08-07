import { Tags } from "../Tags";
import edit from '../../img/edit.png';
import { PagePopup, openClosePopup } from "../PagePopup";
import { useState } from 'react';

export const ProfileSkills = ({user}) => {
  const [showPopup, setShowPopup] = useState(false);
  let openPopups = [showPopup];

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
            <p>edit skills here</p>
        </div>
      </PagePopup>
    </section>
  );
}