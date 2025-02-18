//Styles
import './Styles/credits.css';
import './Styles/discoverMeet.css';
import './Styles/emailConfirmation.css';
import './Styles/general.css';
import './Styles/loginSignup.css';
import './Styles/messages.css';
import './Styles/notification.css';
import './Styles/profile.css';
import './Styles/projects.css';
import './Styles/settings.css';
import './Styles/pages.css';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Popup, PopupButton, PopupContent } from './Popup';
import { SearchBar } from './SearchBar';
import profileImage from '../icons/profile-user.png';
import editIcon from '../icons/edit.png';
import { render } from '@testing-library/react';
import { current } from '@reduxjs/toolkit';

//THIS COMPONENT NEEDS TO BE WORKED ON

/*
  This component is in an unfinished state. Not all css styling rules have been implemented/fine-tuned yet, 
  and javascript functionality is at a bare minimum.
  When completed, this component should allow for either editing existing projects or creating new projects entirely,
  accessed via the ‘edit project’ button on project pages or the ‘create’ button on the sidebar, respectively.
*/

export const ProjectCreatorEditor = () => {
  //Creating project?

  //Get project ID from search parameters
  let urlParams = new URLSearchParams(window.location.search);
  let projectID = urlParams.get('projectID');

  // project template and default value for variable
  const emptyProject: {
    title: string;
    hook: string;
    description: string;
    purpose: string;
    status: string;
    audience: string;
    project_types: { id: number; project_type: string }[];
    tags: { id: number; position: number; tag: string; type: string }[];
    jobs: {
      title_id: number;
      job_title: string;
      description: string;
      availability: string;
      location: string;
      duration: string;
      compensation: string;
    }[];
    members: {
      first_name: string;
      last_name: string;
      job_title: string;
      profile_image: string;
      user_id: number;
    }[];
    images: { id: number; image: string; position: number }[];
    socials: string[]; // not implemented?
  } = {
    title: '',
    hook: '',
    description: '',
    purpose: '',
    status: '',
    audience: '',
    project_types: [],
    tags: [],
    jobs: [],
    members: [],
    images: [],
    socials: [],
  };
  const emptyMember = {
    first_name: '',
    last_name: '',
    job_title: '',
    profile_image: '',
    user_id: -1,
  };
  const emptyJob = {
    title_id: 0,
    job_title: '',
    description: '',
    availability: '',
    location: '',
    duration: '',
    compensation: '',
  };

  // project purpose and status options
  const purposeOptions = ['Personal', 'Portfolio Piece', 'Academic', 'Co-op'];
  const statusOptions = ['Planning', 'Development', 'Post-Production', 'Complete'];

  // job detail options
  const availabilityOptions = ['Full-time', 'Part-time', 'Flexible'];
  const durationOptions = ['Short-term', 'Long-term'];
  const locationOptions = ['On-site', 'Remote', 'Hybrid'];
  const compensationOptions = ['Unpaid', 'Paid'];

  // tag interfaces
  interface Tag {
    tag_id: number;
    label: string;
    type: string;
  }

  interface Skill {
    skill_id: number;
    label: string;
    type: string;
  }

  interface ProjectType {
    type_id: number;
    label: string;
  }

  //=================
  // State variables
  //=================
  const [newProject, setNewProject] = useState(false); //tracking if creating a new project or editting existing (empty or populated fields)
  const [projectData, setProjectData] = useState(emptyProject); //store project data
  const [modifiedProject, setModifiedProject] = useState(emptyProject); //tracking temporary project changes before committing to a save
  const [failCheck, setFailCheck] = useState(false); //check whether or not data was successfully obtained from database
  const [allJobs, setAllJobs] = useState<
    {
      //for complete list of jobs
      title_id: number;
      label: string;
    }[]
  >([]);
  const [allProjectTypes, setAllProjectTypes] = //for complete list of project types
    useState<ProjectType[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]); //for complete list of tags
  const [allSkills, setAllSkills] = useState<Skill[]>([]); //for complete list of skills
  const [currentTab, setCurrentTab] = useState(0); //for current tab: 0 - general, 1 - Media, 2 - tags, 3 - team, 4 - links
  const [currentTagsTab, setCurrentTagsTab] = useState(0); //tracking which tab of tags is currently viewed: 0 - project type, 1 - genre, 2 - dev skills, 3 - design skills, 4 - soft skills
  // const [currentDataSet, setCurrentDataSet] = useState<{                  //current dataset for tag search bar
  //   data: (Tag | Skill | ProjectType)[] }[]>([]);
  const [searchedTags, setSearchedTags] = useState<
    //filtered results from tag search bar
    (Tag | Skill | ProjectType)[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    //filtered results from tag search bar
    (Tag | Skill | ProjectType)[][]
  >([]);
  const [currentTeamTab, setCurrentTeamTab] = useState(0); //tracking which team tab is currently being viewed: 0 - current team, 1 - open positions
  const [currentRole, setCurrentRole] = useState(0); //tracking which role is being viewed out of all open positions: value is project title_id (or job_title title_id)
  const [currentMember, setCurrentMember] = useState(emptyMember); //tracking which member is being editted
  const [newMember, setNewMember] = useState(emptyMember); //store new member data to save later
  const [editMode, setEditMode] = useState(false); //tracking whether position view is in edit mode or not
  const [newPosition, setNewPosition] = useState(false); //tracking if the user is making a new position (after pressing Add Position button)
  const [currentJob, setCurrentJob] = useState(emptyJob);
  const [closePopup, setClosePopup] = useState(true); //determine if a popup should close after press (PopupButton)
  //errors
  const [errorAddMember, setErrorAddMember] = useState(''); //sets error when adding a member to the team
  const [errorAddPosition, setErrorAddPosition] = useState(''); //sets error when adding a position to the team

  //=============
  // Use Effects
  //=============
  // Get project data on projectID change
  useEffect(() => {
    const getProjectData = async () => {
      const url = `/api/projects/${projectID}`;
      try {
        let response = await fetch(url);

        const projectResponse = await response.json();
        const projectData = projectResponse.data[0];
        console.log('got project data', projectData);

        if (projectData === undefined) {
          setFailCheck(true);
          return;
        }

        // save project data
        setProjectData(projectData);
        setModifiedProject(projectData);
      } catch (error) {
        console.error(error);
      }
    };
    getProjectData();
  }, [projectID]);

  // Get job list if allJobs is empty
  useEffect(() => {
    const getJobsList = async () => {
      const url = `/api/datasets/job-titles`;

      try {
        let response = await fetch(url);

        const jobTitles = await response.json();
        const jobTitleData = jobTitles.data;

        if (jobTitleData === undefined) {
          setFailCheck(true);
          return;
        }
        setAllJobs(jobTitleData);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (allJobs.length === 0) {
      getJobsList();
    }
  }, [allJobs]);

  // Get project types if allProjectTypes is empty
  useEffect(() => {
    const getProjectTypes = async () => {
      const url = `/api/datasets/project-types`;

      try {
        let response = await fetch(url);

        const projectTypes = await response.json();
        const projectTypeData = projectTypes.data;

        if (projectTypeData === undefined) {
          setFailCheck(true);
          return;
        }
        setAllProjectTypes(projectTypeData);
        console.log('project types', projectTypeData);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (allProjectTypes.length === 0) {
      getProjectTypes();
    }
  }, [allProjectTypes]);

  // Get tags if allTags is empty
  useEffect(() => {
    const getTags = async () => {
      const url = `/api/datasets/tags`;

      try {
        let response = await fetch(url);

        const tags = await response.json();
        const tagsData = tags.data;

        if (tagsData === undefined) {
          setFailCheck(true);
          return;
        }
        setAllTags(tagsData);
        console.log('tags', tagsData);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (allTags.length === 0) {
      getTags();
    }
  }, [allTags]);

  // Get skills if allSkills is empty
  useEffect(() => {
    const getSkills = async () => {
      const url = `/api/datasets/skills`;

      try {
        let response = await fetch(url);

        const skills = await response.json();
        const skillsData = skills.data;

        if (skillsData === undefined) {
          setFailCheck(true);
          return;
        }
        setAllSkills(skillsData);
        console.log('skills', skillsData);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (allSkills.length === 0) {
      getSkills();
    }
  }, [allSkills]);

  // Assign active buttons in Team tab (Open Positions)
  const isTeamTabOpen = currentTeamTab === 1;
  useEffect(() => {
    // add id of selected button
    const assigningButton = document.querySelector(`button[data-id="${currentRole}"]`);
    if (assigningButton) {
      // remove id of old button
      const oldButton = document.querySelector('#team-positions-active-button');
      if (oldButton) {
        oldButton.id = '';
      }
      assigningButton.id = 'team-positions-active-button';
      return;
    }

    // neither button present, assign default
    const buttonDiv = document.querySelector('.team-positions-button');

    if (buttonDiv && buttonDiv.querySelector('button')) {
      const defaultButton = buttonDiv.querySelector('button');
      defaultButton!.id = 'team-positions-active-button'; // explicit because check is passed in the if statement
      setCurrentRole(Number(defaultButton!.dataset.id));
    }
  }, [currentRole, isTeamTabOpen]);

  // Find if a tag is present on the project
  const isTagSelected = useCallback(
    (tab: number, id: number, label: string) => {
      // Project Type
      if (tab === 0) {
        return modifiedProject.project_types.some((t) => t.id === id && t.project_type === label)
          ? 'selected'
          : 'unselected';
      }
      // Genre
      if (tab === 1) {
        return modifiedProject.tags.some((t) => t.id === id && t.tag === label)
          ? 'selected'
          : 'unselected';
      }
      //TODO: complete other skills
      // // Developer Skills
      // if (tab === 2) {
      //   return modifiedProject.skills.some(t => t.id === id && t.tag === label) ?
      //     'selected' : 'unselected';
      // }
      // // Designer Skills
      // if (tab === 3) {
      //   return modifiedProject.tags.some(t => t.id === id && t.tag === label) ?
      //     'selected' : 'unselected';
      // }
      // // Soft Skills
      // if (tab === 4) {
      //   return modifiedProject.tags.some(t => t.id === id && t.tag === label) ?
      //     'selected' : 'unselected';
      // }
      console.log(`tab ${tab} not implemented`);
      return 'unselected';
    },
    [modifiedProject]
  );

  // Create element for each tag
  const renderTags = useCallback(() => {
    if (searchedTags && searchedTags.length !== 0) {
      return searchedTags.map((t) => {
        // get id according to type of tag
        let id;
        if ('tag_id' in t) {
          id = t.tag_id;
        } else if ('skill_id' in t) {
          id = t.skill_id;
        } else if ('type_id' in t) {
          id = t.type_id;
        }

        return (
          <button
            className={`tag-button tag-button-${'type' in t ? getTagColor(t.type) : 'blue'}-${isTagSelected(
              currentTagsTab,
              id,
              t.label
            )}`}
          >
            <i
              className={
                isTagSelected(currentTagsTab, id, t.label) === 'selected'
                  ? 'fa fa-close'
                  : 'fa fa-plus'
              }
            ></i>
            &nbsp;{t.label}
          </button>
        );
      });
    }
    // project type
    if (currentTagsTab === 0) {
      return allProjectTypes.map((t) => (
        <button
          className={`tag-button tag-button-blue-${isTagSelected(currentTagsTab, t.type_id, t.label)}`}
        >
          <i
            className={
              isTagSelected(currentTagsTab, t.type_id, t.label) === 'selected'
                ? 'fa fa-close'
                : 'fa fa-plus'
            }
          ></i>
          &nbsp;{t.label}
        </button>
      ));
    } else if (currentTagsTab === 1) {
      return allTags.map((t) => (
        <button
          className={`tag-button tag-button-green-${isTagSelected(currentTagsTab, t.tag_id, t.label)}`}
        >
          <i
            className={
              isTagSelected(currentTagsTab, t.tag_id, t.label) === 'selected'
                ? 'fa fa-close'
                : 'fa fa-plus'
            }
          ></i>
          &nbsp;{t.label}
        </button>
      ));
    } else if (currentTagsTab === 2) {
      return allSkills
        .filter((s) => s.type === 'Designer')
        .map((s) => (
          <button
            className={`tag-button tag-button-red-${isTagSelected(currentTagsTab, s.skill_id, s.label)}`}
          >
            <i
              className={
                isTagSelected(currentTagsTab, s.skill_id, s.label) === 'selected'
                  ? 'fa fa-close'
                  : 'fa fa-plus'
              }
            ></i>
            &nbsp;{s.label}
          </button>
        ));
    } else if (currentTagsTab === 3) {
      return allSkills
        .filter((s) => s.type === 'Developer')
        .map((s) => (
          <button
            className={`tag-button tag-button-yellow-${isTagSelected(currentTagsTab, s.skill_id, s.label)}`}
          >
            <i
              className={
                isTagSelected(currentTagsTab, s.skill_id, s.label) === 'selected'
                  ? 'fa fa-close'
                  : 'fa fa-plus'
              }
            ></i>
            &nbsp;{s.label}
          </button>
        ));
    }
    return allSkills
      .filter((s) => s.type === 'Soft')
      .map((s) => (
        <button
          className={`tag-button tag-button-purple-${isTagSelected(currentTagsTab, s.skill_id, s.label)}`}
        >
          <i
            className={
              isTagSelected(currentTagsTab, s.skill_id, s.label) === 'selected'
                ? 'fa fa-close'
                : 'fa fa-plus'
            }
          ></i>
          &nbsp;{s.label}
        </button>
      ));
  }, [searchedTags, currentTagsTab, allSkills, isTagSelected, allProjectTypes, allTags]);

  // Update tags shown for search bar
  const currentDataSet = useMemo(() => {
    switch (currentTagsTab) {
      case 0:
        return [{ data: allProjectTypes }];
      case 1:
        return [{ data: allTags }];
      case 2:
        return [{ data: allSkills.filter((s) => s.type === 'Developer') }];
      case 3:
        return [{ data: allSkills.filter((s) => s.type === 'Designer') }];
      case 4:
        return [{ data: allSkills.filter((s) => s.type === 'Soft') }];
      default:
        return [{ data: [] }];
    }
  }, [currentTagsTab, allProjectTypes, allTags, allSkills]);

  // Update shown tags according to search results
  // FIXME: results do not carry over when switching tabs
  const handleSearch = useCallback(
    (results: (Tag | Skill | ProjectType)[][]) => {
      setSearchResults(results);
      console.log('handling search');
      console.log('results', results);
      console.log('current data set', currentDataSet);
      if (results.length === 0 && currentDataSet.length !== 0) {
        setSearchedTags(currentDataSet[0].data);
      }
      setSearchedTags(results[0]);
    },
    [currentDataSet]
  );

  // Search tags on tab change
  useEffect(() => {
    handleSearch(searchResults);
  }, [currentTagsTab, currentDataSet, handleSearch, searchResults]);

  //================
  // Helper Methods
  //================
  // Get project job info
  const getProjectJob = (id: number) => {
    const job = modifiedProject.jobs.find((job: { title_id: number }) => job.title_id === id);
    return (
      job || {
        title_id: 0,
        job_title: '',
        description: '',
        availability: '',
        location: '',
        duration: '',
        compensation: '',
      }
    );
  };

  // Get appropriate tag color for tag
  const getTagColor = (type: string) => {
    // Genre
    if (
      type === 'Creative' ||
      type === 'Technical' ||
      type === 'Games' ||
      type === 'Multimedia' ||
      type === 'Music' ||
      type === 'Other'
    ) {
      return 'green';
    }

    // Developer Skills
    if (type === 'Developer') {
      return 'yellow';
    }

    // Designer Skills
    if (type === 'Designer') {
      return 'red';
    }

    // Soft Skills
    if (type === 'Soft') {
      return 'purple';
    }

    console.log("Couldn't find appropriate tag to assign color");
  };

  //Save project editor changes
  const saveProject = async () => {
    // Send PUT request (editor)
    try {
      console.log(`Sending PUT request to /api/projects/${projectID} for body: `, modifiedProject);
      await fetch(`/api/projects/${projectID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedProject),
      });

      setProjectData(modifiedProject);
    } catch (error) {
      console.error(error);
    }
    // window.location.reload();
  };

  //TEMP DEBUG TODO: remove
  useEffect(() => {
    console.log('closepopup changed!', closePopup);
  }, [closePopup]);

  //FIXME: closepopup prop not working
  const handleNewMember = () => {
    //do not close as default
    setClosePopup(false);
    console.log('before closepopup:', closePopup);

    let member = emptyMember;

    // get name
    const nameInput = document.querySelector<HTMLInputElement>('#new-member-name');
    if (nameInput) {
      member.first_name = nameInput.value.split(' ')[0] || '';
      member.last_name = nameInput.value.split(' ')[1] || '';
    } else {
      setErrorAddMember('Error getting name data');
      console.log('no nameInput found');
      setClosePopup(false);
      console.log('closepopup', closePopup);
      return;
    }

    // get job title
    const jobTitleInput = document.querySelector(
      '#project-team-add-member-role-select'
    ) as HTMLInputElement;
    console.log('value', jobTitleInput.value);
    if (jobTitleInput) {
      member.job_title = jobTitleInput.value;
    } else {
      setErrorAddMember('Error getting job data');
      console.log('no jobtitleinput found');
      setClosePopup(false);
      return;
    }

    //TODO: assign proper user_id and profile_image
    member.profile_image = '';
    member.user_id = 0;

    console.log('member', member);

    // check if member has name
    if (!member.first_name || !member.last_name) {
      setErrorAddMember('Member needs a first and last name');
      setClosePopup(false);
      return;
    } else {
      // clear error
      setErrorAddMember('');
      // close popup
      setClosePopup(true);
      // add member
      setNewMember(member);
      modifiedProject.members.push(newMember);
      console.log('new members!', modifiedProject.members);
    }
  };

  // update position edit window for creating a new position
  const addPositionCallback = () => {
    // going back to previous state (cancel button)
    if (newPosition || editMode) {
      // no longer new position
      setNewPosition(false);
      // clear temp job
      setCurrentJob(emptyJob);
      // return to selected role
      const positions = document.querySelectorAll('.positions-popup-list-item');
      for (const p of positions) {
        const dataId = p.getAttribute('data-id');
        if (dataId && parseInt(dataId) === currentRole) {
          // found matching id, set element as active
          p.id = 'team-positions-active-button';
          break;
        }
      }
      // change to position view window
      setEditMode(false);
    }
    // opening add position
    else {
      // empty input fields
      setNewPosition(true);
      // clear selected role
      setCurrentJob(emptyJob);
      const activePosition = document.querySelector('#team-positions-active-button');
      if (activePosition) activePosition.id = '';
      // change to position edit window
      setEditMode(true);
    }
    setErrorAddPosition('');
  };

  //Save current inputs in position editing window
  const savePosition = () => {
    // check if all values present
    if (
      currentJob.title_id === 0 ||
      currentJob.job_title === '' ||
      currentJob.description === '' ||
      currentJob.availability === '' ||
      currentJob.location === '' ||
      currentJob.duration === '' ||
      currentJob.compensation === ''
    ) {
      // set error
      setErrorAddPosition('All fields are required');
      return;
    }

    // check if same position is present
    const existingJob = modifiedProject.jobs.find(
      (j) => j.title_id === currentJob.title_id && j !== currentJob
    );
    if (existingJob) {
      setErrorAddPosition('Job already exists');
      return;
    }

    // if new position, add to job list
    if (newPosition) {
      setModifiedProject({ ...modifiedProject, jobs: [...modifiedProject.jobs, currentJob] });
    } else {
      // find matching position
      const updatedJobs = modifiedProject.jobs.map((j) =>
        j.title_id === currentJob.title_id ? { ...j, ...currentJob } : j
      );
      setModifiedProject({ ...modifiedProject, jobs: updatedJobs });
    }
    setErrorAddPosition('');
    setNewPosition(false);
    setEditMode(false);

    // set current position to saved position
    setCurrentRole(currentJob.title_id);
  };

  const deletePosition = () => {
    // filter out position
    const updatedJobs = modifiedProject.jobs.filter((j) => j.title_id !== currentRole);

    // update jobs
    setModifiedProject({ ...modifiedProject, jobs: updatedJobs });

    // reset current position
    const buttonDiv = document.querySelector('.team-positions-button');
    if (buttonDiv && buttonDiv.querySelector('button')) {
      const defaultButton = buttonDiv.querySelector('button');
      defaultButton!.id = 'team-positions-active-button'; // explicit because check is passed in the if statement
      setCurrentRole(Number(defaultButton!.dataset.id));
    }
  };

  //===================
  // Tab page elements
  //===================
  //General
  const generalTab = (
    <>
      {
        <div id="project-editor-general">
          <div id="project-editor-title-input" className="project-editor-input-item">
            <label>Title*</label>
            <input
              type="text"
              className="title-input"
              value={newProject ? '' : modifiedProject.title}
              onChange={(e) => {
                setModifiedProject({ ...modifiedProject, title: e.target.value });
              }}
            />
          </div>

          <div id="project-editor-status-input" className="project-editor-input-item">
            <label>Status*</label>
            <select
              value={modifiedProject.status || 'Select'}
              onChange={(e) => {
                setModifiedProject({ ...modifiedProject, status: e.target.value });
              }}
            >
              <option disabled selected={newProject}>
                Select
              </option>
              {statusOptions.map((o) => (
                <option selected={newProject ? false : modifiedProject.status === o}>{o}</option>
              ))}
            </select>
          </div>

          <div id="project-editor-purpose-input" className="project-editor-input-item">
            <label>Purpose</label>
            <select
              value={newProject ? '' : modifiedProject.purpose}
              onChange={(e) => {
                setModifiedProject({ ...modifiedProject, purpose: e.target.value });
              }}
            >
              <option disabled selected={newProject}>
                Select
              </option>
              {purposeOptions.map((o) => (
                <option selected={newProject ? false : modifiedProject.purpose === o}>{o}</option>
              ))}
            </select>
          </div>

          <div id="project-editor-audience-input" className="project-editor-input-item">
            <label>Target Audience</label>
            <div className="project-editor-extra-info">
              Define who this project is intended for--consider age group, interest, industry, or
              specific user needs.
            </div>
            <span className="character-count">
              {modifiedProject.audience ? modifiedProject.audience.length : '0'}/100
            </span>{' '}
            <textarea
              maxLength={100}
              value={newProject ? '' : modifiedProject.audience}
              onChange={(e) => {
                setModifiedProject({ ...modifiedProject, audience: e.target.value });
              }}
            />
          </div>

          <div id="project-editor-description-input" className="project-editor-input-item">
            <label>Short Description*</label>
            <div className="project-editor-extra-info">
              Share a brief summary of your project. This will be displayed in your project's
              discover card.
            </div>
            <span className="character-count">
              {modifiedProject.hook ? modifiedProject.hook.length : '0'}/300
            </span>{' '}
            <textarea
              maxLength={300}
              value={newProject ? '' : modifiedProject.hook}
              onChange={(e) => {
                setModifiedProject({ ...modifiedProject, hook: e.target.value });
              }}
            />
          </div>

          <div id="project-editor-long-description-input" className="project-editor-input-item">
            <label>About This Project*</label>
            <div className="project-editor-extra-info">
              Use this space to go into detail about your project! Feel free to share it's
              inspirations and goals, outline key features, and describe this impact you hope it
              brings to others.
            </div>
            <span className="character-count">
              {modifiedProject.description ? modifiedProject.description.length : '0'}/2000
            </span>{' '}
            <textarea
              maxLength={2000}
              value={newProject ? '' : modifiedProject.description}
              onChange={(e) => {
                setModifiedProject({ ...modifiedProject, description: e.target.value });
              }}
            />
          </div>
        </div>
      }
    </>
  );

  //Media
  const mediaTab = (
    <>
      {
        <div id="project-editor-media">
          <label>Project Images</label>
          <div className="project-editor-extra-info">
            Upload images that showcase your project. Select one image to be used as the main
            thumbnail on the project's discover card.
          </div>
          <div id="project-editor-image-ui">
            {/* TODO: Add image elements/components here based on currently uploaded images */}
            <div id="project-editor-add-image">
              <img src="assets/white/upload_file_white.png" alt="" />
              <div className="project-editor-extra-info">
                Drop your image here, or {/*TODO: click to upload file<input type="file">*/}browse
                {/*</input>*/}
              </div>
              <div className="project-editor-extra-info">Supports: JPEG, PNG</div>
            </div>
          </div>
        </div>
      }
    </>
  );

  //Tags
  const tagsTab = (
    <>
      {
        <div id="project-editor-tags">
          <div id="project-editor-type-tags">
            <div className="project-editor-section-header">Project Type</div>
            {modifiedProject.project_types.length === 0 ? (
              <div className="error">*At least 1 type is required</div>
            ) : (
              <></>
            )}
            {/* FIXME: determine error from project information*/}
            <div id="project-editor-type-tags-container">
              {modifiedProject.project_types.map((t) => (
                <button className={`tag-button tag-button-blue-selected`}>
                  <i className="fa fa-close"></i>
                  &nbsp;{t.project_type}
                </button>
              ))}
            </div>
          </div>

          <div id="project-editor-selected-tags">
            <div className="project-editor-section-header">Selected Tags</div>
            <div className="project-editor-extra-info">
              Drag and drop to reorder. The first 2 tags will be displayed on your project's
              discover card.
            </div>
            {/* TODO: check for project skills */}
            {modifiedProject.tags.length === 0 ? (
              <div className="error">*At least 1 tag is required</div>
            ) : (
              <></>
            )}
            <div id="project-editor-selected-tags-container">
              <hr id="selected-tag-divider" />
              {/* TODO: Separate top 2 tags from others with hr element */}
              {modifiedProject.tags.map((t) => (
                <button className={`tag-button tag-button-${getTagColor(t.type)}-selected`}>
                  <i className="fa fa-close"></i>
                  &nbsp;{t.tag}
                </button>
              ))}
            </div>
          </div>

          <div id="project-editor-tag-search">
            <SearchBar dataSets={currentDataSet} onSearch={handleSearch} />
            <div id="project-editor-tag-wrapper">
              <div id="project-editor-tag-search-tabs">
                <button
                  onClick={() => setCurrentTagsTab(0)}
                  className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 0 ? 'tag-search-tab-active' : ''}`}
                  //Data from genres
                >
                  Project Type
                </button>
                <button
                  onClick={() => setCurrentTagsTab(1)}
                  className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 1 ? 'tag-search-tab-active' : ''}`}
                  //Data from tags
                >
                  Genre
                </button>
                <button
                  onClick={() => setCurrentTagsTab(2)}
                  className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 2 ? 'tag-search-tab-active' : ''}`}
                  //Data from skills (type=Developer)
                >
                  Developer Skills
                </button>
                <button
                  onClick={() => setCurrentTagsTab(3)}
                  className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 3 ? 'tag-search-tab-active' : ''}`}
                  //Data from skills (type=Designer)
                >
                  Designer Skills
                </button>
                <button
                  onClick={() => setCurrentTagsTab(4)}
                  className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 4 ? 'tag-search-tab-active' : ''}`}
                  //Data from skills (type=Soft)
                >
                  Soft Skills
                </button>
              </div>
              <hr id="tag-search-divider" />
            </div>
            <div id="project-editor-tag-search-container">{renderTags()}</div>
          </div>
        </div>
      }
    </>
  );

  // Team tab
  // Open position display
  const positionViewWindow = (
    <>
      {
        <>
          <button
            className="edit-project-member-button"
            onClick={() => {
              setCurrentJob(getProjectJob(currentRole));
              setEditMode(true);
            }}
          >
            <img className="edit-project-member-icon" src="/images/icons/pencil.png" alt="" />
          </button>
          <div className="positions-popup-info-title">{getProjectJob(currentRole).job_title}</div>
          <div className="positions-popup-info-description">
            <div id="position-description-content">{getProjectJob(currentRole).description}</div>
          </div>
          <div id="open-position-details">
            <div id="open-position-details-left">
              <div id="position-availability">
                <span className="position-detail-indicator">Availability: </span>
                {getProjectJob(currentRole).availability}
              </div>
              <div id="position-location">
                <span className="position-detail-indicator">Location: </span>
                {getProjectJob(currentRole).location}
              </div>
              <div id="open-position-contact">
                <span className="position-detail-indicator">Contact: </span>
                <span
                  // onClick={() =>
                  //   navigate(`${paths.routes.PROFILE}?userID=${projectLead.user_id}`)
                  // }
                  id="position-contact-link"
                >
                  <img src="/assets/creditProfiles/JF.png" alt="" />
                  {/* {projectLead.first_name} {projectLead.last_name} */}
                  Lily Carter
                </span>
              </div>
            </div>
            <div id="open-position-details-right">
              <div id="position-duration">
                <span className="position-detail-indicator">Duration: </span>
                {getProjectJob(currentRole).duration}
              </div>
              <div id="position-compensation">
                <span className="position-detail-indicator">Compensation: </span>
                {getProjectJob(currentRole).compensation}
              </div>
            </div>
          </div>
          <Popup>
            <PopupButton className="delete-position-button button-reset">
              <img src="/images/icons/delete.svg" alt="trash can" />
            </PopupButton>
            <PopupContent useClose={false}>
              <div id="project-team-delete-member-title">Delete Position</div>
              <div id="project-team-delete-member-text" className="project-editor-extra-info">
                Are you sure you want to delete{' '}
                <span className="project-info-highlight">
                  {getProjectJob(currentRole).job_title}
                </span>{' '}
                from the project? This action cannot be undone.
              </div>
              <div className="project-editor-button-pair">
                {/* TODO: make delete button work */}
                <PopupButton className="delete-button" callback={() => deletePosition()}>
                  Delete
                </PopupButton>
                <PopupButton buttonId="team-delete-member-cancel-button">Cancel</PopupButton>
              </div>
            </PopupContent>
          </Popup>
        </>
      }
    </>
  );

  // Edit open position or creating new position
  const positionEditWindow = (
    <>
      {
        <>
          <div id="edit-position-role">
            {/* TODO: add place for error message (setErrorAddPosition) */}
            <label>Role*</label>
            <select
              key={currentRole}
              onChange={(e) => {
                const selectedTitle = allJobs.find((j) => j.label === e.target.value);
                if (selectedTitle)
                  setCurrentJob({
                    ...currentJob,
                    title_id: selectedTitle.title_id,
                    job_title: selectedTitle.label,
                  });
              }}
            >
              <option disabled selected={newPosition}>
                Select
              </option>
              {allJobs.map((job: { title_id: number; label: string }) => (
                <option
                  key={job.title_id}
                  selected={newPosition ? false : job.title_id === currentRole}
                  onClick={() => {
                    const updatedJobs = modifiedProject.jobs.map((j) =>
                      j.title_id === job.title_id ? { ...j, job_title: job.label } : j
                    );
                    setModifiedProject({ ...modifiedProject, jobs: updatedJobs });
                  }}
                >
                  {job.label}
                </option>
              ))}
            </select>
            <div id="edit-position-buttons">
              <div id="edit-position-button-pair">
                <button onClick={savePosition} id="position-edit-save">
                  Save
                </button>
                <button
                  onClick={() => {
                    addPositionCallback();
                  }}
                  id="position-edit-cancel"
                  className="button-reset"
                >
                  Cancel
                </button>
              </div>
              <div className="error">{errorAddPosition}</div>
            </div>
          </div>

          <div id="edit-position-description">
            <label>Role Description*</label>
            <textarea
              onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
            >
              {newPosition ? '' : getProjectJob(currentRole).description}
            </textarea>
          </div>

          <div id="edit-position-details">
            <div id="edit-position-details-left">
              <label className="edit-position-availability">Availability</label>
              <select
                className="edit-position-availability"
                onChange={(e) => setCurrentJob({ ...currentJob, availability: e.target.value })}
              >
                <option disabled selected={newPosition}>
                  Select
                </option>
                {availabilityOptions.map((o) => (
                  <option
                    key={o}
                    selected={newPosition ? false : getProjectJob(currentRole).availability === o}
                  >
                    {o}
                  </option>
                ))}
              </select>
              <label className="edit-position-location">Location</label>
              <select
                className="edit-position-location"
                onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
              >
                <option disabled selected={newPosition}>
                  Select
                </option>
                {locationOptions.map((o) => (
                  <option
                    selected={newPosition ? false : getProjectJob(currentRole).location === o}
                  >
                    {o}
                  </option>
                ))}
              </select>
              <label className="edit-position-contact">Main Contact</label>
              <select className="edit-position-contact">{/* Put project lead here */}</select>
            </div>
            <div id="edit-position-details-right">
              <label className="edit-position-duration">Duration</label>
              <select
                className="edit-position-duration"
                onChange={(e) => setCurrentJob({ ...currentJob, duration: e.target.value })}
              >
                <option disabled selected={newPosition}>
                  Select
                </option>
                {durationOptions.map((o) => (
                  <option
                    selected={newPosition ? false : getProjectJob(currentRole).duration === o}
                  >
                    {o}
                  </option>
                ))}
              </select>
              <label className="edit-position-compensation">Compensation</label>
              <select
                className="edit-position-compensation"
                onChange={(e) => setCurrentJob({ ...currentJob, compensation: e.target.value })}
              >
                <option disabled selected={newPosition}>
                  Select
                </option>
                {compensationOptions.map((o) => (
                  <option
                    selected={newPosition ? false : getProjectJob(currentRole).compensation === o}
                  >
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      }
    </>
  );

  // Check if team tab is in edit mode
  const positionWindow = editMode === true ? positionEditWindow : positionViewWindow;

  const teamTabContent =
    currentTeamTab === 0 ? (
      <>
        {
          <div id="project-editor-project-members">
            {/* List out project members */}
            {modifiedProject.members.map((m) => (
              <div className="project-editor-project-member">
                {/* <img className="project-member-image" src="/assets/creditProfiles/JF.png" alt="" /> */}
                <img
                  className="project-member-image"
                  src={`/images/profiles/${m.profile_image}`}
                  alt=""
                />
                <div className="project-editor-project-member-info">
                  <div className="project-editor-project-member-name">
                    {m.first_name} {m.last_name}
                  </div>
                  <div className="project-editor-project-member-role project-editor-extra-info">
                    {m.job_title}
                  </div>
                </div>
                <Popup>
                  <PopupButton className="edit-project-member-button">
                    <img
                      className="edit-project-member-icon"
                      src="/images/icons/pencil.png"
                      alt=""
                    />
                  </PopupButton>
                  <PopupContent useClose={false}>
                    <div id="project-team-edit-member-title">Edit Member</div>
                    <div
                      id="project-team-edit-member-card"
                      className="project-editor-project-member"
                    >
                      <img
                        className="project-member-image"
                        src={`/images/profiles/${m.profile_image}`}
                        alt=""
                      />
                      <div className="project-editor-project-member-name">
                        {m.first_name} {m.last_name}
                      </div>
                    </div>
                    <div id="project-team-add-member-role">
                      <label>Role</label>
                      <select
                        key={currentRole}
                        onChange={(e) => {
                          // update member's role temporarily
                          // TODO: make this work without onchange
                          const tempMember = { ...m };
                          tempMember.job_title = e.target.value;
                          setCurrentMember(tempMember);
                        }}
                      >
                        {allJobs.map((job: { title_id: number; label: string }) => (
                          <option key={job.title_id} selected={job.label === m.job_title}>
                            {job.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Action buttons */}
                    <div className="project-editor-button-pair">
                      <PopupButton
                        buttonId="team-edit-member-save-button"
                        callback={() => {
                          // update members
                          const members = modifiedProject.members.map((m) =>
                            m.user_id === currentMember.user_id ? currentMember : m
                          );
                          setModifiedProject({ ...modifiedProject, members });
                        }}
                      >
                        Save
                      </PopupButton>
                      <Popup>
                        <PopupButton className="delete-button">Delete</PopupButton>
                        <PopupContent>
                          <div id="project-team-delete-member-title">Delete Member</div>
                          <div
                            id="project-team-delete-member-text"
                            className="project-editor-extra-info"
                          >
                            Are you sure you want to delete{' '}
                            <span className="project-info-highlight">
                              {m.first_name} {m.last_name}
                            </span>{' '}
                            from the project? This action cannot be undone.
                          </div>
                          <div className="project-editor-button-pair">
                            <button className="delete-button">Delete</button>
                            <PopupButton
                              buttonId="team-delete-member-cancel-button"
                              className="button-reset"
                            >
                              Cancel
                            </PopupButton>
                          </div>
                        </PopupContent>
                      </Popup>
                    </div>
                    <PopupButton
                      buttonId="team-edit-member-cancel-button"
                      className="button-reset"
                      callback={() => console.log(modifiedProject.members)}
                    >
                      Cancel
                    </PopupButton>
                  </PopupContent>
                </Popup>
              </div>
            ))}
            {/* Add member button */}
            <Popup>
              <PopupButton buttonId="project-editor-add-member">
                <img id="project-team-add-member-image" src={profileImage} alt="" />
                <div id="project-team-add-member-text">Add Member</div>
              </PopupButton>
              <PopupContent useClose={false}>
                <div id="project-team-add-member-title">Add Member</div>
                <div className="error" id="error-add-member">
                  {errorAddMember}
                </div>
                <div id="project-team-add-member-name">
                  <label>Name</label>
                  <input type="text" id="new-member-name"></input>
                </div>
                <div id="project-team-add-member-role">
                  <label>Role</label>
                  <select id="project-team-add-member-role-select" key={currentRole}>
                    {allJobs.map((job: { title_id: number; label: string }) => (
                      <option key={job.title_id} selected={job.title_id === currentRole}>
                        {job.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Action buttons */}
                <div className="project-editor-button-pair">
                  {/* TODO: add team member to project */}
                  <PopupButton
                    buttonId="team-add-member-add-button"
                    callback={() => {
                      /*handleNewMember();*/ console.log('in callback', closePopup);
                    }}
                    doNotClose={!closePopup}
                  >
                    Add
                  </PopupButton>
                  <PopupButton buttonId="team-add-member-cancel-button" className="button-reset">
                    Cancel
                  </PopupButton>
                </div>
              </PopupContent>
            </Popup>
          </div>
        }
      </>
    ) : currentTeamTab === 1 ? (
      <>
        {
          <div id="project-team-open-positions-popup">
            <div className="positions-popup-list">
              <div id="team-positions-popup-list-header">Open Positions</div>
              <div id="team-positions-popup-list-buttons">
                {modifiedProject.jobs.map((job: { job_title: string; title_id: number }) => (
                  <div className="team-positions-button">
                    <img src="/images/icons/drag.png" alt="" />
                    <button
                      className="positions-popup-list-item"
                      id=""
                      data-id={job.title_id}
                      onClick={() => (!editMode ? setCurrentRole(job.title_id) : {})}
                    >
                      {job.job_title}
                    </button>
                  </div>
                ))}
                <div id="add-position-button">
                  <button
                    onClick={() => {
                      if (!editMode) {
                        setNewPosition(true);
                        addPositionCallback();
                      }
                    }}
                  >
                    <img src={'/images/icons/cancel.png'} alt="+" />
                    <span className="project-editor-extra-info">Add Position</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="positions-popup-info" id={editMode ? 'positions-popup-list-edit' : ''}>
              {positionWindow}
            </div>
          </div>
        }
      </>
    ) : (
      <></>
    );

  const teamTab = (
    <>
      {
        <div id="project-editor-team">
          <div id="project-editor-team-tabs">
            <button
              onClick={() => setCurrentTeamTab(0)}
              className={`button-reset project-editor-team-tab ${currentTeamTab === 0 ? 'team-tab-active' : ''}`}
            >
              Current Team
            </button>
            <button
              onClick={() => setCurrentTeamTab(1)}
              className={`button-reset project-editor-team-tab ${currentTeamTab === 1 ? 'team-tab-active' : ''}`}
            >
              Open Positions
            </button>
          </div>

          <div id="project-editor-team-content">{teamTabContent}</div>
        </div>
      }
    </>
  );

  //Links
  const linksTab = (
    <>
      {
        <div id="project-editor-links">
          <label>Social Links</label>
          <div className="project-editor-extra-info">
            Provide the links to pages you wish to include on your page.
          </div>

          <div id="project-editor-link-list">
            {/* insert list of link elements/componenets here */}
            <button id="project-editor-add-link">+ Add Social Profile</button>
          </div>
        </div>
      }
    </>
  );

  //Checks to see which tab we are currently rendering
  let currentTabContent;
  switch (currentTab) {
    case 0:
      currentTabContent = generalTab;
      break;
    case 1:
      currentTabContent = mediaTab;
      break;
    case 2:
      currentTabContent = tagsTab;
      break;
    case 3:
      currentTabContent = teamTab;
      break;
    case 4:
      currentTabContent = linksTab;
      break;
    default:
      currentTabContent = generalTab;
  }

  return (
    <Popup>
      <PopupButton buttonId="project-info-edit">Edit Project</PopupButton>
      <PopupContent callback={() => setModifiedProject(projectData)}>
        <div id="project-creator-editor">
          <div id="project-editor-tabs">
            <button
              onClick={() => setCurrentTab(0)}
              className={`project-editor-tab ${currentTab === 0 ? 'project-editor-tab-active' : ''}`}
            >
              General
            </button>
            <button
              onClick={() => setCurrentTab(1)}
              className={`project-editor-tab ${currentTab === 1 ? 'project-editor-tab-active' : ''}`}
            >
              Media
            </button>
            <button
              onClick={() => setCurrentTab(2)}
              className={`project-editor-tab ${currentTab === 2 ? 'project-editor-tab-active' : ''}`}
            >
              Tags
            </button>
            <button
              onClick={() => setCurrentTab(3)}
              className={`project-editor-tab ${currentTab === 3 ? 'project-editor-tab-active' : ''}`}
            >
              Team
            </button>
            <button
              onClick={() => setCurrentTab(4)}
              className={`project-editor-tab ${currentTab === 4 ? 'project-editor-tab-active' : ''}`}
            >
              Links
            </button>
          </div>

          <div id="project-editor-content">{currentTabContent}</div>

          <PopupButton buttonId="project-editor-save" callback={saveProject}>
            Save Changes
          </PopupButton>
        </div>
      </PopupContent>
    </Popup>
  );
};
