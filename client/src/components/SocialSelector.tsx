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
import '../../public/FontAwesome/css/brands.css';

import { useState, useEffect } from 'react';

const getSocials = async () => {
  // TODO: create error handling, try catch block
  const response = await fetch('/api/datasets/socials');
  const { data } = await response.json();
  return data;
};

export const SocialSelector = (props) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    const setUpSocialSelector = async () => {
      const socials = await getSocials();
      const selectorOptions = socials.map((social, i) => {
        if(`${props.value}` === `${i}`) {
          console.log('Social Website:');
          console.log(social.label.toLowerCase());
          
          return <option value={social.id} selected><i className={`fa-brands fa-${social.label.toLowerCase()}`}></i>{social.label}</option>;
        }
        return <option value={social.id}><i className={`fa-brands fa-${social.label.toLowerCase()}`}></i>{social.label}</option>;
      });
      setOptions(selectorOptions);
    };
    setUpSocialSelector();
  }, []);

  return (
    <div className="editor-input-item">
      <select id="profile-editor-social" onChange={props.onChange}>{options}</select>
    </div>
  );
};
