import React, { useEffect, useState } from 'react';
import { setTheme } from '../functions/darkMode';

function Toggle({setIdName}) {
    const lightLabel = "color mode toggle, light mode";
    const darkLabel = "color mode toggle, dark mode";

    const [active, setActive] = useState(true);

    const [ariaActive, setAriaActive] = useState(false);
    const [ariaLabel, setAriaLabel] = useState(lightLabel);
    const theme = localStorage.getItem('theme');

    const changeThemeAndToggle = () => {
        if (localStorage.getItem('theme') === 'theme-light') {
            setTheme('theme-dark', setIdName);
            setActive(true);
            setAriaActive(false);
            setAriaLabel(darkLabel);
        }
        else {
            setTheme('theme-light', setIdName);
            setActive(false);
            setAriaActive(true);
            setAriaLabel(lightLabel);
        }
    };

    useEffect(() => {
        if (theme === 'theme-light') {
            setActive(true);
            setAriaActive(false);
            setAriaLabel(lightLabel);
        }
        else if (theme === 'theme-dark') {
            setActive(false);
            setAriaActive(true);
            setAriaLabel(darkLabel);
        }
    }, [theme]);

    return (
        <div className='toggle-container'>
            <input aria-checked={ariaActive} type='checkbox' id='toggle' className='toggle-checkbox' onClick={changeThemeAndToggle} checked={active} readOnly />
            <label htmlFor='toggle' className='toggle-label' aria-label={ariaLabel}>
                <span className='toggle-label-switch'></span>
            </label>
        </div>
    );
}

export default Toggle;

// Source: https://github.com/abbeyperini/Portfolio2.0 