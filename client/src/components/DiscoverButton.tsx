import {useState, useEffect} from 'react';

//used on the discover page to choose between people and projects
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
        <button className={buttonClassName + " discover-button"} onClick={onClick}>{children}</button>
    );
}