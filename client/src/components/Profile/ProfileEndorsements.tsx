import { Endorsement } from "../Endorsement";
import edit from '../../img/edit.png';
import { PagePopup, openClosePopup } from "../PagePopup";
import { useState } from 'react';

export const ProfileEndorsements = ({user}) => {
  const [showPopup, setShowPopup] = useState(false);
  let openPopups = [showPopup];

  /*fill out the endorsements list*/
  let listContent;
  if(user.endorsements.length > 0){
    listContent = user.endorsements.map(endorsement => (
      <Endorsement endorsement={endorsement} endorsedID={user._id}></Endorsement>
    ))
  }
  /*if the user has no endorsements display a special message*/
  else{
    listContent = <p>This user has no endorsements yet.</p>
  }

  return (
      <section id = "profile-endorsements">
        <div className="profile-name-button">
          <h1>Endorsements</h1>
          <button className="icon-button" onClick={() => openClosePopup(showPopup, setShowPopup, openPopups)}><img src = {edit}/></button>
        </div>
        <div id = "profile-endorseList">
          {listContent}
        </div>

        <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup} openPopups={openPopups}>
          <div id="profile-edit-endorsements" className="profile-edit">
              <p>edit endorsements here</p>
          </div>
        </PagePopup>

      </section>
  );
}