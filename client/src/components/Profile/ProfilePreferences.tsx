import { Tags } from "../Tags";
import edit from '../../img/edit.png';
import { PagePopup, openClosePopup } from "../PagePopup";
import { useState } from 'react';
// import ChooseInterests from "../SignupProcess/ChooseInterests";

export const ProfilePreferences = ({ user }) => {
  // const [showInterestsModal, setShowInterestsModal] = useState(false);
  // const [selectedInterests, setSelectedInterests] = useState(user.preferences);

  const [showPopup, setShowPopup] = useState(false);
  let openPopups = [showPopup];

  return (
    <section id="profile-preferences">
      <div className="profile-name-button">
        <h1>Preferences</h1>
        <button className="icon-button" onClick={() => openClosePopup(showPopup, setShowPopup, openPopups)}><img src={edit} /></button>
        {/* <button className="icon-button" onClick={() => setShowInterestsModal(true)}><img src={edit} /></button> */}
      </div>
      <div id="profile-preferences-list" className="profile-list">
        {user.preferences.map(preference => <Tags>{preference}</Tags>)}
      </div>

      <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup} openPopups={openPopups}>
        <div id='profile-edit-prefs'>
          <p>edit preferences here</p>
        </div>
      </PagePopup>

        {/*  WORK IN PROGRESS 
            -- Styles and Structure are there, but functionality is not yet implemented
        *  
        *  Can reuse the interests modal from signup
        *  Just need to pass in the selected interests
        *  and set the mode to "edit"
        */}
      {/* <ChooseInterests
        onNext={() => { setShowInterestsModal(false); }}
        onBack={() => { setShowInterestsModal(false);}}
        show={showInterestsModal}
        selectedInterests={selectedInterests}
        setSelectedInterests={setSelectedInterests}
        mode="edit"
        onClose={() => { setShowInterestsModal(false); }}
      /> */}
    </section>
  );
}