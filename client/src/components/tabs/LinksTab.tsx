import React, { useState, useEffect, useRef } from 'react';
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

interface LinkData {
  id: Number;
  url: String;
}

let links = [] as LinkData[];

export const LinksTab = (props) => {
  const type = props.type;
  let socials = props.socials;

  const [update, setUpdate] = useState(false);
  useEffect(() => {
    const loadSocials = async () => {
      // Pick which socials to use based on type
      const userID = await fetchUserID();
      let url;
      switch (type) {
        case 'project':
          url = `api/users/${userID}`; // Replace with project url
          break;
        default:
          url = `api/users/${userID}`;
          break;

      }
      // fetch for profile on ID
      const response = await fetch(url);
      const { data } = await response.json(); // use data[0]
      socials = data[0].socials;
      // Setup links
      if (socials) {
        links = socials.map(s => {
          return {
            id: s.id,
            url: s.url
          };
        });
      }
      setUpdate(!update);
    }
    loadSocials();

  }, []);
  // Update Functions ----------------------

  const updateURL = (index, newUrl) => {
    // ld = linkData
    links = links.map((ld, i) => i === index ? { ...ld, url: newUrl } : ld);
  }

  const updateWebsite = (index, newWebsite) => {
    links = links.map((ld, i) => i === index ? { ...ld, id: newWebsite } : ld);
  }

  // Button Functions ----------------------

  const onAddLinkClicked = (e) => {
    e.preventDefault();
    // Save current state
    // Adds another LinkInput into the chain
    links.push({ id: 0, url: '' });

    setUpdate(!update);
    return false;
  };

  const onRemoveLinkClicked = (e, index) => {
    e.preventDefault();
    // save this change into the state
    // setLinks(prev => prev.filter((_, i) => i !== index));
    links = links.filter((_, i) => i !== index);
    setUpdate(!update);
    return false;
  };

  // Components ----------------------

  const LinkInput = (props) => {
    let [text, setText] = useState('');

    useEffect(() => {
      console.log(props.data);

      if (links[props.index]) {
        // If there exists a value for it in the array
        // Load in the value
        setText(props.data.url); // textInput
      }
    }, []);

    return (
      <div id={`link-${props.index}`} className='link-input'>
        <SocialSelector value={props.data.id}
          onChange={
            (e) => {
              updateWebsite(props.index, e.target.selectedIndex);
            }} />
        <div className='link-input-wrapper'>
          <div className='editor-input-item'>
            <input type="text" name="url" id="link-url-input" value={text}
              onChange={
                (e) => {
                  setText(e.target.value);
                  updateURL(props.index, e.target.value);
                }
              } />
          </div>
          <button className='close-btn' onClick={
            (e) => {
              onRemoveLinkClicked(e, props.index);
            }}><i className="fa fa-close"></i></button>
        </div>
      </div>
    );
  };

  const LinkContainer = () => {
    // Use an effect to reload the container based on the
    // number of links the user has/requests
    let render;
    if (socials && socials.length > 0) {
      console.log('Using user data...');
      render = socials.map((social, i) => {
        return <LinkInput data={social} index={i} />;
      });
    }
    else if (links.length > 0) {
      render = links.map((ld, i) => {
        return <LinkInput data={ld} index={i} />;
      });
    }
    else {
      render = <p>No Socials Posted!</p>;
    }
    return (
      <div id='links-container'>
        {render}
      </div>
    );
  };

  // Tab Component ----------------------

  return (
    <div id="profile-editor-links" className="hidden">
      <label>Social Links</label>
      <div className="project-editor-extra-info">
        Provide the links to pages you wish to include on your page.
      </div>
      <div id="project-editor-link-list">
        <LinkContainer />
        <div id='add-link-container'>
          <button id="profile-editor-add-link" onClick={onAddLinkClicked}>+ Add Social Profile</button>
        </div>
      </div>
    </div>
  );
};

export const getSocials = () => {
  console.log(links);
  return links;
}