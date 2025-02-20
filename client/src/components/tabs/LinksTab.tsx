import React, { useState, useEffect, JSXElementConstructor } from 'react';
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
  website: String;
  url: String;
}

export const LinksTab = () => {
  let userID;
  const [links, setLinks] = useState([] as LinkData[]); 

  // Update Functions ----------------------

  const updateURL = (index, newUrl) => {
    // ld = linkData
    setLinks( links.map( (ld, i) => i === index ? {...ld, url: newUrl} : ld));
  }

  const updateWebsite = (index, newWebsite) => {
    setLinks( links.map((ld, i) => i === index ? {...ld, website: newWebsite} : ld));
  }

  // Button Functions ----------------------

  const onAddLinkClicked = (e) => {
    e.preventDefault();    
    // Save current state
    
    // Adds another LinkInput into the chain
    setLinks(prev => [...prev, {website:'', url:''}]);
    return false;
  };

  const onRemoveLinkClicked = (e, index) => {
    e.preventDefault();
    // save this change into the state
    setLinks(prev => prev.filter((_, i) => i !== index));
    return false;
  };

  // Components ----------------------

  const LinkInput = (props) => {
    return (
      <div id={`link-${props.index}`} className='link-input'>
        <SocialSelector value={props.data.website} 
        onChange={
          (e)=>{
          updateWebsite(props.index, e.target.selectedIndex);
          }}/>
        <div className='link-input-wrapper'>
          <div className='editor-input-item'>
            <input type="text" name="url" id="link-url-input" value={props.data.url} 
            onChange={
              (e)=>updateURL(props.index, e.target.value)
              }/>
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
    let hasSocials = false;
    useEffect(() => {
      const loadSocials = async () => {
        // fetch for profile on ID
        userID = await fetchUserID();
        const response = await fetch(`api/users/${userID}`);
        const { data } = await response.json(); // use data[0]
        const socials = data[0].socials;
        // console.log(socials);
        // TODO: Set up the links container with the fetched socials
        if(socials){
          hasSocials = true;
        }
      }
      loadSocials();
    }, []);

    if(hasSocials){
      console.log('Using user data...');
    }
    else if (links.length > 0){
      console.log('Edit data found, showing...');
      let render = links.map((ld, i) => {
        return <LinkInput data={ld} index={i}/>;
      });
      
      return (
        <div id='links-container'>
          {render}
        </div>
      );
    }
    else {
      console.log('No data');
      return (
        <div id='links-container'>
          <p>No Socials Posted!</p>
        </div>
      );
    }
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
        <button id="project-editor-add-link" onClick={onAddLinkClicked}>+ Add Social Profile</button>
      </div>
    </div>
  );
};