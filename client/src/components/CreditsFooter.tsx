import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";
import { useSelector } from 'react-redux';

const CreditsFooter = () => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint = useSelector((state: any) => state.page.MOBILE_BREAKPOINT);

    // Hook for navigation 
    const navigate = useNavigate();

    // State to manage whether or not the credits page is being shown 
    const [isCredits, setIsCredits] = useState(false);

    // function to handle the toggling of the credits page 
    const toggleCredits = (isShown, path) => {
        setIsCredits(isShown);
        navigate(path); // Navigate to the specified path 
    };

    React.useEffect(() => {
        window.addEventListener('resize', () => setWidth(window.innerWidth));
    })

    // Mobile layout 
    if (width < breakpoint) {
        // ---CODE GOES HERE--- 
    }

    // Desktop layout 
    return (
        <div>
            <div className="FooterContainer">
                <button className={isCredits === true ? 'shown' : ''} onClick={() => toggleCredits(true, paths.routes.CREDITS)}>
                    Credits
                </button>
            </div>
        </div>
    );
};

export default CreditsFooter;