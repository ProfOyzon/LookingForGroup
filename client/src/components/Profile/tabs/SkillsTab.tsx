/*
  This class is copied from tagsTab in the ProjectCreatorEditor tabs
  Currently, this tab does not work
  Feel free to replace this entire file, or try and debug the code
  */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { SearchBar } from '../../SearchBar';
import { ProfileData } from '../ProfileEditPopup';

interface Tag {
  tag_id: number;
  label: string;
  type: string;
}

const tagTabs = ['Developer Skills', 'Design Skills', 'Soft Skills'];

const getTagColor = (type: string) => {
  // Returns the tage color based on what skill it is
  if (type === 'Developer Skill') {
    return 'yellow';
  } else if (type === 'Designer Skill') {
    return 'red';
  } else {
    // Soft Skill
    return 'purple';
  }
}

export const SkillsTab = (props: { profile: ProfileData }) => {
  // States
  const [modifiedProfile, setModifiedProfile] = useState<ProfileData>(props.profile);
  const [allSkills, setAllSkills] = useState<Tag[]>([]);
  // Tracks which tab we are currently on
  const [currentTagsTab, setCurrentTagsTab] = useState(0);
  // filtered results from tag search bar
  const [searchedTags, setSearchedTags] = useState<(Tag | ProfileData)[]>([]);
  
  // Update data when data is changed
  useEffect(() => {
    setModifiedProfile(props.profile);
  }, [props.profile]);

  // load skills
  useEffect(() => {
    const getSkills = async () => {
      const url = `/api/datasets/skills`;

      try {
        const response = await fetch(url);

        const skills = await response.json();
        const skillData = skills.data;

        if (skillData === undefined) {
          return;
        }
        setAllSkills(skillData);

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
        return [{ data: allSkills.filter((s) => s.type === 'Developer Skill') }];
      case 1:
        return [{ data: allSkills.filter((s) => s.type === 'Designer Skill') }];
      case 2:
        return [{ data: allSkills.filter((s) => s.type === 'Soft Skill') }];
      default:
        return [{ data: [] }];
    }
  }, [currentTagsTab, allSkills]);

  // Find if a tag is present on the project
  const isTagSelected = useCallback((id: number, label: string, tab: number = -1) => {
    // Developer Skills
    if (tab === 0) {
      return modifiedProfile.skills.some(t => t.id === id && t.tag === label) ?
        'selected' : 'unselected';
    }
    // Designer Skills
    if (tab === 1) {
      return modifiedProfile.skills.some(t => t.id === id && t.tag === label) ?
        'selected' : 'unselected';
    }
    // Soft Skills
    if (tab === 2) {
      return modifiedProfile.skills.some(t => t.id === id && t.tag === label) ?
        'selected' : 'unselected';
    }
    return 'unselected';
  }, [modifiedProfile]);

  const handleTagSelect = useCallback((e: any) => {
    // trim whitespace to get tag name
    const tag: string = e.target.innerText.trim();

    // if tag is unselected
    if (e.target.className.includes('unselected')) {
      // change tag class
      e.target.className = e.target.className.replace('unselected', 'selected');

      // change icon class
      e.target.querySelector('i').className = 'fa fa-close';

      // get tag id and type according to type of tag
      let id: number = -1;
      let type: string = '';

      if (e.target.className.includes('yellow')) { // developer skills
        id = allSkills.find((s) => s.type === 'Developer Skill' && s.label === tag)?.tag_id ?? -1;
        type = 'Developer Skill';
      }
      else if (e.target.className.includes('red')) { // designer skills
        id = allSkills.find((s) => s.type === 'Designer Skill' && s.label === tag)?.tag_id ?? -1;
        type = 'Designer Skill';
      }
      else if (e.target.className.includes('purple')) { // soft skills
        id = allSkills.find((s) => s.type === 'Soft Skill' && s.label === tag)?.tag_id ?? -1;
        type = 'Soft Skill';
      }

      // error check: no tag found
      if (id === -1) {
        return;
      }
    }
    // if tag is selected
    else {
      // remove tag from project
      setModifiedProject({
        ...modifiedProject,
        project_types: modifiedProject.project_types.filter((t) => t.project_type !== tag),
        tags: modifiedProject.tags.filter((t) => t.tag !== tag)
      });

      // deselect tag
      e.target.className = e.target.className.replace('selected', 'unselected');

      // change icon class
      e.target.querySelector('i').className = 'fa fa-plus';
    }
  }, [allSkills, modifiedProfile]);

  // Load projects
  const loadProjectTags = useMemo(() => {
    return modifiedProfile.skills
      .map((s) => (
        <button className={`tag-button tag-button-${getTagColor(s.type)}-selected`} onClick={(e) => handleTagSelect(e)}>
          <i className="fa fa-close"></i>
          &nbsp;{s.skill}
        </button>
      ))
  }, [modifiedProfile.skills, handleTagSelect]);

  // Create element for each tag
  const renderTags = useCallback(() => {
    // no search item, render all tags
    if (searchedTags && searchedTags.length !== 0) {
      return (
        searchedTags.map(t => {
          // get id according to type of tag
          let id: number = -1; // bad default value
          if ('tag_id' in t) {
            id = t.tag_id;
          } else if ('type_id' in t) {
            id = t.type_id;
          }

          return (
            <button
              className={`tag-button tag-button-${'type' in t ? getTagColor(t.type) : 'blue'}-${isTagSelected(
                id,
                t.label,
                currentTagsTab
              )}`}
              onClick={(e) => handleTagSelect(e)}
            >
              <i
                className={
                  isTagSelected(id, t.label, currentTagsTab) === 'selected'
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
    // Developer Skill
    if (currentTagsTab === 0) {
      return allSkills
        .filter((s) => s.type === 'Developer Skill')
        .map((s) => (
          <button
            className={`tag-button tag-button-yellow-${isTagSelected(s.tag_id, s.label, currentTagsTab)}`}
            onClick={(e) => handleTagSelect(e)}
          >
            <i
              className={
                isTagSelected(s.tag_id, s.label, currentTagsTab) === 'selected'
                  ? 'fa fa-close'
                  : 'fa fa-plus'
              }
            ></i>
            &nbsp;{s.label}
          </button>
        ));
    } else if (currentTagsTab === 1) {
      return allSkills
        .filter((s) => s.type === 'Designer Skill')
        .map((s) => (
          <button
            className={`tag-button tag-button-red-${isTagSelected(s.tag_id, s.label, currentTagsTab)}`}
            onClick={(e) => handleTagSelect(e)}
          >
            <i
              className={
                isTagSelected(s.tag_id, s.label, currentTagsTab) === 'selected'
                  ? 'fa fa-close'
                  : 'fa fa-plus'
              }
            ></i>
            &nbsp;{s.label}
          </button>
        ));
    }
    else {
      return allSkills
        .filter((s) => s.type === 'Soft Skill')
        .map((s) => (
          <button
            className={`tag-button tag-button-purple-${isTagSelected(s.tag_id, s.label, currentTagsTab)}`}
            onClick={(e) => handleTagSelect(e)}
          >
            <i
              className={
                isTagSelected(s.tag_id, s.label, currentTagsTab) === 'selected'
                  ? 'fa fa-close'
                  : 'fa fa-plus'
              }
            ></i>
            &nbsp;{s.label}
          </button>
        ));
    }
  }, [searchedTags, currentTagsTab, allSkills, isTagSelected, handleTagSelect]);

  const handleSearch = useCallback((results: (Tag | ProfileData)[][]) => {
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

  // Components
  const TagSearchTabs = () => {
    let tabs = tagTabs.map((tag, i) => {
      return (
        <button
          onClick={() => { setCurrentTagsTab(i); }}
          className={`button-reset project-editor-tag-search-tab ${currentTagsTab === i ? 'tag-search-tab-active' : ''}`}
        >
          {tag}
        </button>
      );
    })
    return (
      <div id="project-editor-tag-search-tabs">
        {tabs}
      </div>
    );
  };

  return (
    <div id="profile-editor-skills" className="hidden">
      <div id="project-editor-selected-tags">
        <div className="project-editor-section-header">Selected Tags</div>
        <div className="project-editor-extra-info">
          Drag and drop to reorder
        </div>
        {/* Error tag */}
        {modifiedProfile.skills.length === 0 ? <div className="error">*At least 1 tag is required</div> : <></>}
        <div id="project-editor-selected-tags-container">
          <hr id="selected-tag-divider" />
          {/* TODO: Separate top 2 tags from others with hr element */}
          {loadProjectTags}
        </div>
      </div>

      <div id="project-editor-tag-search">
        <SearchBar dataSets={currentDataSet} onSearch={(results) => handleSearch(results)} />
        <div id="project-editor-tag-wrapper">
          <TagSearchTabs />
          <hr id="tag-search-divider" />
        </div>
        <div id="project-editor-tag-search-container">{renderTags()}</div>
      </div>
    </div>
  );
};