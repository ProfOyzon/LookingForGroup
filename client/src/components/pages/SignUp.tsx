import "./pages.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import MakeAvatarModal from "../AvatarCreation/MakeAvatarModal";
import ChooseSkills from "../SignupProcess/ChooseSkills";
import ChooseProficiencies from "../SignupProcess/ChooseProficiencies";
import ChooseInterests from "../SignupProcess/ChooseInterests";
import CompleteProfile from "../SignupProcess/CompleteProfile";

const SignUp = ({ setAvatarImage, avatarImage }) => {
    const navigate = useNavigate(); // Hook for navigation

    // State variables
    const [firstName, setFirstName] = useState(''); // State variable for the user's first name
    const [lastName, setLastName] = useState(''); // State variable for the user's last
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [error, setError] = useState('');
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showSkillsModal, setShowSkillsModal] = useState(false);
    const [showProficienciesModal, setShowProficienciesModal] = useState(false);
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);

    // Function to handle the login button click
    const handleSignup = () => {
        // Check if the email and password are not empty
        if (email === '' || password === '' || firstName === '' || lastName === '' || username === '') {
            setError('Please fill in all information');
        } else {
            // check if email is valid

            // check if username is unique (??? depends on if we want unique usernames)

            // check if the passwords match
            if (password !== checkPassword) {
                setError('Passwords do not match');
            } else {
                // show the proficiencies modal
                // from the modal links through the process
                // profficiencies -> skills -> interests -> avatar -> complete profile --> home
                setShowProficienciesModal(true);
            }
        }

        // setShowProficienciesModal(true);
    };

    return (
        <div className="background-cover">
            <div className="login-signup-container">
                <div className="directory column">
                    <h1>Welcome!</h1>
                    <p>Already have an account?</p>
                    <button onClick={() => navigate(paths.routes.LOGIN)}>Log In</button>
                </div>
                <div className="signup-form column">
                    <h2>Sign Up</h2>

                    <div className="signup-form-inputs">
                    <div className="error">{error}</div>
                        <div className="row">
                            <input
                                className="signup-name-input"
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                className="signup-name-input"
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <input
                            className="signup-input"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <span className="spacer"> </span>

                        <input
                            className="signup-input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            className="signup-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            className="signup-input"
                            type="password"
                            placeholder="Confirm Password"
                            value={checkPassword}
                            onChange={(e) => setCheckPassword(e.target.value)}
                        />
                        <div className="mobile-login">
                            <p>Already have an account? </p>
                            <p id="login-btn-mobile" onClick={() => navigate(paths.routes.LOGIN)}>Log In</p>
                        </div>

                    </div>


                    <button id="main-loginsignup-btn" onClick={handleSignup}>Sign Up</button>

                    {/* Modals */}

                    <ChooseProficiencies
                        onNext={() => { setShowProficienciesModal(false); setShowSkillsModal(true); }}
                        onBack={() => { setShowProficienciesModal(false); }}
                        show={showProficienciesModal}
                    />

                    <ChooseSkills
                        onNext={() => { setShowSkillsModal(false); setShowInterestsModal(true); }}
                        onBack={() => { setShowSkillsModal(false); setShowProficienciesModal(true); }}
                        show={showSkillsModal}
                    />

                    <ChooseInterests
                        onNext={() => { setShowInterestsModal(false); setShowAvatarModal(true); }}
                        onBack={() => { setShowInterestsModal(false); setShowSkillsModal(true); }}
                        show={showInterestsModal}
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
                        onNext={() => { setShowCompleteProfileModal(false); navigate(paths.routes.HOME); }}
                        onBack={() => { setShowCompleteProfileModal(false); setShowAvatarModal(true); }}
                        show={showCompleteProfileModal}
                        avatarImage={avatarImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
