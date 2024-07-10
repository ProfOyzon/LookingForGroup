import "./styles.css";

//This component is meant to be reusable in any area of the site, acting as an element that can be
//  opened or closed after performing certain actions.
//Size is fully adjustable through props, and it's content can be anything that is necessary
//When a popup is open, any scrolling of the page behind it is locked until the popup is closed
//Specific buttons can be made within the popup to close it, but it will always contain a close button
//  in the upper right corner of the popup.

// How to use:
// 1. import component with 'import { PagePopup, openClosePopup } from "../PagePopup";'
// 2. choose a location where the popup would be relevant & choose parameters
//      - An example would be '<PagePopup width={x} height={y} popupId={z} z-index={q}>  </PagePopup>'
//      - x & y = popup width/height, respectively; z = number ID to identify this popup; q = the z-index layer of the popup
// 3. Place whatever content you want within the popup (including elements, components, etc.);
// 4. Have somewhere for the user to trigger the 'openClosePopup' function to open the popup (it can't open itself!)
//      - Use the relevant popup's ID number as the parameter for this function to indicate which popup to open
//      - Example: <button onClick={() => openClosePopup(z)}>Click me!</button>; Where z = the popup's ID number

// Created by Joseph Dunne, if there is an issue you cannot solve regarding popups, let me know

//A bool used to check whether or not we should lock scrolling on the page
let scrollLock = false;

//A function used to open and/or close a popup
//Must be able to call within the page itself for the user to access the popup

//popupId - the number id of the popup to open or close
export const openClosePopup = (popupId) => {
  //document.getElementById errors are due to typescript, they still run without issue
  document.getElementById(`popup-cover-${popupId}`).classList.toggle('popup-cover-show');
  document.getElementById(`popup-container-${popupId}`).classList.toggle('popup-show');
  console.log(document.getElementsByClassName('popup-show'));
  //If a popup is open, disables scrolling of page
  //When all popups are closed, re-enables page scrolling
  //This is accomplished by toggling a specific style rule on the page itself

  //Scrollbar disappearing causes a small horizontal shift in the page
  //In the future, it would be ideal to prevent this from happening

  //Unsure of why 'style' is giving an error- code still runs fine
  if (document.getElementsByClassName('popup-show').length !== 0 && !scrollLock) {
    let page = document.getElementsByClassName('page');
    page[0].style.top = `-${window.scrollY}px`;
    page[0].classList.toggle('page-scroll-lock');
    scrollLock = true;
  } else if(document.getElementsByClassName('popup-show').length === 0){
    let page = document.getElementsByClassName('page');
    let scrollY = page[0].style.top;
    page[0].style.top = '';
    page[0].classList.toggle('page-scroll-lock');
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
    scrollLock = false
  }
}

//Main component of PagePopup, which is exported from this file
//Passes in 5 values: children, width, height, popupId, & zIndex

//children - the actual content of the popup, passed in as if it were acting as the content of an element
//  ( ex. <PagePopup>This would be passed in as 'children' in the popup!</PagePopup> )
//width - the width of the popup window; numbers passed in will serve as pixel measurements
//  To pass in specific css values, use a string with the appropriate unit (ex. '80vw', '50%')
//height - the height of the popup window; functions similarly to width ^
//popupId - the ID of a specific instance of a popup, should ideally be set as a number for easier coding
//  Used when calling openClosePopup to identify which specific popup to interact with
//zIndex - the zIndex layer of the popup, used to tell which layer the popup should appear on
//  Should be at least 2 to ensure it overlays the side menu
//  If multiple popups are being used on a page, use this to differentiate their layers
export const PagePopup = ({children, width, height, popupId, zIndex}) => {
  return(
    <>
      <div id={`popup-cover-${popupId}`} className='popup-cover-hide' style={{zIndex: zIndex}}/>
      <div id={`popup-container-${popupId}`} className='popup-hide' style={{width: width, height: height, 
        top: `clamp(2.5vh, calc((100% - ${height})/2), 100%)`, 
        left: `clamp(2.5vw, calc((100% - ${width})/2), 100%)`,
        zIndex: zIndex}}>
        <button id='popup-close' className='white-button' onClick={() => openClosePopup(popupId)}>X</button>
        <div>{children}</div>
      </div>
    </>
  )
}