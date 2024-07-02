import "./styles.css";

// How to use:
// 1. import component with 'import { PagePopup, openClosePopup } from "../PagePopup";'
// 2. choose a location where the popup would be relevant & choose parameters
//      - An example would be '<PagePopup width={x} height={y} popupId={z} z-index={q}>  </PagePopup>'
//      - x & y = popup width/height, respectively; z = number ID to identify this popup; q = the z-index layer of the popup
// 3. Place whatever content you want within the popup (including elements, components, etc.);

// Created by Joseph Dunne, if there is an issue you cannot solve regarding popups, let me know

export const openClosePopup = (popupId) => {
  document.getElementById(`popup-cover-${popupId}`).classList.toggle('popup-cover-show');
  document.getElementById(`popup-container-${popupId}`).classList.toggle('popup-show');
}

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