import "./pages.css";
import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import { PostComment } from "../PostComment";
import { projects, profiles, posts, comments } from "../../constants/fakeData";

//List the post and project ids, used throughout component
const postId = 0;
const projectId = 0;

//replyingToPost shows whether or not the target of the reply is the post itself
let replyingToPost = true;
//If not replying directly to the post, replyTarget indicates which comment it is replying to
//Might need to move this variable later? not sure how to transfer to ProjectPostPage file
let replyTarget = 0;

const changeReplyTarget = (targetId) => {
  if (replyingToPost){
    replyingToPost = false;
    let promptButton = document.getElementById('reply-prompt-reset');
    promptButton.classList.toggle('show');
  }
  replyTarget = targetId;
  let replyPrompt = document.getElementById('reply-prompt-display');
  replyPrompt.innerHTML = "Replying to " + profiles[comments[targetId].author].username;
  console.log(replyTarget, replyingToPost);
}

const resetReplyTarget = () => {
  if(!replyingToPost){
    replyingToPost = true;
    let replyPrompt = document.getElementById('reply-prompt-display');
    replyPrompt.innerHTML = "Replying to Post";
    let promptButton = document.getElementById('reply-prompt-reset');
    promptButton.classList.toggle('show');
  }
  console.log(replyingToPost);
}

const PostReplies = (props) => {
  if (posts[postId].comments.length !== 0){
    return(
      <div>
        {
          posts[postId].comments.map(comment => {
            return(
              <PostComment commentId={comment} callback={changeReplyTarget}/>
            )
          })
        }
      </div>
    )
  } else {
    console.log('no comment found');
    return(
      <div>No comments</div>
    );
  }
}

const ProjectPostPage = (props) => {
  const navigate = useNavigate();
  return(
    <div className='page'>
      <div id='post-page-nav-buttons'>
        <button className='white-button' onClick={() => window.history.back()}>return</button>
        <hr/>
        <button className='white-button' onClick={() => navigate(paths.routes.PROJECT)}>to project</button>
      </div>

      <div id='post-header'>
        <img id='post-project-image' src={profilePlaceholder} alt='project image'/>
        <h2 id='post-project-name'>{projects[projectId].name}</h2>
        <button className='orange-button'>Follow</button>
        <button className='white-button'>...</button>
      </div>

      <hr/>

      <div id='post-page-content'>
        <div id='post'>
          <h3 id='post-name'>{posts[postId].title}</h3>
          <button id='post-options' className='white-button'>...</button>

          <div id='post-content'>
            {posts[postId].postText}
          </div>

          <div id='post-info'>
            <div>
              Posted by: <span id='post-author'>{profiles[posts[postId].author].name}</span>
              <span id='author-role'> {projects[projectId].members[posts[postId].author].role}</span>
            </div>
            <div>{posts[postId].createdDate}</div>
          </div>

          <button id='post-share' className='white-button'>share</button>
          
        </div>

        <div id='comments'>
          <div id='comments-content'>
            <PostReplies />
          </div>

          <div id='reply-content'>
            <div id='reply-prompt'>
              <span id='reply-prompt-display'>Replying to Post</span>
              <button id='reply-prompt-reset' className='hide' onClick={resetReplyTarget}>Cancel</button>
            </div>
            
            

            <input type='text' id='reply-input'></input>

            <div id='reply-attach-buttons'>
              <button id='reply-attach-1' className='white-button'>attach1</button>
              <button id='reply-attach-2' className='white-button'>attach2</button>
              <button id='reply-attach-3' className='white-button'>attach3</button>
            </div>

            <button id='reply-submit'>send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPostPage