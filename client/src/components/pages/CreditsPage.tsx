//Styles
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

import { Header } from '../Header';
import { members } from '../../constants/lfgmembers';

//returns div for html of credits page
const Credits = () => {
  return (
    <div className="page" id="my-projects">
      <Header dataSets={[]} onSearch={[]} />

      <h1 id="credits-title">Meet The LFG Team</h1>

      {/*runs through an array of all the members and creates a "card" for each one */}
      <div id="credit-members-container">
        {members.map(member => (
          <div className="lfg-contributor" key={member.name}>
            <img className="project-contributor-profile" src={member.photo} />
            <div className="project-contributor-info">
              <h2 className="team-member-name">{member.name}</h2>
              <p className="team-member-role">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
