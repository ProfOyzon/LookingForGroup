import '../Styles/pages.css';

import { Dropdown, DropdownButton, DropdownContent } from '../Dropdown';
import { sendPut } from '../../functions/fetch';
import { Popup, PopupButton, PopupContent } from '../Popup';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ThemeIcon } from '../ThemeIcon';
import { useNavigate } from 'react-router-dom';
import { useId, useState, useContext, useLayoutEffect } from 'react';
import CreditsFooter from '../CreditsFooter';
import PasswordValidator from 'password-validator';
import ToTopButton from '../ToTopButton';

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

    // Stateful variables responsible for displaying settings
    const [themeOption, setThemeOption] = useState((theme === 'dark' ? 'Dark Mode' : 'Light Mode'));
    const [visibilityOption, setVisibilityOption] = useState('Public Account');

    // --------------------
    // Helper functions
    // --------------------
    // Checks if user is logged in and pulls all relevant data
    const getUserData = async () => {
        const authResponse = await fetch('/api/auth');
        const authData = await authResponse.json();

        // User is logged in, pull their data
        if (authData.status === 200) {
            const infoURL = `/api/users/${authData.data}/account`;
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

    // --------------------
    // Components
    // --------------------
    const ConfirmChange = ({ type, prev = '', cur = '', apiParams, setError, setSuccess }) => {
        return (
            <div className='small-popup'>
                <h3>Edit {type}</h3>
                <p className='confirm-msg'>
                    Are you sure you want to change your {type.toLowerCase()}
                    {(prev !== '') ? <span>
                        &#32;from <span className='confirm-change-item'>
                            {(type === 'Username') ? `@${prev}` : prev}
                            </span>
                    </span> : <>
                    </>}
                    {(cur !== '') ? <span>
                        &#32;to <span className='confirm-change-item'>
                            {(type === 'Username') ? `@${cur}` : cur}
                            </span>
                    </span> : <>
                    </>}?
                </p>
                <div className='confirm-deny-btns'>
                    <PopupButton
                        className='confirm-btn'
                        callback={async () => {
                            // Displays success message on parent popup
                            const onSuccess = (status) => setSuccess(`Your ${type.toLowerCase()} has been updated!`);

                            const typeToChange = (type === 'Primary Email') ? 'email' : type.toLowerCase();
                            const url = `/api/users/${userInfo.user_id}/${typeToChange}`;
                            const response = await sendPut(url, apiParams, onSuccess);

                            // If it returns back with an error, display it on parent popup
                            if (response !== undefined && response.error) {
                                setError(response.error);
                            }
                        }}
                    >Submit</PopupButton>
                    <PopupButton className='deny-btn'>Cancel</PopupButton>
                </div>
            </div>
        );
    };

    const ChangeForm = ({ type }) => {
        // Variables
        const [errorMsg, setError] = useState('');
        const [successMsg, setSuccess] = useState('');

        // Name of first param changes based on type for API request.
        // Latter two fields do not change in name
        const [firstParam, setFirstParam] = useState('');
        const [confirm, setConfirm] = useState('');
        const [password, setPassword] = useState('');

        // Check password qualtiy, if attempting to change password
        const PasswordChecker = ({ pass }) => {
            const [missingReqs, setMissingReqs] = useState([]);

            const schema = new PasswordValidator();
            schema
                .is()
                .min(8, 'Be 8 or more characters')
                .is()
                .max(20, 'Be 20 or less characters')
                .has()
                .uppercase(1, 'Have an uppercase letter')
                .has()
                .lowercase(1, 'Have a lowercase letter')
                .has()
                .digits(1, 'Have a number')
                .has()
                .symbols(1, 'Have a symbol')
                .has()
                .not()
                .spaces(1, 'Have no spaces')
                .has()
                .not('[^\x00-\x7F]+', 'Have no non-ASCII characters');

            useLayoutEffect(() => {
                const output = schema.validate(pass, { details: true });
                setMissingReqs(output);
            }, [pass]);

            if (missingReqs.length === 0) {
                return (<></>);
            } else {
                return (
                    <div className='pass-reqs'>
                        <h4>Password Requirements</h4>
                        <ul>
                            {missingReqs.map((req) => {
                                return (<li>{req.message}</li>);
                            })}
                        </ul>
                    </div>
                );
            }
        };

        // Set up params to be correctly passed into API
        let apiParams = { confirm, password };
        switch (type) {
            case 'Username':
                apiParams['username'] = firstParam;
                break;
            case 'Primary Email':
                apiParams['email'] = firstParam;
                break;
            case 'Password':
                apiParams['newPassword'] = firstParam;
                break;
        }

        return (
            <div className='small-popup' onClick={() => {
                // Removes success message if user clicks on popup
                if ((successMsg !== '')) {
                    setSuccess('');
                }
            }}>
                <h3>Edit {type}</h3>
                {(type === 'Password') ? <PasswordChecker pass={firstParam} /> : <></>}
                <div className='error'>{errorMsg}</div>
                {((errorMsg === '') && (successMsg !== '')) ? (
                    <div className='success'>{successMsg}</div>
                ) : (
                    <></>
                )}
                <hr />
                <div className='input-fields'>
                    <div className='input-container'>
                        <input
                            placeholder={`Enter new ${type.toLowerCase()}`}
                            type={(type !== 'Password') ? 'text' : 'password'}
                            onChange={(e) => setFirstParam(e.target.value)}
                            onBlur={async () => {
                                // TO-DO: Check if already in use if username
                                // or primary email address. Excludes password
                                if (type !== 'Password') {
                                    const url = `/api/users/search-${(type === 'Username') ? 'username' : 'email'}/${firstParam}`;
                                    const response = await fetch(url);
                                    const data = await response.json();

                                    if (data.data.length > 0) {
                                        setError(`*${type} is already in use.`);
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className='input-container'>
                        <input
                            placeholder={`Confirm new ${type.toLowerCase()}`}
                            type={(type !== 'Password') ? 'text' : 'password'}
                            onChange={(e) => {
                                setConfirm(e.target.value);

                                if (firstParam !== e.target.value) {
                                    setError(`*${type}s must match.`);
                                } else {
                                    setError('');
                                }
                            }}
                        />
                    </div>
                    <div className='input-container'>
                        <input
                            placeholder='Current password'
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className='confirm-deny-btns'>
                    <Popup>
                        <PopupButton className='confirm-btn'>Submit</PopupButton>
                        <PopupContent>
                            <ConfirmChange
                                type={type}
                                prev={(type === 'Username') ? userInfo.username : ''}
                                cur={(type !== 'Password') ? firstParam : ''}
                                apiParams={apiParams}
                                setError={setError}
                                setSuccess={setSuccess}
                            />
                        </PopupContent>
                    </Popup>
                    <PopupButton className='deny-btn'>Cancel</PopupButton>
                </div>
            </div>
        );
    };

    return (
        <div className='page'>
            <div id='settings-page'>
                <h1 className='page-title'>Settings</h1>
                <hr />
                {(userInfo === undefined) ? (
                    <p>You aren't logged in!</p>
                ) : (
                    <div>
                        {/* Top Row: Personal and Email Settings */}
                        <div className='settings-row'>
                            {/* Personal Settings */}
                            <div className='settings-column'>
                                <h2 className='settings-header'>Personal</h2>
                                <div className='subsection'>
                                    <label htmlFor='option-username'>Username</label>
                                    <div className='input-container'>
                                        <input
                                            id='option-username'
                                            placeholder={`@${userInfo.username}`}
                                            type='text'
                                            disabled
                                        />
                                        <Popup>
                                            <PopupButton className='interact-option'>Edit</PopupButton>
                                            <PopupContent>
                                                <ChangeForm type={'Username'} />
                                            </PopupContent>
                                        </Popup>
                                    </div>
                                </div>
                                <div className='subsection'>
                                    <label htmlFor='option-password'>Password</label>
                                    <div className='input-container'>
                                        <input
                                            id='option-password'
                                            placeholder='●●●●●●●●●●●●●●●●●●●●'
                                            type='password'
                                            disabled
                                        />
                                        <Popup>
                                            <PopupButton className='interact-option'>Edit</PopupButton>
                                            <PopupContent>
                                                <ChangeForm type={'Password'} />
                                            </PopupContent>
                                        </Popup>
                                    </div>
                                </div>
                            </div>
                            {/* Email Settings */}
                            <div className='settings-column'>
                                <h2 className='settings-header'>Emails</h2>
                                <div className='subsection'>
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
                                                <ChangeForm type={'Primary Email'} />
                                            </PopupContent>
                                        </Popup>
                                    </div>
                                </div>
                                <div className='subsection'>
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
                        {/* Bottom row: Appearance and Account Visibility */}
                        <div className='settings-row'>
                            {/* Appearance */}
                            <div className='settings-column'>
                                <h2 className='settings-header'>Appearance</h2>
                                <div className='subsection'>
                                    <label htmlFor='option-theme'>Current Theme</label>
                                    <Dropdown>
                                        <DropdownButton buttonId='options-theme-btn'>
                                            <div className='input-container'>
                                                <input
                                                    id='option-theme'
                                                    placeholder={themeOption}
                                                    type='text'
                                                    disabled
                                                />
                                                <ThemeIcon
                                                    light={'assets/dropdown_light.png'}
                                                    dark={'assets/dropdown_dark.png'}
                                                    alt={'v'}
                                                    addClass={'options-dropdown-parent-btn'}
                                                />
                                            </div>
                                        </DropdownButton>
                                        <DropdownContent>
                                            <div id='options-theme-dropdown'>
                                                <DropdownButton
                                                    className='options-dropdown-button start'
                                                    callback={(e) => {
                                                        setTheme('light');
                                                        setThemeOption(e.target.innerText);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-sun"></i>
                                                    Light Mode
                                                </DropdownButton>
                                                <DropdownButton
                                                    className='options-dropdown-button'
                                                    callback={(e) => {
                                                        setTheme('dark');
                                                        setThemeOption(e.target.innerText);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-moon"></i>
                                                    Dark Mode
                                                </DropdownButton>
                                                <DropdownButton
                                                    className='options-dropdown-button end'
                                                    callback={(e) => {
                                                        setThemeOption(e.target.innerText);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-gear"></i>
                                                    System Preference
                                                </DropdownButton>
                                            </div>
                                        </DropdownContent>
                                    </Dropdown>
                                </div>
                            </div>
                            {/* Account Visibility */}
                            <div className='settings-column'>
                                <h2 className='settings-header'>Account Visibility</h2>
                                <div className='subsection'>
                                    <label htmlFor='option-theme'>Who can view you</label>
                                    <Dropdown>
                                        <DropdownButton buttonId='options-visibility-btn'>
                                            <div className='input-container'>
                                                <input
                                                    id='option-theme'
                                                    placeholder={visibilityOption}
                                                    type='text'
                                                    disabled
                                                />
                                                <ThemeIcon
                                                    light={'assets/dropdown_light.png'}
                                                    dark={'assets/dropdown_dark.png'}
                                                    alt={'v'}
                                                    addClass={'options-dropdown-parent-btn'}
                                                />
                                            </div>
                                        </DropdownButton>
                                        <DropdownContent>
                                            <div id='options-visibility-dropdown'>
                                                <DropdownButton
                                                    className='options-dropdown-button start'
                                                    callback={(e) => {
                                                        setVisibilityOption(e.target.innerText);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                    Public Account
                                                </DropdownButton>
                                                <DropdownButton
                                                    className='options-dropdown-button end'
                                                    callback={(e) => {
                                                        setVisibilityOption(e.target.innerText);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-user"></i>
                                                    Private Account
                                                </DropdownButton>
                                            </div>
                                        </DropdownContent>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <CreditsFooter />
            <ToTopButton />
        </div>
    );
};

export default Settings;