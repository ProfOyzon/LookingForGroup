import { PostComment } from './PostComment';
import { profiles, comments } from '../../constants/fakeData'; // FIXME: use data in db

//Component that renders the full list of post comments & replies
//Renders multiple 'PostComment' components within itself, more details can be found in the PostComment.tsx file

// *** Separate component, should be moved into a separate file later ***

//PostComments is passed in through props, which contains data on the comments of the post being rendered
export const PostReplies = (props) => {
  let key = 0; //key is not needed for functionality, but react will given an error if it isn't used in the .map function later

  //Changes the current target of any reply inputs
  //targetId - the id of the new comment that the user will reply to
  //Called whenever a 'reply' button is clicked in the comment section
  const changeReplyTarget = (targetId) => {
    if (props.replyingToPost) {
      //Change values to indicate the user is not replying directly to the post
      props.setReplyingToPost(false);
      const promptButton = document.getElementById('reply-prompt-reset');
      //shows a button to cancel and change reply target back to the post itself
      promptButton ? promptButton.classList.toggle('show') : console.log('element not found');
    }
    //Change value of replyTarget to indicate which comment to reply to
    props.setReplyTarget(targetId);
    //Change display to show the owner of the comment being replied to
    //If comment data can't be found, use a default name
    const replyPrompt = document.getElementById('reply-prompt-display');
    const replyTargetAuthor =
      comments.find((currentComment) => currentComment._id === targetId) || comments[0];
    replyPrompt
      ? (replyPrompt.innerHTML = 'Replying to ' + profiles[replyTargetAuthor.author].username)
      : console.log('element not found');
  };

  if (props.postComments.length !== 0) {
    return (
      <div id="comments-container">
        {props.postComments.map((comment) => {
          key++;
          return <PostComment commentId={comment} callback={changeReplyTarget} key={key} />;
        })}
      </div>
    );
  } else {
    console.log('no comment found');
    return <div>No comments</div>;
  }
};
