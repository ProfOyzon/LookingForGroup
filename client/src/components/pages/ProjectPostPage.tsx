import "./pages.css";
import "../styles.css";
import { projects, profiles, posts, comments } from "../../constants/fakeData";

const postId = 0;
const projectId = 0;

const ProjectPostPage = (props) => {
  return(
    <div className='page'>
      <button>return</button>
      <button>to project</button>

      <div id='post-header'>
        <img src='' alt='project image'/>
        <h2 id='post-project-name'>{projects[projectId].name}</h2>
        <button>Follow</button>
        <button>...</button>
      </div>

      <hr/>

      <div id='post-page-content'>
        <div id='post'>
          <h3 id='post-name'>{posts[postId].title}</h3>
          <button id='post-options'>...</button>

          <div id='post-content'>
            {posts[postId].postText}
          </div>

          <div id='post-info'>
            <div>
              Posted by: {profiles[posts[postId].author].name}
              <span id='author-role'> {projects[projectId].members[posts[postId].author].role}</span>
            </div>
            <div>{posts[postId].createdDate}</div>
          </div>

          <button id='post-share'>share</button>
          
        </div>

        <div id='comments'>
          <div id='comments-content'>

          </div>

          <div id='reply-content'>
            <div id='reply-prompt'>Replying to...</div>

            <input type='text' id='reply-input'></input>

            <div id='reply-attach-buttons'>
              <button id='reply-attach-1'>attach1</button>
              <button id='reply-attach-2'>attach2</button>
              <button id='reply-attach-3'>attach3</button>
            </div>

            <button id='reply-submit'>send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPostPage