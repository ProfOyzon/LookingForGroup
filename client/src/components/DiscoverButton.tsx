import {useState, useEffect} from 'react';

export const DiscoverButton = ({children, isActive, onClick}) => {
    let [buttonClassName, setButtonClassName] = useState(isActive ? "discover-button-active": "discover-button-inactive");
    useEffect(() => {
        if(isActive){
            setButtonClassName('discover-button-active');
        }else{
            setButtonClassName('discover-button-inactive');
        }
    }, [onClick]);

    return (
        <button className={buttonClassName} onClick={onClick}>{children}</button>
    );
}