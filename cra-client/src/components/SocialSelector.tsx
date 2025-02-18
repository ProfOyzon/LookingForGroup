//Styles
import './Styles/credits.css';
import './Styles/discoverMeet.css';
import './Styles/emailConfirmation.css';
import './Styles/general.css';
import './Styles/loginSignup.css';
import './Styles/messages.css';
import './Styles/notification.css';
import './Styles/profile.css';
import './Styles/projects.css';
import './Styles/settings.css';
import './Styles/pages.css';

import { useState, useEffect } from 'react';

const getSocials = async () => {
  // TODO: create error handling, try catch block
  const response = await fetch('/api/datasets/socials');
  const { data } = await response.json();
  // console.log(data);
  return data;
};

export const SocialSelector = () => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    const setUpSocialSelector = async () => {
      const socials = await getSocials();
      const selectorOptions = socials.map((social) => {
        return <option value={social.website_id}>{social.label}</option>;
      });
      setOptions(selectorOptions);
    };
    setUpSocialSelector();
  }, []);

  return (
    <div className="editor-input-item">
      <select id="profile-editor-social">{options}</select>
    </div>
  );
};
