import "../styles.css"
import postImagePlaceholder from "../../img/AhomeIcon.png";
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";

export const ProjectPost = (props) => {
  const navigate = useNavigate();
  return (
    <div className='project-post' onClick={() => navigate(paths.routes.PROJECTPOST)}>
      <img src={postImagePlaceholder} alt=''/>
      <div className='post-content'>
        <div className='post-info'>
          <h3 className='post-title'>{props.title}</h3>
          <div className='post-date'>{props.date}</div>
        </div>
      
        <button className='white-button'><img src='' alt=''/></button>
      </div>
    </div>
  )
}