import froggy from "../../images/blue_frog.png";
import edit from '../../img/edit.png';
import { PagePopup, openClosePopup } from "../PagePopup";
import { useState } from 'react';

export const ProfileGallery = () => {
  const [showPopup, setShowPopup] = useState(false);
  let openPopups = [showPopup];

  return (
      <section id = "profile-gallery">
      <div className="profile-name-button">
          <h1>Gallery</h1>
          <button className="icon-button" onClick={() => openClosePopup(showPopup, setShowPopup, openPopups)}><img src = {edit}/></button>
        </div>
      {/*TODO: make this nicer with an image carousel maybe*/}
      <img id = "pfp" src={froggy} width="200" height="200"></img>
      <img id = "pfp" src={froggy} width="200" height="200"></img>
      <img id = "pfp" src={froggy} width="200" height="200"></img>
      <img id = "pfp" src={froggy} width="200" height="200"></img>
      <img id = "pfp" src={froggy} width="200" height="200"></img>

      <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup} openPopups={openPopups}>
        <div id="profile-edit-gallery" className="profile-edit">
            <p>edit gallery here</p>
        </div>
      </PagePopup>
    </section>
  );
}