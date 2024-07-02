import "./styles.css";
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";
import profilePlaceholder from "../img/profile-user.png";
import { profiles, comments } from "../constants/fakeData";

let i = 0;

const showRepliesToggle = (i) => {
  let currentId = i;
  let currentButton = document.getElementById(currentId);
  if (currentButton !== null){
    currentButton.classList.toggle('show');
  }
}

//Figure out way to indent replies
//Add function to 'show reply' buttons
const CommentReplies = (props) => {
  if (props.comment.replies.length !== 0){
    i++;
    let currentId = 'show-reply-set-' + i;
    return(
      <div className='comment-replies'>
        <button onClick={() => showRepliesToggle(currentId)}>----- View Replies</button>
        <div id={'show-reply-set-' + i} className='hide'>
          {
            props.comment.replies.map(reply => {
              return(
                <PostComment commentId={reply} callback={props.callback}/>
              )
            })
          }
        </div>
      </div>
    )
  } else {
    return(
      <></>
    )
  }
}

export const PostComment = (props) => {
  let navigate = useNavigate();
  let comment = comments[props.commentId];
  return(
    <div className='post-comment'>
      <img className='comment-profile' src={profilePlaceholder} alt='profile'/>
      <div className='comment-header'>
        <span className='comment-author' onClick={() => navigate(paths.routes.PROFILE)}>{profiles[comment.author].username}</span>
        <span className='comment-date'> {comment.createdDate}</span>
      </div>

      <div className='comment-content'>
        {comment.content}
      </div>

      <button className='comment-options'>...</button>
      <button className='comment-like'><img src='' alt='heart'/></button>

      <button className='comment-reply' onClick={() => props.callback(props.commentId)}>Reply</button>

      <CommentReplies comment={comment} callback={props.callback}/>
    </div>
  )
}