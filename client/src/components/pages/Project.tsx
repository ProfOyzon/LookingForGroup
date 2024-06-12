import "./pages.css";
import "../styles.css";
import profilePlaceholder from "../../img/profile-user.png";
import { ProjectPost } from "../ProjectPost";

const samplePosts = [{'title':'Post1', 'date':'sampleDate1'}, {'title':'Post2', 'date':'sampleDate2'}]

const Project = (props) => {
  return (
    <div id='current-page'>
    <button id='return-button'>return</button>

    <div id='project-info'>
      <img id='project-picture' src={profilePlaceholder} alt=''/>

      <div id='project-header'>
        <h1 id='project-title'>Sample Title</h1>
        <button id='follow-project'>Follow</button>
        <button id='more-options'><img src='elipses.png'/></button>
      </div>

      <p id='project-desc'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium est, exercitationem, ipsam asperiores eligendi labore, sed architecto optio id velit consequatur nemo placeat odit dolorem perspiciatis tenetur dolorum blanditiis omnis.
      </p>

      <div id='project-listings'>
        <h3>Looking for</h3>
        <div>Role1</div>
        <div>Role2</div>

        <button id='interested-button'>Interested</button>
      </div>
    </div>

    <hr/>

    <div id='project-members'></div>

    <hr/>

    <div id='project-posts'></div>
    {
      samplePosts.map(post => {
        return(
          <ProjectPost title={post.title} date={post.date} />
        )
      })
    }
    </div>
  );
}

export default Project;