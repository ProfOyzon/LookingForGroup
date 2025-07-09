import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from '../constants/routes';
import placeholderThumbnail from '../images/project_temp.png';
import { sendDelete, sendPost } from '../functions/fetch';

//shared interface 
import type { Project, UserPreview } from '../../../shared/types.ts';

//Component that will contain info about a project, used in the discovery page
//Smaller and more concise than ProjectCard.tsx

//Takes in a 'project' value which contains info on the project it will display
//Also takes in width (the width of this panel), and rightAlign, which determines which side the hover panel aligns with

//backend base url for getting images
const API_BASE = `http://localhost:8081`;

interface ProjectPanelProps {
  project: Project;
  userId: number;
}

export const ProjectPanel = ({ project, userId }: ProjectPanelProps) => {
  const navigate = useNavigate();
  const projectURL = `${paths.routes.NEWPROJECT}?projectID=${project.projectId}`;

  //if user is already following
  const startIsFollowing = project.followers?.some(
    (follower: UserPreview) => follower.userId === userId
  )
  const [followCount, setFollowCount] = useState(project.followers?.length);
  const [isFollowing, setFollowing] = useState(startIsFollowing);

  // Formats follow-count based on Figma design. Returns a string
  const formatFollowCount = (followers: number): string => {
    const followerNum = followers;

    if (followerNum >= 1000) {
      const multOfHundred = (followerNum % 100) === 0;
      const formattedNum = (followerNum / 1000).toFixed(1);
      return `${formattedNum}K ${multOfHundred ? '+' : ''}`;
    }

    return `${followerNum}`;
  };


  return (
    // <div className={'project-panel'} style={{ width: width }}>
    <div className={'project-panel'}>
      <img
        src={
          project.thumbnail != null
            ? `${API_BASE}/images/thumbnails/${project.thumbnail}`
            : placeholderThumbnail
        }
        alt={'project image'}
      />
      <div
        className={'project-panel-hover'}
        onClick={() => navigate(projectURL)}
      // style={rightAlign ? { width: width, right: 0 } : { width: width }}
      >
        <img
          src={
            project.thumbnail != null
              ? `${API_BASE}/images/thumbnails/${project.thumbnail}`
              : placeholderThumbnail
          }
          alt={'project image'}
        />
        {/* <h2>{project.title}</h2> */}
        <div className='project-title-likes'>
          <h2>{project.title}</h2>
          <div className='project-likes'>
            <p className={`follow-amt ${isFollowing ? 'following' : ''}`}>
              {formatFollowCount(followCount)}
            </p>
            <button
              className={`follow-icon ${isFollowing ? 'following' : ''}`}
              onClick={(e) => {
                // Prevent parent onClick event from running
                if (e.stopPropagation) e.stopPropagation();

                // Only follow project if logged in. Go to login otherwise
                if (!userId || userId === 0) {
                  navigate(`${paths.routes.LOGIN}`);
                } else {
                  let url = `/api/users/${userId}/followings/projects`;

                  if (!isFollowing) {
                    sendPost(url, { projectId: project.projectId }, () => {
                      setFollowing(true);
                      setFollowCount(followCount + 1);
                    });
                  } else {
                    url += `/${project.projectId}`;
                    sendDelete(url, () => {
                      setFollowing(false);
                      setFollowCount(followCount - 1);
                    });
                  }
                }
              }}
            >
              <i className={`fa-solid fa-heart ${isFollowing ? 'following' : ''}`}></i>
            </button>
          </div>
        </div>
        <div id="project-panel-tags">
          {project.projectType.map((projectType) => (
            <div className='skill-tag-label label-blue' key={projectType.typeId}>
              {projectType.label}
            </div>
          ))}
          {project.projectTags.map((tag) => {
            let category: string;
            switch (tag.type) {
              case 'Design':
                category = 'red';
                break;
              case 'Developer':
                category = 'yellow';
                break;
              case 'Soft':
                category = 'purple';
                break;
              case 'Creative':
              case 'Games':
                category = 'green';
                break;
              default:
                category = 'grey';
            }
            return (
              <div className={`skill-tag-label label-${category}`} key={tag.tagId}>
                {tag.label}
              </div>
            );

          })}
        </div>
        <div id="quote">{project.hook}</div>
      </div>
    </div>
  );
};