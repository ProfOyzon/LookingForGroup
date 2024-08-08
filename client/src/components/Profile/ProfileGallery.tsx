import froggy from "../../images/blue_frog.png";
import edit from '../../icons/edit.png';
import { PagePopup, openClosePopup } from "../PagePopup";
import { useState } from 'react';

export const ProfileGallery = () => {
  let listContent;
  {/*TODO: replace these with images that the user uploaded to the server*/}
  listContent = [
    <img id = "pfp" src={froggy} width="200" height="200"></img>,
    <img id = "pfp" src={froggy} width="200" height="200"></img>,
    <img id = "pfp" src={froggy} width="200" height="200"></img>,
    <img id = "pfp" src={froggy} width="200" height="200"></img>,
    <img id = "pfp" src={froggy} width="200" height="200"></img>
  ]

  const [showPopup, setShowPopup] = useState(false);
  let openPopups = [showPopup];

  return (
      <section id = "profile-gallery">
      <div className="profile-name-button">
          <h1>Gallery</h1>
          <button className="icon-button" onClick={() => openClosePopup(showPopup, setShowPopup, openPopups)}><img src = {edit}/></button>
        </div>

      {/*TODO: make this nicer with an image carousel maybe*/}
      {listContent}

      <PagePopup width={'80vw'} height={'80vh'} popupId={0} zIndex={3} show={showPopup} setShow={setShowPopup} openPopups={openPopups}>
        <div id="profile-edit-gallery" className="profile-edit">
          <h1>Edit Gallery</h1>
          <h3>Select some images to be highlighted on your page</h3>
          <h3>My Images: </h3>
          <div id = "profile-edit-gallery-list" className="profile-list">
            {listContent}
          </div>
        </div>
      </PagePopup>
    </section>
  );
}