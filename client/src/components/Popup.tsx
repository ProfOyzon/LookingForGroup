import {useState, createContext, useContext} from 'react';
//This is a reusable component that can be used to make popup windows on pages

//To use this component, import all components that are exported in this file
//In your html, make a <Popup> component where you want it to be accessed from
//Inside this <Popup> component, add a <PopupButton> and <PopupContent> component
//Inside the <PopupButton>, you can add any text you want to help signify what the popup will contain
//Additionally, you can set a buttonId attribute in the <PopupButton> component if you want to add an id to the button
//You can also choose to include a function as a 'callback' prop in <PopupButton> if you wish to have it do something else
//Finally, you can even include extra <PopupButton> components inside your <PopupContent> component!
//This can be useful if you want a button that closes your popup & does something else too.
//Place the main content of the popup within the <PopupContent> component; this can be anything you want
//Below is a full example of what a full <Popup> component should look like
/*
<Popup>
  <PopupButton buttonId='custom-popup-button'>My popup</PopupButton>
  <PopupContent>
    Welcome to my popup! <button>Here's a button to use</button>
  </PopupContent>
</Popup>
*/
//Classes for the <PopupButton> component are not implemented yet, but can be if necessary (let Joseph Dunne know)
//Should you wish, you can place a second popup inside an already existing one
//Note that popups can only be closed one at a time currently without some sort of manipulation

//Create context to be used throughout component on popup's visibility state
const PopupContext = createContext({
  open: false,
  setOpen: () => {},
});

//Button component that will open/close the popup
export const PopupButton = ({children, buttonId, callback = () => {}}) => {
  const {open, setOpen} = useContext(PopupContext);

  const toggleOpen = () => {
    callback();
    setOpen(!open);
  }

  return(
    <button id={buttonId} onClick={toggleOpen}>{children}</button>
  )
}

//Main content of the popup
export const PopupContent = ({children}) => {
  const {open, setOpen} = useContext(PopupContext);

  if (open) {
    return(
      <>
      <div className='popup-cover'/>
      <div className='popup-container'>
        <div className='popup'>
          <button className='popup-close' onClick={() => setOpen(!open)}>X</button>
          {children}
        </div>
      </div>
      </>
    )
  } else {
    return(
      <></>
    )
  }
}

//Full popup component
export const Popup = ({children}) => {
  const [open, setOpen] = useState(false);

  return(
    <PopupContext.Provider value={{open, setOpen}}>
      <div>{children}</div>
    </PopupContext.Provider>
  )
}