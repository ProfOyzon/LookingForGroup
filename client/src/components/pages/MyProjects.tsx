import '../Styles/pages.css';

// import { MyProjectsDisplay } from "../MyProjectsDisplay";
// import { profiles } from "../../constants/fakeData";
import { useState } from 'react';
// import { PagePopup, openClosePopup } from "../PagePopup";
import ToTopButton from '../ToTopButton';
import CreditsFooter from '../CreditsFooter';
import MyProjectsDisplayList from '../MyProjectsDisplayList';
import MyProjectsDisplayGrid from '../MyProjectsDisplayGrid';
import { Header } from '../Header';
import { ThemeIcon } from '../ThemeIcon';

const MyProjects = () => {
  // const [UID, setUID] = useState(profiles[0]._id);
  // const [activePage, setActivePage] = useState(0);

  const [displayMode, setDisplayMode] = useState('grid');
  // Can be:
  // - grid
  // - list
  const [sortMethod, setSortMethod] = useState('newest');
  // Can be:
  // - newest
  // - oldest
  // - a-z
  // - z-a
  const [projectsList, setProjectsList] = useState();
  const [currentSearch, setCurrentSearch] = useState('');
  // const [bannerImage, setBannerImage] = useState(require("../../images/projects_header_light.png"));

  const getProjects = async (userID: number) => {
    const url = `/api/users/${userID}/projects`;
    try {
      let response = await fetch(url);

      const rawData = await response.json();
      setProjectsList(rawData.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (projectsList === undefined) {
    getProjects(1);
  }
  // else {
  //     if (projectsList.length < 20) {
  //         let tempList = new Array(0);
  //         for (let i = 0; i < 20; i++) {
  //             if (i < projectsList.length) {
  //                 tempList.push(projectsList[i]);
  //             }
  //             else {
  //                 tempList.push({
  //                     created_at: "2024-10-01T17:33:11.000Z",
  //                     hook: "",
  //                     thumbnail: "",
  //                     title: "Test",
  //                     project_id: 1,
  //                 });
  //             }
  //         }
  //         setProjectsList(tempList);
  //     }
  // }

  const checkIfAnyWordStartsWith = (title: string, snippit: string) => {
    let words = title.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (words[i].substring(0, snippit.length) == snippit) {
        return true;
      }
    }
    return false;
  };

  const sortProjects = () => {
    if (projectsList !== undefined) {
      let tempList = new Array(0);
      if (currentSearch === '') {
        for (let i = 0; i < projectsList.length; i++) {
          tempList.push(projectsList[i]);
        }
      } else {
        for (let i = 0; i < projectsList.length; i++) {
          if (
            checkIfAnyWordStartsWith(
              projectsList[i].title.toLowerCase(),
              currentSearch.toLowerCase()
            )
          ) {
            tempList.push(projectsList[i]);
          }
        }
      }

      switch (sortMethod) {
        case 'newest':
          return tempList.toSorted((a, b) => a.created_at - b.created_at);
          break;

        case 'oldest':
          return tempList.toSorted((a, b) => b.created_at - a.created_at);
          break;

        case 'a-z':
          return tempList.toSorted((a, b) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          );
          break;

        case 'z-a':
          return tempList.toSorted((a, b) =>
            b.title.toLowerCase().localeCompare(a.title.toLowerCase())
          );
          break;
      }
    }
  };

  const toggleDisplayMode = () => {
    if (displayMode === 'grid') {
      setDisplayMode('list');
    } else if (displayMode === 'list') {
      setDisplayMode('grid');
    }
  };

  let projectListSection = <></>;
  if (displayMode === 'grid') {
    let tempList = sortProjects();
    projectListSection = (
      <>
        {/* Projects List */}
        <div className="my-projects-grid">
          {tempList === undefined
            ? ''
            : tempList.map((project) => {
                return <MyProjectsDisplayGrid projectData={project}></MyProjectsDisplayGrid>;
              })}
        </div>
      </>
    );
  } else if (displayMode === 'list') {
    let tempList = sortProjects();
    projectListSection = (
      <>
        {/* Projects List Header */}
        <div className="my-projects-list-header">
          <div className="project-header-label title">Project Title</div>
          <div className="project-header-label status">Status</div>
          <div className="project-header-label date">Date Created</div>
          <div className="project-header-label options"></div>
        </div>

        {/* Projects List */}
        <div className="my-projects-list">
          {tempList === undefined
            ? ''
            : tempList.map((project) => {
                return <MyProjectsDisplayList projectData={project}></MyProjectsDisplayList>;
              })}
        </div>
      </>
    );
  }

  return (
    <div className="page" id="my-projects">
      {/* Top Bar */}
      {/* <div className="my-projects-top-bar"> */}
      {/* Search Bar */}
      {/* <div className="my-projects-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" className="my-projects-searchbar"
                        value={currentSearch} onChange={(e) => {setCurrentSearch(e.target.value)}} placeholder="Search"></input>
                </div> */}

      {/* Profile */}
      {/* <div className="my-projects-profile">
                    <i className="fa-solid fa-circle-user"></i>
                    <i className="fa-solid fa-caret-down"></i>
                </div> */}
      {/* </div> */}
      <Header dataSets={[{ projectsList }]} onSearch={setCurrentSearch} />

      {/* Banner */}
      <ThemeIcon
        light={'assets/projects_header_light.png'}
        dark={'assets/projects_header_dark.png'}
        alt={'My Projects Banner Light'}
        addClass={'my-projects-banner'}
      />

      {/* Header */}
      <div className="my-projects-header-row">
        {/* All Projects Button */}
        <button className="my-projects-all-projects-button" onClick={(e) => {}}>
          All Projects
        </button>

        {/* Sort By Drop Down */}
        <select
          className="my-projects-sort-list"
          value={sortMethod}
          onChange={(e) => {
            setSortMethod(e.target.value);
          }}
        >
          <option value="sort" disabled>
            Sort by
          </option>
          <option value="newest">&#xf017;&nbsp; Newest</option>
          <option value="oldest">&#xf017;&nbsp; Oldest</option>
          <option value="a-z">&#xf062;&nbsp; A-Z</option>
          <option value="z-a">&#xf063;&nbsp; Z-A</option>
        </select>

        {/* Display Switch */}
        <div
          className="my-projects-display-switch"
          onClick={(e) => {
            toggleDisplayMode();
          }}
        >
          <div className="display-switch-option list" id={displayMode === 'list' ? 'selected' : ''}>
            <i className="fa-solid fa-bars"></i>
          </div>
          <div className="display-switch-option grid" id={displayMode === 'grid' ? 'selected' : ''}>
            <i className="fa-solid fa-border-all"></i>
          </div>
        </div>

        {/* New Project Button */}
        <button className="my-projects-new-project-button" onClick={(e) => {}}>
          + New Project
        </button>
      </div>

      <hr />

      {/* Project Grid/List */}
      {projectListSection}
      <CreditsFooter />
    </div>
  );
};

export default MyProjects;
