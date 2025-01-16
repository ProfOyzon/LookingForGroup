import '../Styles/pages.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import MakeAvatarModal from "../AvatarCreation/MakeAvatarModal";
import ChooseSkills from "../SignupProcess/ChooseSkills";
// import ChooseProficiencies from "../SignupProcess/ChooseProficiencies";
import ChooseInterests from "../SignupProcess/ChooseInterests";
import CompleteProfile from "../SignupProcess/CompleteProfile";
import GetStarted from "../SignupProcess/GetStarted";
import { sendPost } from "../../functions/fetch";

const SignUp = ({ theme, setAvatarImage, avatarImage, profileImage, setProfileImage }) => {
    const navigate = useNavigate(); // Hook for navigation

    // State variables
    const [firstName, setFirstName] = useState(''); // State variable for the user's first name
    const [lastName, setLastName] = useState(''); // State variable for the user's last
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState(''); // second password input to check if they match
    const [message, setMessage] = useState(''); // State variable for messages

    // State variables for modals
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showSkillsModal, setShowSkillsModal] = useState(false);
    // const [showProficienciesModal, setShowProficienciesModal] = useState(false);
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
    const [showGetStartedModal, setShowGetStartedModal] = useState(false);

    // State variables for selected buttons
    // to remeber the user's choices when they go back and forth between modals
    // const [selectedProficiencies, setSelectedProficiencies] = useState<string[]>([]); // State variable for the selected proficiencies
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // State variable for the selected skills
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // State variable for the selected interests
    const [pronouns, setPronouns] = useState(''); // State variable for the user's pronouns
    const [bio, setBio] = useState(''); // State variable for the user's bio

    // user info to be sent to the backend
    const userInfo = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        // proficiencies: selectedProficiencies,
        skills: selectedSkills,
        interests: selectedInterests,
        pronouns: pronouns,
        bio: bio,
        avatarImage: avatarImage,
        profileImage: profileImage, // if they upload their own image
    };

    // check theme and set the theme icon
    useEffect(() => {
        const themeIcon = document.getElementsByClassName('theme-icon');
        for (let i = 0; i < themeIcon.length; i++) {
            const icon = themeIcon[i] as HTMLImageElement;
            const src = themeIcon[i].getAttribute('src-' + theme) || 'default-' + theme + '-src.png';
            icon.src = src;
        }
    }, [theme]);

    // Function to handle the login button click
    const handleSignup = async () => {
        // Check if any of the fields are empty
        if (email === '' || password === '' || confirm === '' || firstName === '' || lastName === '' || username === '') {
            setMessage('Please fill in all information');
        }
        else {
            // check if email is valid
            if (!email.includes('rit.edu')) {
                setMessage("Not an RIT email");
            }

            // check if the passwords match
            if (password !== confirm) {
                setMessage('Passwords do not match');

                return false;
            }
            else {
                // Send info to begin account activation
                await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email: email,
                    password: password,
                    confirm: confirm,
                    firstName: firstName,
                    lastName: lastName,
                    username: username
                    }),
                });
                setMessage('An account activation email has been sent');
            }
        }


    };

    // Render the sign up page
    return (
        <div className="background-cover">
            <div className="login-signup-container">
                {/*************************************************************

                    Signup Form inputs

                *************************************************************/}
                <div className="signup-form column">
                    <h2>Sign Up</h2>

                    <div className="signup-form-inputs">
                        <div className="error">{message}</div>
                        <div className="row">
                            <input
                                className="signup-name-input"
                                autoComplete="off"
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                className="signup-name-input"
                                autoComplete="off"
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <input
                            className="signup-input"
                            autoComplete="off"
                            type="text"
                            placeholder="School e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <span className="spacer"> </span>

                        <input
                            className="signup-input"
                            autoComplete="off"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            className="signup-input"
                            autoComplete="off"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            className="signup-input"
                            autoComplete="off"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                        <div className="mobile-login">
                            <p>Already have an account? </p>
                            <p id="login-btn-mobile" onClick={() => navigate(paths.routes.LOGIN)}>Log In</p>
                        </div>

                    </div>


                    <button id="main-loginsignup-btn" onClick={handleSignup}>Sign Up</button>

                    {/*************************************************************

                        Modals for the sign up process

                    *************************************************************/}

                    {/* <ChooseProficiencies
                        onNext={() => { setShowProficienciesModal(false); setShowSkillsModal(true); }}
                        onBack={() => { setShowProficienciesModal(false); }}
                        show={showProficienciesModal}
                        selectedProficiencies={selectedProficiencies}
                        setSelectedProficiencies={setSelectedProficiencies}
                    /> */}

                    <ChooseSkills
                        onNext={() => { setShowSkillsModal(false); setShowInterestsModal(true); }}
                        onBack={() => { setShowSkillsModal(false); }} // if we are using the proficiencies modal, add setShowProficienciesModal(true); to the end
                        show={showSkillsModal}
                        selectedSkills={selectedSkills}
                        setSelectedSkills={setSelectedSkills}
                        mode="signup"
                        onClose={() => { setShowSkillsModal(false); }}
                    />

                    <ChooseInterests
                        onNext={() => { setShowInterestsModal(false); setShowAvatarModal(true); }}
                        onBack={() => { setShowInterestsModal(false); setShowSkillsModal(true); }}
                        show={showInterestsModal}
                        selectedInterests={selectedInterests}
                        setSelectedInterests={setSelectedInterests}
                        mode="signup"
                        onClose={() => { setShowInterestsModal(false); }}
                    />

                    <MakeAvatarModal
                        mode="signup"
                        onBack={() => { setShowAvatarModal(false); setShowInterestsModal(true); }}
                        onNext={() => { setShowAvatarModal(false); setShowCompleteProfileModal(true); }}
                        show={showAvatarModal}
                        onClose={() => { setShowAvatarModal(false); }}
                        setAvatarImage={setAvatarImage}
                    />

                    <CompleteProfile
                        onNext={() => { setShowCompleteProfileModal(false); setShowGetStartedModal(true); }}
                        onBack={() => { setShowCompleteProfileModal(false); setShowAvatarModal(true); }}
                        show={showCompleteProfileModal}
                        avatarImage={avatarImage}
                        userInfo={userInfo}
                        bio={bio}
                        pronouns={pronouns}
                        setBio={setBio}
                        setPronouns={setPronouns}
                        profileImage={profileImage}
                        setProfileImage={setProfileImage}
                    />

                    <GetStarted
                        show={showGetStartedModal}
                        onBack={() => { setShowGetStartedModal(false); setShowCompleteProfileModal(true); }}
                        onCreateProject={() => { setShowGetStartedModal(false); navigate(paths.routes.MYPROJECTS); }}
                        onJoinProject={() => { setShowGetStartedModal(false); navigate(paths.routes.HOME); }}
                    />
                </div>
                {/*************************************************************

                    Welcome Directory

                *************************************************************/}
                <div className="directory column">
                    {/* <h1>Welcome!</h1>
                    <p>Already have an account?</p> */}
                    <img src="assets/bannerImages/signup_dark.png"
                        src-light="assets/bannerImages/signup_light.png"
                        src-dark="assets/bannerImages/signup_dark.png"
                        alt=""
                        className="theme-icon" />
                    <button onClick={() => navigate(paths.routes.LOGIN)}>Log In</button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
