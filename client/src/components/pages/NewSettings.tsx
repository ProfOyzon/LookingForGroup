import '../Styles/pages.css';

import { Dropdown, DropdownButton, DropdownContent } from '../Dropdown';
import { sendPost, fetchUserID, sendDelete } from '../../functions/fetch';
import { Popup, PopupButton, PopupContent } from '../Popup';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ThemeIcon } from '../ThemeIcon';
import { useNavigate } from 'react-router-dom';
import { useId, useState, useContext, useLayoutEffect } from 'react';
import { Header } from '../Header';
import CreditsFooter from '../CreditsFooter';
import PasswordValidator from 'password-validator';
import ToTopButton from '../ToTopButton';
import * as paths from '../../constants/routes';

// Take the user ID and delete it
const deleteAccountPressed = async () => {
  // console.log('Delete Pressed!');
  const userID = await fetchUserID();
  await sendDelete(`/api/users/${userID}`, async () => {
    await sendPost('/api/logout');
  });
};

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
  const [themeOption, setThemeOption] = useState(theme === 'dark' ? 'Dark Mode' : 'Light Mode');
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

      if (data.status === 200 && data.data[0] !== undefined) {
        setUserInfo(data.data[0]);
      }
    }

    // Don't call API again even if user isn't logged in
    setDataLoaded(true);
  };

  // Uses stateful variable to only run once at initial render
  if (!dataLoaded) {
    getUserData();
  }

  // If user is not logged in, redirect to login page
  if (userInfo === undefined) {
     navigate(paths.routes.LOGIN, { state: { from: location.pathname } })
  }

  // --------------------
  // Components:
  // --------------------

  // Confirmation for changed settings
  const ConfirmChange = ({ type, prev = '', cur = '', apiParams, setError, setSuccess }) => {
    return (
      <div className="small-popup">
        <h3>Edit {type}</h3>
        <p className="confirm-msg">
          Are you sure you want to change your {type.toLowerCase()}
          {type.toLowerCase() === 'phone' ? (
            <span> number</span>
          ) : (
            <></>
          )}
          {prev !== '' ? (
            <span>
              &#32;from{' '}
              <span className="confirm-change-item">{type === 'Username' ? `@${prev}` : prev}</span>
            </span>
          ) : (
            <></>
          )}
          {cur !== '' ? (
            <span>
              &#32;to{' '}
              <span className="confirm-change-item">{type === 'Username' ? `@${cur}` : cur}</span>
            </span>
          ) : (
            <></>
          )}
          ?
        </p>
        <div className="confirm-deny-btns">
          <PopupButton
            className="confirm-btn"
            callback={async () => {
              // Displays success message on parent popup
              const onSuccess = (status) => {
                // Feedback popup
                setSuccess(`Your ${type.toLowerCase()} has been updated!`);
              };

              const typeToChange = type === 'Primary Email' ? 'email' : type.toLowerCase();
              const url = `/api/users/${userInfo.user_id}/${typeToChange}`;
              const response = await sendPut(url, apiParams, onSuccess);

              // If it returns back with an error, display it on parent popup
              if (response !== undefined && response.error) {
                setError(response.error);
              }
            }}
          >
            Submit
          </PopupButton>
          <PopupButton className="deny-btn">Cancel</PopupButton>
        </div>
      </div>
    );
  };

  // User form for changing username/password/email
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
        return <></>;
      } else {
        return (
          <div className="pass-reqs">
            <h4>Password Requirements</h4>
            <ul>
              {missingReqs.map((req) => {
                return <li>{req.message}</li>;
              })}
            </ul>
          </div>
        );
      }
    };

    // Set up params to be correctly passed into API
    const apiParams = { confirm, password };
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
      <div
        className="small-popup"
        onClick={() => {
          if (successMsg !== '') {
            setSuccess('');

            // Update userInfo properly
            if (type !== 'Password') {
              // Create deep copy of object, make changes, then call state update
              const tempInfo = { ...userInfo };
              tempInfo[type.replace(' ', '_').toLowerCase()] = firstParam;

              setUserInfo(tempInfo);
            }
          }
        }}
      >
        <h3>Edit {type}</h3>
        {type === 'Password' ? <PasswordChecker pass={firstParam} /> : <></>}
        <div className="error">{errorMsg}</div>
        {errorMsg === '' && successMsg !== '' ? <div className="success">{successMsg}</div> : <></>}
        <hr />
        <div className="input-fields">
          <div className="input-container">
            {/* autoComplete to prevent browser autofill */}
            <form autoComplete="off">
              <input
                placeholder={`Enter new ${type.toLowerCase()}${type.toLowerCase() === 'phone' ? ' number' : ''}`}
                type={type !== 'Password' ? 'text' : 'password'}
                onChange={(e) => setFirstParam(e.target.value)}
                onBlur={async () => {
                  // TO-DO: Check if already in use if username
                  // or primary email address. Excludes password
                  if (type !== 'Password') {
                    const url = `/api/users/search-${type === 'Username' ? 'username' : 'email'}/${firstParam}`;
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.data.length > 0) {
                      setError(`*${type} is already in use.`);
                    }
                  }
                }}
              />
            </form>
          </div>
          <div className="input-container">
            {/* autoComplete to prevent browser autofill */}
            <form autoComplete="off">
              <input
                placeholder={`Confirm new ${type.toLowerCase()}${type.toLowerCase() === 'phone' ? ' number' : ''}`}
                type={type !== 'Password' ? 'text' : 'password'}
                onChange={(e) => {
                  setConfirm(e.target.value);

                  if (firstParam !== e.target.value) {
                    setError(`*${type}s must match.`);
                  } else {
                    setError('');
                  }
                }}
              />
            </form>
          </div>
          <div className="input-container">
            {/* autoComplete to prevent browser autofill */}
            <form autoComplete="off">
              <input
                placeholder="Current password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div className="confirm-deny-btns">
          <Popup>
            <PopupButton className="confirm-btn">Submit</PopupButton>
            <PopupContent>
              <ConfirmChange
                type={type}
                prev={type === 'Username' ? userInfo.username : ''}
                cur={type !== 'Password' ? firstParam : ''}
                apiParams={apiParams}
                setError={setError}
                setSuccess={setSuccess}
              />
            </PopupContent>
          </Popup>
          <PopupButton className="deny-btn">Cancel</PopupButton>
        </div>
      </div>
    );
  };

  // Makes request to API to update user's visibility
  // Visibility num corresponds to private vs public
  // 0 - private
  // 1 - public
  const updateVisibility = async (visibilityNum) => {
    // Don't run if the value hasn't changed
    if (visibilityNum !== userInfo.visibility) {
      const url = `/api/users/${userInfo.user_id}/visibility`;
      const response = await sendPut(url, { newVisibility: visibilityNum });

      if (response !== undefined && response.error) {
        console.log(response.error);
      } else {
        // Update userInfo with newly updated visibility value
        const tempInfo = { ...userInfo };
        tempInfo.visibility = visibilityNum;
        setUserInfo(tempInfo);
      }
    }
  };

  return (
    <div className="page" style={{ position: 'relative' }}>
      {/* Top-right profile dropdown */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 30,
          zIndex: 1000,
        }}
      ></div>

      {/* Search bar is not used in settings */}
      <div id="settings-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="page-title">Settings</h1>
          <Header hideSearchBar />
        </div>
        <hr />
        {userInfo === undefined ? (
          <p>You aren't logged in!</p>
        ) : (
          <div>
            {/* Top Row: Personal and Email Settings */}
            <div className="settings-row">
              {/* Personal Settings */}
              <div className="settings-column">
                <h2 className="settings-header">Personal</h2>
                <div className="subsection">
                  <label htmlFor="option-username">Username</label>
                  <div className="input-container">
                    <input
                      id="option-username"
                      placeholder={`@${userInfo.username}`}
                      type="text"
                      disabled
                    />
                    <Popup>
                      <PopupButton className="interact-option">Edit</PopupButton>
                      <PopupContent>
                        <ChangeForm type={'Username'} />
                      </PopupContent>
                    </Popup>
                  </div>
                </div>
                <div className="subsection">
                  <label htmlFor="option-password">Password</label>
                  <div className="input-container">
                    <input
                      id="option-password"
                      placeholder="●●●●●●●●●●●●●●●●●●●●"
                      type="password"
                      disabled
                    />
                    <Popup>
                      <PopupButton className="interact-option">Edit</PopupButton>
                      <PopupContent>
                        <ChangeForm type={'Password'} />
                      </PopupContent>
                    </Popup>
                  </div>
                </div>
              </div>
              {/* Email Settings */}
              <div className="settings-column">
                <h2 className="settings-header">Emails</h2>
                <div className="subsection">
                  <label htmlFor="option-primary-email">Primary Email</label>
                  <div className="input-container">
                    <input
                      id="option-primary-email"
                      placeholder={userInfo.primary_email}
                      type="text"
                      disabled
                    />
                    <Popup>
                      <PopupButton className="interact-option">Edit</PopupButton>
                      <PopupContent>
                        <ChangeForm type={'Primary Email'} />
                      </PopupContent>
                    </Popup>
                  </div>
                </div>
                <div className="subsection">
                  <label htmlFor="option-rit-email">RIT Email</label>
                  <div className="input-container disabled">
                    <input
                      id="option-rit-email"
                      placeholder={userInfo.rit_email}
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Phone Settings */}
              <div className="settings-column">
                <h2 className="settings-header">Contact</h2>
                <div className="subsection">
                  <label htmlFor="option-primary-phone">Phone Number</label>
                  <div className="input-container">
                    <input
                      id="option-primary-phone"
                      placeholder={'111-111-1111'}
                      type="text"
                      disabled
                    />
                    <Popup>
                      <PopupButton className="interact-option">Edit</PopupButton>
                      <PopupContent>
                        <ChangeForm type={'Phone'} />
                      </PopupContent>
                    </Popup>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: Appearance and Account Visibility */}
            <div className="settings-row">
              {/* Appearance */}
              <div className="settings-column">
                <h2 className="settings-header">Appearance</h2>
                <div className="subsection">
                  <label htmlFor="option-theme">Current Theme</label>
                  <Dropdown>
                    <DropdownButton buttonId="options-theme-btn">
                      <div className="input-container">
                        <input id="option-theme" placeholder={themeOption} type="text" disabled />
                        <ThemeIcon
                          light={'/assets/dropdown_light.png'}
                          dark={'/assets/dropdown_dark.png'}
                          alt={'Current Theme'}
                          addClass={'options-dropdown-parent-btn'}
                        />
                      </div>
                    </DropdownButton>
                    <DropdownContent>
                      <div id="options-theme-dropdown">
                        <DropdownButton
                          className="options-dropdown-button start"
                          callback={(e) => {
                            setTheme('light');
                            setThemeOption(e.target.innerText);
                          }}
                        >
                          <i className="fa-solid fa-sun"></i>
                          Light Mode
                        </DropdownButton>
                        <DropdownButton
                          className="options-dropdown-button"
                          callback={(e) => {
                            setTheme('dark');
                            setThemeOption(e.target.innerText);
                          }}
                        >
                          <i className="fa-solid fa-moon"></i>
                          Dark Mode
                        </DropdownButton>
                        <DropdownButton
                          className="options-dropdown-button end"
                          callback={(e) => {
                            // Checks for system theme preference
                            if (
                              window.matchMedia &&
                              window.matchMedia('(prefers-color-scheme: dark)').matches
                            ) {
                              setTheme('dark');
                            } else if (
                              window.matchMedia &&
                              window.matchMedia('(prefers-color-scheme: light)').matches
                            ) {
                              setTheme('light');
                            }
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
              <div className="settings-column">
                <h2 className="settings-header">Account Visibility</h2>
                <div className="subsection">
                  <label htmlFor="option-theme">Who can view you</label>
                  <Dropdown>
                    <DropdownButton buttonId="options-visibility-btn">
                      <div className="input-container">
                        <input
                          id="option-theme"
                          placeholder={
                            userInfo.visibility === 1 ? 'Public Account' : 'Private Account'
                          }
                          type="text"
                          disabled
                        />
                        <ThemeIcon
                          light={'/assets/dropdown_light.png'}
                          dark={'/assets/dropdown_dark.png'}
                          alt={'Visibility'}
                          addClass={'options-dropdown-parent-btn'}
                        />
                      </div>
                    </DropdownButton>
                    <DropdownContent>
                      <div id="options-visibility-dropdown">
                        <DropdownButton
                          className="options-dropdown-button start"
                          callback={(e) => {
                            updateVisibility(1);
                          }}
                        >
                          <i className="fa-solid fa-eye"></i>
                          Public Account
                        </DropdownButton>
                        <DropdownButton
                          className="options-dropdown-button end"
                          callback={(e) => {
                            updateVisibility(0);
                          }}
                        >
                          <i className="fa-solid fa-user"></i>
                          Private Account
                        </DropdownButton>
                      </div>
                    </DropdownContent>
                  </Dropdown>
                </div>
                {/* Account Deletion */}
                <div className="subsection">
                  <Popup>
                    <PopupButton className="delete-button">Delete Account</PopupButton>
                    <PopupContent>
                      <div className="delete-user-title">Delete Account</div>
                      <div className="delete-user-extra-info">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </div>
                      <div className="delete-user-button-pair">
                        <button className="delete-button" onClick={deleteAccountPressed}>
                          Delete
                        </button>
                        <PopupButton buttonId="cancel-button" className="button-reset">
                          Cancel
                        </PopupButton>
                      </div>
                    </PopupContent>
                  </Popup>
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
