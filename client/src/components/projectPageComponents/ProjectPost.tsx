import "../styles.css"
import postImagePlaceholder from "../../img/AhomeIcon.png";

export const ProjectPost = (props) => {
  return (
    <div className='project-post'>
      <img src={postImagePlaceholder} alt=''/>
      <div className='post-content'>
        <div className='post-info'>
          <h2 className='post-title'>{props.title}</h2>
          <div className='post-date'>{props.date}</div>
        </div>
      
        <button className='white-button'><img src='' alt=''/></button>
      </div>
    </div>
  )
}