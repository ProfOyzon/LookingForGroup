// --- Imports ---
import { useEffect, useState } from "react";


// --- Interfaces ---
interface Image {
  id: number;
  image: string;
  position: number;
  file: File
}

interface ProjectData {
  audience: string;
  description: string;
  hook: string;
  images: Image[];
  jobs: { title_id: number; job_title: string; description: string; availability: string; location: string; duration: string; compensation: string; }[];
  members: { first_name: string, last_name: string, job_title: string, profile_image: string, user_id: number}[];
  project_id?: number;
  project_types: { id: number, project_type: string}[];
  purpose: string;
  socials: { id: number, url: string }[];
  status: string;
  tags: { id: number, position: number, tag: string, type: string}[];
  thumbnail: string;
  title: string;
  userId?: number;
}

interface Social {
  website_id: number;
  label: string;
}

// --- Variables ---
// Default project value
const defaultProject: ProjectData = {
  audience: '',
  description: '',
  hook: '',
  images: [],
  jobs: [],
  members: [],
  project_id: -1,
  project_types: [],
  purpose: '',
  socials: [],
  status: '',
  tags: [],
  thumbnail: '',
  title: '',
};

// --- Component ---
export const LinksTab = ({ isNewProject = false, projectData = defaultProject, setProjectData, setErrorLinks }) => {

  // --- Hooks ---
  // tracking project modifications
  const [modifiedProject, setModifiedProject] = useState<ProjectData>(projectData);
  // complete list of socials
  const [allSocials, setAllSocials] = useState<Social[]>([]);
  // sets error when adding a link to the project
  const [error, setError] = useState('');

  // Update data when data is changed
  useEffect(() => {
    setModifiedProject(projectData);
  }, [projectData]);

  // Update parent state with new project data
  useEffect(() => {
    setProjectData(modifiedProject);
  }, [modifiedProject, setProjectData]);

  // Update parent state with error message
  useEffect(() => {
    setErrorLinks(error);
  }, [error, setErrorLinks]);

  // Get socials if allSocials is empty
  useEffect(() => {
    const getSocials = async () => {
      const url = `/api/datasets/socials`;

      try {
        const response = await fetch(url);

        const socials = await response.json();
        const socialsData = socials.data;

        if (socialsData === undefined) {
          return;
        }
        setAllSocials(socialsData);

      } catch (error) {
        console.error(error.message);
      }
    };
    if (allSocials.length === 0) {
      getSocials();
    }
  }, [allSocials]);

  // --- Methods ---
  // Add a link entry
  const addLinkInput = () => {
    // find parent div
    const linkListDiv = document.querySelector("#project-editor-link-list");
    if (linkListDiv) {
      // parent div
      const linkItemDiv = document.createElement('div');
      linkItemDiv.className = 'project-editor-link-item';

      // dropdown
      const dropdown = document.createElement('select');
      // default option
      const defaultOption = document.createElement('option');
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.text = 'Select';
      dropdown.appendChild(defaultOption);
      // add list of options
      for (const s of allSocials) {
        const option = document.createElement('option');
        option.value = s.label;
        option.text = s.label;
        option.dataset.id = s.website_id.toString();
        dropdown.appendChild(option);
      }

      // input wrapper
      const linkInputWrapper = document.createElement('div');
      linkInputWrapper.className = 'project-link-input-wrapper';

      // URL input
      const input = document.createElement('input');
      input.type = 'url';
      input.placeholder = 'URL';

      // remove link button
      const button = document.createElement('button');
      button.className = 'remove-link-button';
      button.innerHTML = '<i class="fa-solid fa-minus"></i>';
      button.onclick = (e) => {
        const wrapper = e.currentTarget.closest('.project-editor-link-item');
        if (wrapper) {
          wrapper.remove();
        }
      };

      // build element
      linkInputWrapper.appendChild(input);
      linkInputWrapper.appendChild(button);
      linkItemDiv.appendChild(dropdown);
      linkItemDiv.appendChild(linkInputWrapper);
      linkListDiv.insertBefore(linkItemDiv, linkListDiv.lastElementChild);
    }
  };

  // --- Complete component ---
  return (
    <div id="project-editor-links">
      <label>Social Links</label>
      <div className="project-editor-extra-info">
        Provide the links to pages you wish to include on your page.
      </div>
      <div className='error'>{error}</div>

      <div id="project-editor-link-list">
        {
          modifiedProject.socials ? modifiedProject.socials.map(social => (
            <div className="project-editor-link-item">
            <select>
              <option disabled selected={allSocials.length === 0}>Select</option>
              {
                allSocials ? allSocials.map(website => (
                  <option selected={social.id === website.website_id} data-id={website.website_id} style={{backgroundImage: `url(images/icons/socials/${website.label}.png)`}}>
                    {website.label}
                  </option>
                )) : ''
              }
            </select>
            <div className='project-link-input-wrapper'>
              {/* FIXME: handle onChange to allow for editing input */}
              <input type="text" placeholder="URL" value={social.url}/>
              <button className='remove-link-button' onClick={
                (e) => {
                  const wrapper = e.currentTarget.closest('.project-editor-link-item');
                  if (wrapper) {
                      wrapper.remove();
                  }
              }}>
                <i className="fa-solid fa-minus"></i>
              </button>
            </div>
          </div>
          )) : ''
        }
        <div className="add-item-button">
              <button onClick={() => addLinkInput()}>
                <img src={'/images/icons/cancel.png'} alt="+" />
                <span className="project-editor-extra-info">Add social profile</span>
              </button>
            </div>
      </div>
    </div>
  );
};