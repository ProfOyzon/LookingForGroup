import "./pages.css";
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
    const [checkPassword, setCheckPassword] = useState(''); // second password input to check if they match
    const [error, setError] = useState(''); // State variable for error messages

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
        if (email === '' || password === '' || firstName === '' || lastName === '' || username === '') {
            setError('Please fill in all information');
        }
        else {
            // check if email is valid
            if (!email.includes('rit.edu')) {
                setError("Not an RIT email");
            }

            // check if username is unique (??? depends on if we want unique usernames)

            // Check password requirements
            // TODO: discuss password requirements
            // at least 6 characters long?
            // has a number? 
            // has a special character?
            // has a capital letter?

            // check if the passwords match
            if (password !== checkPassword) {
                setError('Passwords do not match');

                return false;
            }

            else {
                // show the proficiencies modal
                // from the modal links through the process
                // skills -> interests -> avatar -> complete profile --> home
                // At the moment don't think we need proficiencies, 
                // if we decide to add it in later, change the below to setShowProficienciesModal(true)
                // and uncomment all the proficiencies code
                //setShowSkillsModal(true);
                //sendPost("/api/users", {email, username, password, firstName, lastName});

                let bio = "nbasd";
                let skills = ["Creativity"];
                sendPost('/api/users', { username, password, email, firstName, lastName, bio, skills });

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
                        <div className="error">{error}</div>
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
                            value={checkPassword}
                            onChange={(e) => setCheckPassword(e.target.value)}
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
