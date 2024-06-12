import {useState} from 'react';

export const DiscoverButton = ({children, isActive}) => {
    let [buttonClassName, setButtonClassName] = useState(isActive ? "discover-button-active": "discover-button-inactive");

    return (
        <button className={buttonClassName}>{children}</button>
    );
}