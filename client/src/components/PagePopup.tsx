import "./styles.css";
//Might need to import various other components

export const openClosePopup = () => {
  document.getElementById('popup-cover').classList.toggle('show');
  document.getElementById('popup-container').classList.toggle('show');
}

export const PagePopup = ({children}) => {
  return(
    <>
      <div id='popup-cover' className='hide'/>
      <div id='popup-container' className='hide'>
        <button id='popup-close' className='white-button' onClick={openClosePopup}>X</button>
        <div>{children}</div>
      </div>
    </>
  )
}