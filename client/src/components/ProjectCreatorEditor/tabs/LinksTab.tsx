// --- Imports ---
import { useEffect, useState } from "react";
import { Select, SelectButton, SelectOptions } from "../../Select";


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
  members: { first_name: string, last_name: string, job_title: string, profile_image: string, user_id: number }[];
  project_id?: number;
  project_types: { id: number, project_type: string }[];
  purpose: string;
  socials: { id: number, url: string }[];
  status: string;
  tags: { id: number, position: number, tag: string, type: string }[];
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
  // TO-DO: Replace this function with something using State variables
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
          modifiedProject.socials ? modifiedProject.socials.map((social, index) => {
            return (
              <div className="project-editor-link-item" key={`social.id-${index}`}>
                <div className='project-link-select-wrapper'>
                  <Select>
                    <SelectButton
                      placeholder='Select'
                      initialVal={social.website}
                      className='project-link-select'
                    />
                    <SelectOptions
                      callback={(e) => {
                        if (allSocials) {
                          // Create a copy of the current social, and change it
                          const tempSocials = modifiedProject.socials;
                          tempSocials[index].website = e.target.value;

                          // Find the correct id and assign it
                          for (let i = 0; i < allSocials.length; i++) {
                            if (e.target.value === allSocials[i].label) {
                              tempSocials[index].id = allSocials[i].website_id;
                              break;
                            }
                          }

                          setModifiedProject({ ...modifiedProject, socials: tempSocials });
                        }
                      }}
                      options={allSocials ? allSocials.map(website => {
                        return {
                          markup: <>
                            {website.label === 'Other' ? (
                              <i className='fa-solid fa-link'></i>
                            ) : (
                              <i className={`fa-brands ${(website.label === 'Itch.io' ? 'fa-itch-io' : (website.label === 'X') ? 'fa-x-twitter' : `fa-${website.label.toLowerCase()}`)}`}></i>
                            )}
                            {website.label}
                          </>,
                          value: website.label,
                          disabled: false,
                        };
                      }) : []}
                    />
                  </Select>
                </div>
                <div className='project-link-input-wrapper'>
                  {/* FIXME: handle onChange to allow for editing input */}
                  <input
                    type="text"
                    placeholder="URL"
                    value={social.url}
                    onChange={(e) => {
                      // TO-DO: Implement some sort of security check for URLs.
                      // Could be as simple as checking the URL matches the social media
                      // But since 'Other' is an option, might be good to just find some
                      // external list of suspicious sites and make sure it's not one of those.
                      const tempSocials = modifiedProject.socials;
                      tempSocials[index].url = e.target.value;
                      setModifiedProject({ ...modifiedProject, socials: tempSocials });
                    }}
                  />
                  <button className='remove-link-button' onClick={
                    (e) => {
                      // const wrapper = e.currentTarget.closest('.project-editor-link-item');
                      // if (wrapper) {
                      //   wrapper.remove();
                      // }

                      // Remove element from modified socials array
                      const tempSocials = modifiedProject.socials.toSpliced(index, 1);
                      setModifiedProject({ ...modifiedProject, socials: tempSocials });
                    }}>
                    <i className="fa-solid fa-minus"></i>
                  </button>
                </div>
              </div>
            );
          }) : ''
        }
        <div className="add-item-button">
          <button onClick={() => {
            //addLinkInput();
            let tempSocials = modifiedProject.socials;

            // Create the socials array if it doesn't exist already
            if (!tempSocials) {
              tempSocials = [];
            }

            tempSocials.push({
              id: 1,
              website: 'Instagram',
              url: '',
            });

            setModifiedProject({ ...modifiedProject, socials: tempSocials });
          }}>
            <img src={'/images/icons/cancel.png'} alt="+" />
            <span className="project-editor-extra-info">Add social profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};