import { Tags } from "../Tags";
import edit from '../../icons/edit.png';
import { PagePopup, openClosePopup } from "../PagePopup";
import { SearchBar } from "../SearchBar";
import { useState } from 'react';
// import ChooseInterests from "../SignupProcess/ChooseInterests";

export const ProfileInterests = ({ user }) => {
  // const [showInterestsModal, setShowInterestsModal] = useState(false);
  // const [selectedInterests, setSelectedInterests] = useState(user.interests);

  //make a list of all of the user's interests
  let interestsList;
  interestsList = user.interests.map(interest => <Tags>{interest}</Tags>)

  //usestate code for the "edit interests" popup
  const [showPopup, setShowPopup] = useState(false);
  let openPopups = [showPopup];

  //search function for the "edit interests" popup
  const Search = (results) => {
    /*TODO: search interests code goes here*/
  }

  return (
    <section id="profile-interests">
      <div className="profile-name-button">
        <h1>Interests</h1>
        {/*edit interests button*/}
        {/*TODO: only show when a user views their own profile*/}
        <button className="icon-button" onClick={() => openClosePopup(showPopup, setShowPopup, openPopups)}><img src={edit} /></button>
        {/* <button className="icon-button" onClick={() => setShowInterestsModal(true)}><img src={edit} /></button> */}
      </div>
      <div id="profile-interests-list" className="profile-list">
        {interestsList}
      </div>

      
      <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup} openPopups={openPopups}>
        <div id="profile-edit-interests" className="profile-edit">
          <h1>Edit Interests</h1>
            <h3>Select 3 or 4 interests to be highlighted on your page</h3>
            <SearchBar dataSets={[{ }]} onSearch={Search}></SearchBar>

            <h3>My Interests: </h3>
            <div id = "profile-edit-interests-list" className="profile-list">
              {interestsList}
            </div>
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