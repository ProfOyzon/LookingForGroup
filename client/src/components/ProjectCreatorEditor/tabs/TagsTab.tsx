// --- Imports ---
import { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { SearchBar } from "../../SearchBar";


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

// --- Methods ---
// Get appropriate tag color for tag
const getTagColor = (type: string) => {
  // Genre
  if (type === 'Creative' ||
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

  return 'blue';
}

// --- Component ---
export const TagsTab = ({ isNewProject = false, projectData = defaultProject, setProjectData }) => {
  //  --- Hooks ---
  // tracking project modifications
  const [modifiedProject, setModifiedProject] = useState<ProjectData>(projectData);

  // Complete list of...
  const [allProjectTypes, setAllProjectTypes] = useState<ProjectType[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // sets error when adding a link to the project
  const [error, setError] = useState('');

  //tracking which tab of tags is currently viewed: 0 - project type, 1 - genre, 2 - dev skills, 3 - design skills, 4 - soft skills
  const [currentTagsTab, setCurrentTagsTab] = useState(0);

  //filtered results from tag search bar
  const [searchedTags, setSearchedTags] = useState<(Tag | Skill | ProjectType)[]>([]);

  // Update data when data is changed
  useEffect(() => {
    setModifiedProject(projectData);
  }, [projectData]);

  // Update parent state with new project data
  useEffect(() => {
    setProjectData(modifiedProject);
  }, [modifiedProject, setProjectData]);

  // Get full lists of project types, tags, and skills
  useEffect(() => {
    const getProjectTypes = async () => {
      const url = `/api/datasets/project-types`;

      try {
        const response = await fetch(url);

        const projectTypes = await response.json();
        const projectTypeData = projectTypes.data;

        if (projectTypeData === undefined) {
          return;
        }
        setAllProjectTypes(projectTypeData);
        console.log('project types', projectTypeData);
      } catch (error) {
        console.error(error);
      }
    };
    if (allProjectTypes.length === 0) {
      getProjectTypes();
    }
  }, [allProjectTypes]);
  useEffect(() => {
    const getTags = async () => {
      const url = `/api/datasets/tags`;

      try {
        const response = await fetch(url);

        const tags = await response.json();
        const tagsData = tags.data;

        if (tagsData === undefined) {
          return;
        }
        setAllTags(tagsData);

      } catch (error) {
        console.error(error);
      }
    };
    if (allTags.length === 0) {
      getTags();
    }
  }, [allTags]);
  useEffect(() => {
    const getSkills = async () => {
      const url = `/api/datasets/skills`;

      try {
        const response = await fetch(url);

        const skills = await response.json();
        const skillsData = skills.data;

        if (skillsData === undefined) {
          return;
        }
        setAllSkills(skillsData);

      } catch (error) {
        console.error(error);
      }
    };
    if (allSkills.length === 0) {
      getSkills();
    }
  }, [allSkills]);

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

  // Find if a tag is present on the project
  const isTagSelected = useCallback((tab: number, id: number, label: string) => {
    // Project Type
    if (tab === 0) {
      return modifiedProject.project_types.some(t => t.id === id && t.project_type === label) ?
        'selected' : 'unselected';
    }
    // Genre
    if (tab === 1) {
      return modifiedProject.tags.some(t => t.id === id && t.tag === label) ?
        'selected' : 'unselected';
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
    return 'unselected';
  }, [modifiedProject]);

  // Handle tag selection
  const handleTagSelect = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clicked on a tag!');
    
    // trim whitespace to get tag name
    const tag: string = e.target.innerText.trim();
    
    // if tag is unselected
    if (e.target.className.includes('unselected')) {
      console.log('tag class before', e.target.className);
      // change tag class
      e.target.className = e.target.className.replace('unselected', 'selected');
      console.log('tag class after', e.target.className);
      
      // change icon class
      e.target.querySelector('i').className = 'fa fa-close';

      // get tag id and type according to type of tag
      let id: number = -1;
      let type: string = '';
      if (currentTagsTab === 0) { // project type
        id = allProjectTypes.find((t) => t.label === tag)?.type_id ?? -1;
        type = 'Project Type';
      }
      else if (currentTagsTab === 1) { // genre
        id = allTags.find((t) => t.label === tag)?.tag_id ?? -1;
        type = 'Genre';
      }
      else if (currentTagsTab === 2) { // developer skills
        id = allSkills.find((s) => s.type === 'Developer' && s.label === tag)?.skill_id ?? -1;
        type = 'Developer';
      }
      else if (currentTagsTab === 3) { // designer skills
        id = allSkills.find((s) => s.type === 'Designer' && s.label === tag)?.skill_id ?? -1;
        type = 'Designer';
      }
      else if (currentTagsTab === 4) { // soft skills
        id = allSkills.find((s) => s.type === 'Soft' && s.label === tag)?.skill_id ?? -1;
        type = 'Soft';
      }
      else {
        console.log('invalid tag tab');
      }

      // error check: no tag found
      if (id === -1) {
        console.error('no tag found');
        return;
      }
      
      // add tag to project
      if (type === 'Project Type') {
        setModifiedProject({ ...modifiedProject, project_types: [...modifiedProject.project_types, { id: id, project_type: tag }] });
        console.log('added project type', modifiedProject.project_types);
      } else {
        setModifiedProject({ ...modifiedProject, tags: [...modifiedProject.tags, {
          id: id,
          position: modifiedProject.tags.length,// TODO: update this according to position
          tag: tag,
          type: type
        }] });
        console.log('added tag', modifiedProject.tags);
      }
    }
    // if tag is selected
    else {
      // remove tag from project
      setModifiedProject({ ...modifiedProject, project_types: modifiedProject.project_types.filter((t) => t.project_type !== tag) });
      
      // deselect tag
      console.log('tag class before', e.target.className);
      e.target.className = e.target.className.replace('selected', 'unselected');
      console.log('tag class after', e.target.className);

      // change icon class
      e.target.querySelector('i').className = 'fa fa-plus';

      console.log('removed tag', modifiedProject.tags);
    }
  }, [allProjectTypes, allSkills, allTags, currentTagsTab, modifiedProject]);

  // Create elements for selected tags in sidebar
  const loadProjectTags = useCallback(() => {
    // container for all tags to be displayed
    const elements: JSX.Element[] = [];

    // iterate through all tag tabs for possible selected tags
    for (let i = 0; i < 5; i++) {
      modifiedProject.tags.forEach((t) => {
        if (isTagSelected(i, t.id, t.tag) === 'selected') {
          elements.push(
            <button className={`tag-button tag-button-${getTagColor(t.type)}-selected`} onClick={(e) => handleTagSelect(e)}>
              <i className="fa fa-close"></i>
              &nbsp;{t.tag}
            </button>
          );
        }
      });
    }
    
    return elements;
  }, [modifiedProject, isTagSelected, handleTagSelect]);
  
  // Create element for each tag
  const renderTags = useCallback(() => {
    // no search item, render all tags
    if (searchedTags && searchedTags.length !== 0 ) {
      return (
        searchedTags.map(t => {
          // get id according to type of tag
          let id: number = -1; // bad default value
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
            onClick={(e) => handleTagSelect(e)}
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

        })
      )
    }
    // project type
    if (currentTagsTab === 0) {
      return allProjectTypes.map((t) => (
        <button
          className={`tag-button tag-button-blue-${isTagSelected(currentTagsTab, t.type_id, t.label)}`}
          onClick={(e) => handleTagSelect(e)}
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
          onClick={(e) => handleTagSelect(e)}
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
            onClick={(e) => handleTagSelect(e)}
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
            onClick={(e) => handleTagSelect(e)}
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
          onClick={(e) => handleTagSelect(e)}
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
  }, [searchedTags, currentTagsTab, allSkills, isTagSelected, handleTagSelect, allProjectTypes, allTags]);

  // Update shown tags according to search results
  // FIXME: results do not update when switching tabs with no query
  const handleSearch = useCallback((results: (Tag | Skill | ProjectType)[][]) => {
    // setSearchResults(results);
    console.log('handling search');
    console.log('results', results);
    if (results.length === 0 && currentDataSet.length !== 0) {
      console.log('no results or current data set');
      setSearchedTags(currentDataSet[0].data);
    }
    else {
      setSearchedTags(results[0]);
    }
  }, [currentDataSet]);

  // --- Complete component ---
  return (
    <div id="project-editor-tags">
      <div id="project-editor-type-tags">
        <div className="project-editor-section-header">Project Type</div>
        {modifiedProject.project_types.length === 0 ? <div className="error">*At least 1 type is required</div> : <></> }
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
        {modifiedProject.tags.length === 0 ? <div className="error">*At least 1 tag is required</div> : <></> }
        <div id="project-editor-selected-tags-container">
          <hr id="selected-tag-divider" />
          {/* TODO: Separate top 2 tags from others with hr element */}
          {
            // iterate through array values
            [1, 2, 3, 4].map((i) => (
              modifiedProject.tags.map((t) => (
                isTagSelected(i, t.id, t.tag) === 'selected' && (
                  <button
                    className={`tag-button tag-button-${getTagColor(t.type)}-selected`} 
                    onClick={(e) => handleTagSelect(e)}
                  >
                    <i className="fa fa-close"></i>
                    &nbsp;{t.tag}
                  </button>
                )
              ))
            ))
            // loadProjectTags()
          }
        </div>
      </div>

      <div id="project-editor-tag-search">
        <SearchBar dataSets={currentDataSet} onSearch={handleSearch} />
        <div id="project-editor-tag-wrapper">
          <div id="project-editor-tag-search-tabs">
            <button
              onClick={() => {setCurrentTagsTab(0);}}
              className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 0 ? 'tag-search-tab-active' : ''}`}
              //Data from genres
            >
              Project Type
            </button>
            <button
              onClick={() => {setCurrentTagsTab(1); }}
              className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 1 ? 'tag-search-tab-active' : ''}`}
              //Data from tags
            >
              Genre
            </button>
            <button
              onClick={() => {setCurrentTagsTab(2); }}
              className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 2 ? 'tag-search-tab-active' : ''}`}
              //Data from skills (type=Developer)
            >
              Developer Skills
            </button>
            <button
              onClick={() => {setCurrentTagsTab(3); }}
              className={`button-reset project-editor-tag-search-tab ${currentTagsTab === 3 ? 'tag-search-tab-active' : ''}`}
              //Data from skills (type=Designer)
            >
              Designer Skills
            </button>
            <button
              onClick={() => {setCurrentTagsTab(4); }}
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
  );
};