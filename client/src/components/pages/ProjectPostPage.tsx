import "./pages.css";
import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { useNavigate } from 'react-router-dom';
import * as paths from "../../constants/routes";
import { PostComment } from "../PostComment";
import { projects, profiles, posts, comments } from "../../constants/fakeData";

//This is the Project Post Page component, which contains a layout that allows for displaying info regarding a project post
//  Info displayed includes the post itself, as well as comments
//More info and comments on individual parts are found above their respective parts
//Additonally, any profile names found will redirect the user to the profile page when clicked
//  In the future, they should also redirect specifically to the respective profile that is clicked

//Contains the ids of the post and the project it belongs to, used throughout this file
//Serves as a placeholder for now, should be altered to have any id passed in to render
const postId = 0;
const projectId = 0;

//replyingToPost shows whether or not the user is currently replying to the post itself or a comment
// true = replies given are to the post itself; false = replies given are to a specific comment of the post
let replyingToPost = true;

//If not replying directly to the post, replyTarget indicates which comment it is replying to, identified by id
let replyTarget = 0;

//'promptButton' and 'replyPrompt' errors are due to typescript - they still function correctly and are safe to ignore for now

//Changes the current target of any reply inputs
//targetId - the id of the new comment that the user will reply to
//Called whenever a 'reply' button is clicked in the comment section
const changeReplyTarget = (targetId) => {
  if (replyingToPost){
    //Change values to indicate the user is not replying directly to the post
    replyingToPost = false;
    let promptButton = document.getElementById('reply-prompt-reset');
    //shows a button to cancel and change reply target back to the post itself
    promptButton.classList.toggle('show');
  }
  //Change value of replyTarget to indicate which comment to reply to
  replyTarget = targetId;
  //Change display to show the owner of the comment being replied to
  let replyPrompt = document.getElementById('reply-prompt-display');
  replyPrompt.innerHTML = "Replying to " + profiles[comments[targetId].author].username;
}

//Resets the target of any reply inputs back to the post itself
//Called when clicking the 'reply-prompt-reset' button, which shows if replyingToPost = false
const resetReplyTarget = () => {
  //Only runs if not already targeting post
  if(!replyingToPost){
    //Change value to indicate replying to post
    replyingToPost = true;
    //Reset displays to default
    let replyPrompt = document.getElementById('reply-prompt-display');
    replyPrompt.innerHTML = "Replying to Post";
    let promptButton = document.getElementById('reply-prompt-reset');
    promptButton.classList.toggle('show');
  }
}

//Component that renders the full list of post comments & replies
//Renders multiple 'PostComment' components within itself, more details can be found in the PostComment.tsx file

//No values are passed in through props
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

//Main content of the Projest Post Page, which is exported from this file
//Utilizes the 'PostReplies' component, which is found just above
//Contains a header with some navigation options & basic project functions (inculding following, reporting, etc.)
//  (Some header functionality is not currently implemented, but should act similarly to the header found in the Project page)
//  There is also a button for options, but no options were specified when this was created,
//  add options here as part of a dropdown menu if some are implemented
//Displays the post itself on the left side (top if on mobile), featuring the content itself and info on the post
//Displays comments and replies on the right side (bottom on mobile), as well as a reply input field to send replies
//  Reply input does not currently write new info to database, needs implementation
//Both content boxes should be scrollable if there is an overflow of content

//No values are passed in through props
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
              Posted by: <span id='post-author' onClick={() => navigate(paths.routes.PROFILE)}>{profiles[posts[postId].author].name}</span>
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
            
            

            <textarea id='reply-input' maxLength={300}/>

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