import { useState, useEffect } from "react";
import { getUsersById } from "../../api/users";


interface LinkData {
  id: Number;
  url: String;
}

const ProfileContactTab = (userID: number) => {
    let links = [] as LinkData[];
    const [socials, setSocials] = useState([]);

    let linksTSX;
    const [email, setEmail] = useState("dummy@gmail.com");
    const [phone, setPhone] = useState("1-431-dummy");



    // copied over from Profile.tsx to get social links
    useEffect(() => {
    const loadSocials = async () => {
        try {
      const response = await getUsersById(1) // Runs into 401 access error
      const user = response.data;
      if (response.status === 200) {
        //setSocials(user.socials)
        setEmail(user.first_name);
        setPhone(user.last_name);
        console.log("success!")
      }

      console.log("response data:" + response)

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

    } catch (err){console.log('failed to load socials', err);}

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
                        <p>First Name: {email}</p>
                    </div>                    
                )}
                
                { phone && (
                    <div className="phone-link"> 
                        <p>Last Name: <a href = {phone}>{phone}</a></p>
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