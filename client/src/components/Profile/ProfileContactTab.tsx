import { useState } from "react";
import { useEffect } from "react";


import { getSocials } from "./tabs/LinksTab";


interface LinkData {
  id: Number;
  url: String;
}

const ProfileContactTab = ({user}) => {
    let links = [] as LinkData[];
    let socials = user.socials;

    let linksTSX;
    const [socialLinks, setSocialLinks] = useState();
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);


    // copied over from Profile.tsx to get social links
    useEffect(() => {
    const loadSocials = async () => {
      // Pick which socials to use based on type
      let url = `api/users/${user.user_id}`;


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
    }
    loadSocials();

  }, []);


    if (links){
        linksTSX = links.map((link) =>{            
            if (link.url.includes("linkedin.com")) ( <p className = "linkedin-social-link"><a href = {link.url.toString()}>{link.url}</a></p> );
            else if (link.url.includes("instagram.com")) (<p className = "instagram-social-link"><a href = {link.url.toString()}>{link.url}</a></p>);
            else (<p className = "other-social-link"><a href = {link.url.toString()}>{link.url}</a></p>);
        }
    )};
    
    console.log("Profile Displayed");
 
    return(
        <div className="profile-contact-tab">
            <h1>Contact Info</h1>
            <div className="contact-info-list">
                <div className="social-links">
                    {linksTSX}                    
                </div>
                <div className="email-links">
                    user.email ? <p>Email: {email}</p>
                </div>
                <div className="phone-link">
                    <p>Phone: <a href = {phone}>{phone}</a></p>
                </div>
            </div>
        </div>
    );
}

export default ProfileContactTab;