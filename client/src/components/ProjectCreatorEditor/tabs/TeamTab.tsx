// --- Imports ---
import { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { Popup, PopupButton, PopupContent } from "../../Popup";
import profileImage from '../../icons/profile-user.png';

// --- Interfaces ---
interface ProjectData {
  title: string;
  hook: string;
  description: string;
  purpose: string;
  status: string;
  audience: string;
  project_types: { id: number; project_type: string }[];
  tags: { id: number; position: number; tag: string; type: string }[];
  jobs: { title_id: number; job_title: string; description: string; availability: string; location: string; duration: string; compensation: string }[];
  members: { first_name: string; last_name: string; job_title: string; profile_image: string; user_id: number }[];
  images: { id: number; image: string; position: number }[];
  socials: { id: number; url: string }[];
}

// --- Variables ---
// Default project value
const defaultProject: ProjectData = {
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
  socials: []
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

// Job detail options
const availabilityOptions = ['Full-time', 'Part-time', 'Flexible'];
const durationOptions = ['Short-term', 'Long-term'];
const locationOptions = ['On-site', 'Remote', 'Hybrid'];
const compensationOptions = ['Unpaid', 'Paid'];

// --- Component ---
export const TeamTab = ({ isNewProject = false, projectData = defaultProject, setProjectData }) => {

  // --- Hooks ---
  // tracking project modifications
  const [modifiedProject, setModifiedProject] = useState<ProjectData>(projectData);

  // for complete list of jobs
  const [allJobs, setAllJobs] = useState<{title_id: number, label: string}[]>([]);

  // HTML contents
  const [teamTabContent, setTeamTabContent] = useState(<></>);
  const [positionWindowContent, setPositionWindowContent] = useState(<></>);

  // tracking which team tab is currently being viewed: 0 - current team, 1 - open positions
  const [currentTeamTab, setCurrentTeamTab] = useState(0);

  // tracking which role is being viewed out of all open positions: value is project title_id (or job_title title_id)
  const [currentRole, setCurrentRole] = useState(0);

  // tracking edits for...
  const [currentMember, setCurrentMember] = useState(emptyMember);
  const [currentJob, setCurrentJob] = useState(emptyJob);

  // store new member data to save later
  const [newMember, setNewMember] = useState(emptyMember);

  // tracking whether position view is in edit mode or not
  const [editMode, setEditMode] = useState(false);

  // tracking if the user is making a new position (after pressing Add Position button)
  const [newPosition, setNewPosition] = useState(false);

  //determine if a popup should close after press (PopupButton)
  const [closePopup, setClosePopup] = useState(true);

  // errors
  const [errorAddMember, setErrorAddMember] = useState('');
  const [errorAddPosition, setErrorAddPosition] = useState('');

  // Update data when data is changed
  useEffect(() => {
    setModifiedProject(projectData);
  }, [projectData]);

  // Update parent state when data is changed
  useEffect(() => {
    setProjectData(modifiedProject);
  }, [modifiedProject, setProjectData]);

  // Get job list if allJobs is empty
  useEffect(() => {
    const getJobsList = async () => {
      const url = `/api/datasets/job-titles`;

      try {
        const response = await fetch(url);

        const jobTitles = await response.json();
        const jobTitleData = jobTitles.data;

        if (jobTitleData === undefined) {
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

  
  // Assign active buttons in Open Positions
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


  //TEMP DEBUG TODO: remove
  // outputs to console to track closePopup hook changes
  useEffect(() => {
    console.log('closepopup changed!', closePopup);
  }, [closePopup]);

  //FIXME: closepopup prop not working
  const handleNewMember = () => {
    //do not close as default
    setClosePopup(false);
    console.log('before closepopup:', closePopup);

    const member = emptyMember;

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

  // Remove position listing
  const deletePosition = useCallback(() => {
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
  }, [currentRole, modifiedProject]);

  // Get project job info
  const getProjectJob = useCallback((id: number) => {
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
  }, [modifiedProject.jobs]);

  // Attempt to use hooks to handle content in popup instead of above variables:
  // positionWindowContent is one of these
  // Open position display
  const positionEditWindow: JSX.Element = useMemo(() => (
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
  ), [currentRole, newPosition, allJobs, savePosition, errorAddPosition, getProjectJob, currentJob, modifiedProject, addPositionCallback]);
  const positionViewWindow: JSX.Element = useMemo(() => (
    <>
      <button
        className="edit-project-member-button"
        onClick={() => {
          setCurrentJob(getProjectJob(currentRole));
          setPositionWindowContent(positionEditWindow);
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
  ), [currentRole, getProjectJob, positionEditWindow, deletePosition]);

  // update position edit window for creating a new position
  const addPositionCallback = useCallback(() => {
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
      setPositionWindowContent(positionViewWindow);
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
      setPositionWindowContent(positionEditWindow);
      setEditMode(true);
    }
    setErrorAddPosition('');
  }, [currentRole, editMode, newPosition, positionEditWindow, positionViewWindow]);

  //Save current inputs in position editing window
  const savePosition = useCallback(() => {
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
    setPositionWindowContent(positionViewWindow);
    setEditMode(false);

    // set current position to saved position
    setCurrentRole(currentJob.title_id);
  }, [currentJob, modifiedProject, newPosition, positionViewWindow]);

  // teamTabContent is one of these
  const currentTeamContent: JSX.Element = useMemo(() => (
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
  ), [allJobs, closePopup, currentMember, currentRole, errorAddMember, modifiedProject]);
  const openPositionsContent: JSX.Element = useMemo(() => (
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
              <div className="add-item-button">
                <button
                  onClick={() => {
                    if (!editMode) {
                      setNewPosition(true);
                      addPositionCallback();
                    }
                  }}
                >
                  <img src={'/images/icons/cancel.png'} alt="+" />
                  <span className="project-editor-extra-info">Add position</span>
                </button>
              </div>
            </div>
          </div>
          <div className="positions-popup-info" id={editMode ? 'positions-popup-list-edit' : ''}>
            {positionWindowContent}
          </div>
        </div>
      }
    </>
  ), [addPositionCallback, editMode, modifiedProject.jobs, positionWindowContent]);

  // --- Complete component ---
  return (
    <div id="project-editor-team">
      <div id="project-editor-team-tabs">
        <button
          onClick={() => {setCurrentTeamTab(0); setTeamTabContent(currentTeamContent);}}
          className={`button-reset project-editor-team-tab ${currentTeamTab === 0 ? 'team-tab-active' : ''}`}
        >
          Current Team
        </button>
        <button
          onClick={() => {setCurrentTeamTab(1); setTeamTabContent(openPositionsContent);}}
          className={`button-reset project-editor-team-tab ${currentTeamTab === 1 ? 'team-tab-active' : ''}`}
        >
          Open Positions
        </button>
      </div>

      <div id="project-editor-team-content">{teamTabContent}</div>
    </div>
  );
};