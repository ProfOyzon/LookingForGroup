import "./styles.css";
//Might need to import various other components

export const openClosePopup = () => {
  document.getElementById('popup-cover').classList.toggle('show');
  document.getElementById('popup-container').classList.toggle('show');
}

export const PagePopup = ({children, width, height}) => {
  return(
    <>
      <div id='popup-cover' className='hide'/>
      <div id='popup-container' className='hide' style={{width: width, height: height, 
        top: `clamp(2.5vh, calc((100% - ${height})/2), 100%)`, 
        left: `clamp(2.5vw, calc((100% - ${width})/2), 100%)`}}>
        <button id='popup-close' className='white-button' onClick={openClosePopup}>X</button>
        <div>{children}</div>
      </div>
    </>
  )
}