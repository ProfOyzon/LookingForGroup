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
//Additonally, any profile names found will redirect the user to that user's profile page when clicked

//Contains the ids of the post and the project it belongs to, used throughout this file
//Current data structure has posts belonging to multiple projects, so projectId is set to a constant for now
let postId;
const projectId = 0;

//replyingToPost shows whether or not the user is currently replying to the post itself or a comment
// true = replies given are to the post itself; false = replies given are to a specific comment of the post
let replyingToPost = true;

//If not replying directly to the post, replyTarget indicates which comment it is replying to, identified by id
let replyTarget = 0;

//Changes the current target of any reply inputs
//targetId - the id of the new comment that the user will reply to
//Called whenever a 'reply' button is clicked in the comment section
const changeReplyTarget = (targetId) => {
  if (replyingToPost){
    //Change values to indicate the user is not replying directly to the post
    replyingToPost = false;
    let promptButton = document.getElementById('reply-prompt-reset');
    //shows a button to cancel and change reply target back to the post itself
    promptButton ? promptButton.classList.toggle('show') : console.log('element not found');
  }
  //Change value of replyTarget to indicate which comment to reply to
  replyTarget = targetId;
  //Change display to show the owner of the comment being replied to
  let replyPrompt = document.getElementById('reply-prompt-display');
  replyPrompt ? replyPrompt.innerHTML = "Replying to " + profiles[comments[targetId].author].username :
    console.log('element not found');
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
    replyPrompt ? replyPrompt.innerHTML = "Replying to Post" : console.log('element not found');
    let promptButton = document.getElementById('reply-prompt-reset');
    promptButton ? promptButton.classList.toggle('show') : console.log('element not found');
  }
}

//Component that renders the full list of post comments & replies
//Renders multiple 'PostComment' components within itself, more details can be found in the PostComment.tsx file

//PostData is passed in through props, which contains data on the post being rendered
const PostReplies = (props) => {
  if (props.postData.comments.length !== 0){
    return(
      <div>
        {
          props.postData.comments.map(comment => {
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
  //Get which post to load using search query
  let urlParams = new URLSearchParams(window.location.search);
  postId = urlParams.get('postID');
  console.log(postId);
  //If post isn't found, load a default one instead
  if (postId === null) {
    postId = '0';
  }

  //Find post data using Id (or assign a default if one can't be found)
  const postData = posts.find(p => p._id === Number(postId)) || posts[0];
  return(
    <div className='page'>
      <div id='post-page-nav-buttons'>
        <button className='white-button' onClick={() => window.history.back()}>return</button>
        <hr/>
        <button className='white-button' onClick={() => navigate(paths.routes.PROJECT + `?projID=${projectId}`)}>to project</button>
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
          <h3 id='post-name'>{postData.title}</h3>
          <button id='post-options' className='white-button'>...</button>

          <div id='post-content'>
            {postData.postText}
          </div>

          <div id='post-info'>
            <div>
              Posted by: <span id='post-author' onClick={() => navigate(paths.routes.PROFILE + `?profID=${postData.author}`)}>
                {profiles[postData.author].name}
              </span>
              <span id='author-role'> {projects[projectId].members[postData.author].role}</span>
            </div>
            <div>{postData.createdDate}</div>
          </div>

          <button id='post-share' className='white-button'>share</button>
          
        </div>

        <div id='comments'>
          <div id='comments-content'>
            <PostReplies postData={postData}/>
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