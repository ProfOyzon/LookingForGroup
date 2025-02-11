import { useState, useEffect, JSXElementConstructor } from 'react';
import { sendPut, sendFile, fetchUserID } from '../../functions/fetch';
import { SocialSelector } from '../SocialSelector';

import '../Styles/credits.css';
import '../Styles/discoverMeet.css';
import '../Styles/emailConfirmation.css';
import '../Styles/general.css';
import '../Styles/loginSignup.css';
import '../Styles/messages.css';
import '../Styles/notification.css';
import '../Styles/profile.css';
import '../Styles/projects.css';
import '../Styles/settings.css';
import '../Styles/pages.css';
import '../Styles/linksTab.css';

const removeRowClicked = (e) => {
  e.preventDefault();
  // Hide what was removed, because decreasing the count will refresh the page
  // This would recreate what was remove
  // 
  return false;
}

const LinkInput = () => {
  return (
    <div className='link-input'>
      <SocialSelector />
      <div className='editor-input-item'>
        <input type="text" name="url" id="link-url-input" />
      </div>
      <button><i></i></button>
    </div>
  );
};

export const LinksTab = () => {
  // load links from profile
  let userID;
  const [links, setLinks] = useState(0);

  const onAddLinkClicked = (e) => {
    e.preventDefault();
    // get the container div
    setLinks(links + 1);
    return false;
  }

  const LinkContainer = () => {
    // Use an effect to reload the container based on the
    // number of links the user has/requests
    useEffect(() => {
      const loadSocials = async () => {
        // fetch for profile on ID
        userID = await fetchUserID();
        const response = await fetch(`api/users/${userID}`);
        const { data } = await response.json(); // use data[0]
        const socials = data[0].socials;
        console.log(socials);
        // TODO: Set up the links container with the fetched socials
      }
      loadSocials();
    }, []);

    // Create the array of Link Inputs
    let content = [] as JSX.Element[];
    for (let i = 0; i < links; i++) {
      content.push(<LinkInput />);
    }

    return (
      <div id='link-container'>
        {content}
      </div>
    );
  }

  return (
    <div id="profile-editor-links" className="hidden">
      <label>Social Links</label>
      <div className="project-editor-extra-info">
        Provide the links to pages you wish to include on your page.
      </div>

      <div id="project-editor-link-list">
        <LinkContainer />
        <button id="project-editor-add-link" onClick={onAddLinkClicked}>+ Add Social Profile</button>
      </div>
    </div>
  );
};