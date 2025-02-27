import '..Styles/pages.css';

import { Dropdown, DropdownButton, DropdownContent } from '../Dropdown';
import { Popup, PopupButton, PopupContent } from '../Popup';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useId, useState, useContext } from 'react';
import CreditsFooter from '../CreditsFooter';
import ToTopButton from '../ToTopButton';
import { ThemeIcon } from '../ThemeIcon';

const Settings = ({ }) => {
    // --------------------
    // Global variables
    // --------------------
    // Variables regarding pulling user data
    const [dataLoaded, setDataLoaded] = useState(false);
    const [userInfo, setUserInfo] = useState(undefined);

    const navigate = useNavigate();

    // Pull stateful theme variable and setter via context
    const theme = useContext(ThemeContext)['theme'];
    const setTheme = useContext(ThemeContext)['setTheme'];

    // --------------------
    // Helper functions
    // --------------------
    // Checks if user is logged in and pulls all relevant data
    const getUserData = async () => {
        const authResponse = await fetch('/api/auth');
        const authData = await authResponse.json();

        // User is logged in, pull their data
        if (authData.status === 200) {
            const infoURL = `/api/users/${authData.data[0]}/account`;
            const infoResponse = await fetch(infoURL);
            const data = await infoResponse.json();

            if ((data.status === 200) && (data.data[0] !== undefined)) {
                setUserInfo(data.data[0]);
            }
        }

        // Don't call API again even if user isn't logged in
        setDataLoaded(true);
    }

    // Uses stateful variable to only run once at initial render
    if (!dataLoaded) {
        getUserData();
    }

    // Only renders settings if user info is defined. 
    // Shows message that account doesn't exist otherwise
    if (userInfo === undefined) {
        return (
            <div className='page'>
                <h1 className='page-title'>Settings</h1>
                <hr />
                <p>You aren't logged in!</p>
            </div>
        );
    } else {
        return (
            <div className='page'>
                <h1 className='page-title'>Settings</h1>
                <hr />
                <div id='settings-page'>
                    {/* Top row: Personal and Email settings */}
                    <div className='settings-row'>
                        {/* Personal Settings */}
                        <div className='settings-column'>
                            <h2 className='settings-header'>Personal</h2>
                            <div>
                                <label htmlFor='option-username'>Username</label>
                                <div className='input-container'>
                                    <input
                                        id='option-username'
                                        placeholder={`@${userInfo.username}`}
                                        type='text'
                                        disabled
                                    />
                                    <Popup>
                                        <PopupButton className='interact-opton'>Edit</PopupButton>
                                        <PopupContent>
                                            <p>Test!</p>
                                        </PopupContent>
                                    </Popup>
                                </div>
                            </div>
                            <div>
                                <label htmlFor='option-password'>Password</label>
                                <div className='input-container'>
                                    <input
                                        id='option-password'
                                        placeholder='notputtingpasswordhere'
                                        type='password'
                                        disabled
                                    />
                                    <Popup>
                                        <PopupButton className='interact-opton'>Edit</PopupButton>
                                        <PopupContent>
                                            <p>Test!</p>
                                        </PopupContent>
                                    </Popup>
                                </div>
                            </div>
                        </div>
                        {/* Email Settings */}
                        <div className='settings-column'>
                            <h2 className='settings-header'>Emails</h2>
                            <div>
                                <label htmlFor='option-primary-email'>Primary Email</label>
                                <div className='input-container'>
                                    <input
                                        id='option-primary-email'
                                        placeholder={userInfo.primary_email}
                                        type='text'
                                        disabled
                                    />
                                    <Popup>
                                        <PopupButton className='interact-option'>Edit</PopupButton>
                                        <PopupContent>
                                            <p>Test!</p>
                                        </PopupContent>
                                    </Popup>
                                </div>
                            </div>
                            <div>
                                <label htmlFor='option-rit-email'>RIT Email</label>
                                <div className='input-container disabled'>
                                    <input
                                        id='option-rit-email'
                                        placeholder={userInfo.rit_email} 
                                        type='text'
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom row: Appearance and Account Visibility */}
                    <div className='settings-row'>
                        {/* Appearance */}
                        <div className='settings-column'>
                            <h2 className='settings-header'>Appearance</h2>
                            <div>
                                <label htmlFor='option-theme'>Current Theme</label>
                                <div className='input-container'>
                                    <input 
                                        id='option-theme'
                                        placeholder={(theme === 'dark') ? 'Dark Mode' : 'Light Mode'}
                                        type='text'
                                        disabled
                                    />
                                    <Dropdown>
                                        <DropdownButton>
                                            <ThemeIcon 
                                                light={'assets/dropdown_light.png'}
                                                dark={'assets/dropdown_dark.png'}
                                                alt={'v'}
                                                addClass={'interact-option'}
                                            />
                                        </DropdownButton>
                                        <DropdownContent rightAlign={true}>
                                            <div id='options-theme-dropdown'>
                                                <button className='options-theme-dropdown-button'>
                                                    <i className="fa-solid fa-sun"></i>
                                                    Light Mode
                                                </button>
                                                <button className='options-theme-dropdown-button'>
                                                    <i className="fa-solid fa-moon"></i>
                                                    Dark Mode
                                                </button>
                                                <button className='options-theme-dropdown-button'>
                                                    <i className="fa-solid fa-gear"></i>
                                                    System Preference
                                                </button>
                                            </div>
                                        </DropdownContent>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                {/* Repeated end of page components */}
                <CreditsFooter />
                <ToTopButton />
            </div>
        );
    }
};

export default Settings;