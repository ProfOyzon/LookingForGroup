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

import { useState } from 'react';
import { Header } from "../Header";

const Credits = ({ theme, setTheme }) => {
    // THINGS TO DO:
    // ADD A LIST OF ALL OF US 
    // MAKE PAGE MOBILE FRIENDLY 
    // MAKE ACCESS TO PAGE MOBILE FRIENDLY 
    // MIGHT WANT TO RETOOL HOW THE TOGGLING OF THE CREDITS PAGE WORKS (MAYBE, IDK) 
    // MORE (PROBABLY) 

    // list of og members and their roles
    const ogMembers = {"Abraham Furlan" : "Web Developer", "Aeris Peng" : "UI/UX Designer", "Alexander Bok" : "UI/UX Designer", "Andrew Lang" : "Web Developer", "Ben Gomez" : "Web Developer", "Charlie Mendes" : "Web Developer", "Chinmay Gaikwad" : "Web Developer", "Diya Iyer" : "Project Lead", "Elise Hayek" : "UI/UX Designer", "Eloise (Weez) Oyzon" : "Supervisor", "Gerrit Wissink" : "Web Developer", "Halen Ruch" : "UI/UX Designer", "Jennifer Pichardo" : "Web Developer", "Joey Patrum" : "Web Developer", "Joseph Davidson" : "Web Developer", "Joeseph Dunne" : "Web Developer", "Judith (Judy) Derrick" : "Web Developer", "Kaelynn Amodia" : "Web Developer", "Kashaf Ahmed" : "Web Developer", "Matt Ivansek" : "Web Developer", "Samera Vilinskis" : "Web Developer", "Sebastian Arroyo (Bas)" : "UI/UX Designer", "Storm Rivera" : "Web Developer", "Thomas Martinez" : "UI/UX Designer", "Trevor Dunn" : "Web Developer", "Will Steele" : "Producer/Project Lead", "Wilson Xia" : "Web Developer", "Zane London" : "UI/UX Designer"};

    return (
        <div className='page' id="my-projects">
            <Header dataSets={[]} onSearch={[]} theme={theme} setTheme={setTheme} />

            <h1 id="credits-title">Meet The LFG Team</h1>

            <div id="credit-members-container">
                <div className='lfg-contributor'>
                    <img className='project-contributor-profile' src="assets/creditProfiles/Weez.png" />
                    <div className='project-contributor-info'>
                        <h2 className='team-member-name'>Weez</h2>
                        <p className='team-member-role'>Supervisor/Project Lead</p>
                    </div>
                </div>

                <div className='lfg-contributor'>
                    <img className='project-contributor-profile' src="assets/creditProfiles/BG.png" />
                    <div className='project-contributor-info'>
                        <h2 className='team-member-name'>Ben Gomez</h2>
                        <p className='team-member-role'>Front-End Developer</p>
                    </div>
                </div>

                <div className='lfg-contributor'>
                    <img className='project-contributor-profile' src="assets/creditProfiles/CM.png" />
                    <div className='project-contributor-info'>
                        <h2 className='team-member-name'>Charlie Mendes</h2>
                        <p className='team-member-role'>Back-End Developer</p>
                    </div>
                </div>

                <div className='lfg-contributor'>
                    <img className='project-contributor-profile' src="assets/creditProfiles/JF.png" />
                    <div className='project-contributor-info'>
                        <h2 className='team-member-name'>James Feng</h2>
                        <p className='team-member-role'>Back-End Developer</p>
                    </div>
                </div>

                <div className='lfg-contributor'>
                    <img className='project-contributor-profile' src="assets/creditProfiles/JoD.png" />
                    <div className='project-contributor-info'>
                        <h2 className='team-member-name'>Joseph Dunne</h2>
                        <p className='team-member-role'>Front-End Developer</p>
                    </div>
                </div>

                <div className='lfg-contributor'>
                    <img className='project-contributor-profile' src="assets/creditProfiles/JuD.png" />
                    <div className='project-contributor-info'>
                        <h2 className='team-member-name'>Judy Derrick</h2>
                        <p className='team-member-role'>UI/UX Designer</p>
                    </div>
                </div>

                <div className='lfg-contributor'>
                    <img className='project-contributor-profile' src="assets/creditProfiles/KA.png" />
                    <div className='project-contributor-info'>
                        <h2 className='team-member-name'>Kaelynn Amodia</h2>
                        <p className='team-member-role'>UI/UX Designer</p>
                    </div>
                </div>

                <div className='lfg-contributor'>
                    <img className='project-contributor-profile' src="assets/creditProfiles/TD.png" />
                    <div className='project-contributor-info'>
                        <h2 className='team-member-name'>Trevor Dunn</h2>
                        <p className='team-member-role'>UI/UX Designer</p>
                    </div>
                </div>
            </div>

            <h1 id="credits-title">Meet The OGs</h1>

            <div id="credit-members-container">
                {Object.keys(ogMembers).map((name) => (
                    <div className='og-lfg-contributor'>
                        <div className='project-contributor-info'>
                            <h2 className='team-member-name'>{name}</h2>
                            <p className='team-member-role'>{ogMembers[name]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Credits;