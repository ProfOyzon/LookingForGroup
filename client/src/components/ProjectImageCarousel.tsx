import { useState, useEffect } from "react";
import arrow from "../icons/s-arrow.png";
import image1 from "../images/blue_frog.png";
import image2 from "../images/banner.png";
import image3 from "../images/tall_img.png";

const imageList = [image1, image2, image3];

//This post was used to help create this component (found by Ben Gomez)
// https://blog.bitsrc.io/simple-carousel-in-react-2aac73887243 

//Will need to take in a list of images to render
export const ProjectImageCarousel = () => {
  //State variable tracking what the currently displayed image's index is
  const [currentIndex, setCurrentIndex] = useState(0);
  //State variable tracking whether or not the user's mouse is hovering over this component
  const [hovering, setHovering] = useState(false);

  //Function to handle a change in which image index to use
  const handleIndexChange = (newIndex : number) => {
    if (newIndex > imageList.length - 1) {
      //If new index is greater than max index, set index to 0
      newIndex = 0;
    } else if (newIndex < 0) {
      //If new index is less than 0, set it to max index
      newIndex = imageList.length - 1;
    }
    
    //set new index
    setCurrentIndex(newIndex);
  }

  return (
    <>
    {/* Main image content of carousel */}
    <div id='project-image-carousel-content' onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      {
        imageList.map((image, index) => (
          <div className='project-image-carousel-item' key={index} style={{transform: `translate(-${currentIndex * 100}%)`}}>
            <img className='project-image-carousel-image' src={image}/>
          </div>
        ))
      }
    </div>

    {/* Buttons for controlling carousel images */}
    <div id='project-image-carousel-buttons'>
      <button onClick={() => handleIndexChange(currentIndex - 1)} id='project-image-carousel-left'>
        <img src={arrow} alt='<'/>
      </button>
      <div id='project-image-carousel-tabs'>
        {
          imageList.map((image, index) => {
            let className = index === currentIndex ? 'project-image-carousel-tab carousel-tab-active' :
              'project-image-carousel-tab';
            return (
              <button className={className} onClick={() => handleIndexChange(index)} key={index}><img/></button>
            )
          })
        }
      </div>
      <button onClick={() => handleIndexChange(currentIndex + 1)} id='project-image-carousel-right'>
        <img src={arrow} alt='>'/>
      </button>
    </div>
    </>
  )
}