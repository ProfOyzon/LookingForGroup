import { useState, useEffect } from "react";


interface LinkData {
  id: Number;
  url: String;
}

const ProfileContactTab = (userID: number) => {
    let links = [] as LinkData[];
    let socials = [];

    let linksTSX;
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();



    // copied over from Profile.tsx to get social links
    useEffect(() => {
    const loadSocials = async () => {
        try{
      // Pick which socials to use based on type
      let url = `api/users/${userID}`;


      const response = await fetch(url);
      const { data } = await response.json(); // use data[0]
      socials = data[0].socials;
      setEmail(data[0].email);
      setPhone(data[0].phone);

      // Setup links
      if (socials) {
        links = socials.map((s: any) => {
          return {
            id: s.id,
            url: s.url
          };
        });
      }
      
      if (links){
        linksTSX = links.map((link) =>{  
            if (link.url.includes("linkedin.com")) return ( <p key = {link.id} className = "linkedin-social-link"><a href = {link.url.toString()}>{link.url}</a></p> );
                else if (link.url.includes("instagram.com")) return (<p key = {link.id} className = "instagram-social-link"><a href = {link.url.toString()}>{link.url}</a></p>);
                else return (<p className = "other-social-link">  <a key = {link.id} href = {link.url.toString()}>{link.url}</a></p>);
            }
        )};
    }catch (err){console.log('failed to load socials');}

    }
    loadSocials();

  }, []);


    
    //console.log("Profile Displayed");
 
    return(
        <div className="profile-contact-tab">
            <h1>Contact Info</h1>
            <div className="contact-info-list">
                {email && (
                    <div className="email-links"> 
                        <p>Email: {email}</p>
                    </div>                    
                )}
                
                { phone && (
                    <div className="phone-link"> 
                        <p>Phone: <a href = {phone}>{phone}</a></p>
                    </div>
                )}
                { links && (
                    <div className="links">{linksTSX}</div>
                )}  
            </div>
        </div>
    );
}

export default ProfileContactTab;