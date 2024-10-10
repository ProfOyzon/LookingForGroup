import {useEffect, useState, createContext, useContext, useRef} from 'react';
//This is a reusable component that can be used to create dropdown menus and windows
//This article was used to help create this component:
//https://www.codemzy.com/blog/reactjs-dropdown-component

//To use this component, import all components that are exported in this file
//In your html, make a <Dropdown> component where you want your dropdown to be
//Inside this <Dropdown> component, add a <DropdownButton> and <DropdownContent> component
//Inside the <DropdownButton>, you can add any text you want to help signify what the dropdown will contain
//Additionally, you can set a buttonId attribute in the <DropdownButton> component if you want to add an id to the button
//Place the main content of the dropdown within the <DropdownContent> component; this can be anything you want
//Below is a full example of what a full <Dropdown> component should look like
/*
<Dropdown>
  <DropdownButton buttonId='custom-dropdown-button'>My dropdown menu</DropdownButton>
  <DropdownContent>
    Welcome to my dropdown menu! <button>Here's a button to use</button>
  </DropdownContent>
</Dropdown>
*/
//Classes for the <DropdownButton> component are not implemented yet, but can be if necessary (let Joseph Dunne know)

//Context that will be shared through all components in dropdown
//Contains info on whether the dropdown is open or not
const DropdownContext = createContext({
  open: false,
  setOpen: () => {},
});

//Button component that will open/close dropdown
export const DropdownButton = ({children, buttonId}) => {
  const { open, setOpen } = useContext(DropdownContext);

  const toggleOpen = () => {
    setOpen(!open);
  }

  return(
    <button id={buttonId} onClick={toggleOpen}>{children}</button>
  )
}

export const DropdownContent = ({children}) => {
  const { open } = useContext(DropdownContext);

  if (open) {
    return (
      <div className='dropdown'>
        {children}
      </div>
    )
  } else {
    return(
      <></>
    )
  }
  
}

//Full dropdown component
export const Dropdown = ({children}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {

    let close = (e) => {
      if (!dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener('click', close);
      console.log('closing');
    }

    return () => {
      window.removeEventListener('click', close)
    };
  }, [open]);

  return(
    <DropdownContext.Provider value={{open, setOpen}}>
      <div ref={dropdownRef}>{children}</div>
    </DropdownContext.Provider>
  )
}