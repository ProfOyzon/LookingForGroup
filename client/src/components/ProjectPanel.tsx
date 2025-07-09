import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from '../constants/routes';
import placeholderThumbnail from '../images/project_temp.png';
import { sendDelete, sendPost } from '../functions/fetch';

//Component that will contain info about a project, used in the discovery page
//Smaller and more concise than ProjectCard.tsx

//Takes in a 'project' value which contains info on the project it will display
//Also takes in width (the width of this panel), and rightAlign, which determines which side the hover panel aligns with

//backend base url for getting images
const API_BASE = `http://localhost:8081`;

interface ProjectType {
  id: number;
  project_type: string;
}

interface ProjectTag {
  id: number;
  tag: string;
  type: string;
}

interface ProjectData {
  project_id: number;
  title: string;
  hook: string;
  thumbnail: string | null;
  followers: {
    count: number;
    isFollowing: boolean;
  };
  project_types: ProjectType[];
  tags: ProjectTag[];
}

interface ProjectPanelProps {
  project: ProjectData;
  userId: number;
}

export const ProjectPanel = ({ project, userId }: ProjectPanelProps) => {
  const navigate = useNavigate();
  const projectURL = `${paths.routes.NEWPROJECT}?projectID=${project.project_id}`;
  
  const [followCount, setFollowCount] = useState(project.followers.count);
  const [isFollowing, setFollowing] = useState(project.followers.isFollowing);

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
                    sendPost(url, { projectId: project.project_id }, () => {
                      setFollowing(true);
                      setFollowCount(followCount + 1);
                    });
                  } else {
                    url += `/${project.project_id}`;
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
          {project.project_types.map((projectType: ProjectType) => (
            <div className='skill-tag-label label-blue' key={projectType.id}>
              {projectType.project_type}
            </div>
          ))}
          {project.tags.map((tag: ProjectTag, index: number) => {
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
            if (index < 3) {
              return (
                <div className={`skill-tag-label label-${category}`} key={tag.id}>
                  {tag.tag}
                </div>
              );
            }
          })}
        </div>
        <div id="quote">{project.hook}</div>
      </div>
    </div>
  );
};