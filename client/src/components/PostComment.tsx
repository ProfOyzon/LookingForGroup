import "./styles.css";
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
//id={'show-reply-set-' + i}
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
                <PostComment commentId={reply}/>
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
  let comment = comments[props.commentId];
  return(
    <div className='post-comment'>
      <img className='comment-profile' src={profilePlaceholder} alt='profile'/>
      <div className='comment-header'>
        <span>{profiles[comment.author].username} </span>
        <span className='comment-date'>{comment.createdDate}</span>
      </div>

      <div className='comment-content'>
        {comment.content}
      </div>

      <button className='comment-options'>...</button>
      <button className='comment-like'><img src='' alt='heart'/></button>

      <button className='comment-reply'>Reply</button>

      <CommentReplies comment={comment}/>
    </div>
  )
}