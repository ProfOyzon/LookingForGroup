import "./styles.css";
//Might need to import various other components

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