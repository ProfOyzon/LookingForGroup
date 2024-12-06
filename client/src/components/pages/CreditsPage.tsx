import "./pages.css";
import "../Styles/styles.css";
import { useState } from 'react';
import { Header } from "../Header";

const Credits = ({ theme, setTheme }) => {
    // THINGS TO DO:
    // ADD A LIST OF ALL OF US 
    // MAKE PAGE MOBILE FRIENDLY 
    // MAKE ACCESS TO PAGE MOBILE FRIENDLY 
    // MIGHT WANT TO RETOOL HOW THE TOGGLING OF THE CREDITS PAGE WORKS (MAYBE, IDK) 
    // MORE (PROBABLY) 

    return (
        <div className='page' id="my-projects">
            <Header dataSets={[]} onSearch={[]} theme={theme} setTheme={setTheme} />

            <h1 id="credits-title">Meet The LFG Team</h1>

            <div id="credit-members-container">
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
        </div>
    );
};

export default Credits;