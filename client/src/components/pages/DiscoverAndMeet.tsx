//Styles
import '../Styles/credits.css';
import '../Styles/discoverMeet.css';
import '../Styles/emailConfirmation.css';
import '../Styles/general.css';
import '../Styles/loginSignup.css';
import '../Styles/messages.css';
import '../Styles/notification.css';
import '../Styles/profile.css';
import '../Styles/projects.css';
import '../Styles/settings.css';
import '../Styles/pages.css';

import { useMemo, useState } from 'react';
import CreditsFooter from '../CreditsFooter';
import { DiscoverCarousel } from '../DiscoverCarousel';
import { DiscoverFilters } from '../DiscoverFilters';
import { Header } from '../Header';
import { PanelBox } from '../PanelBox';
import { ThemeIcon } from '../ThemeIcon';
import ToTopButton from '../ToTopButton';

const DiscoverAndMeet = ({ category }) => {
  // Should probably move Interfaces to separate file to prevent duplicates
  // --------------------
  // Interfaces
  // --------------------
  interface Item {
    tags: Tag[];
  }

  interface Tag {
    tag: string;
    color: string;
  }

  // --------------------
  // Components
  // --------------------
  //Hero banner for profile display
  const profileHero = (
    <div id='discover-hero'>
      {
        <div id="profile-hero-bg1">
          <div id="profile-hero">
            <div id="profile-hero-blurb-1" className="profile-hero-blurb">
              <ThemeIcon
                light={'assets/bannerImages/people1_light.png'}
                dark={'assets/bannerImages/people1_dark.png'}
                id={'profile-hero-img-1'}
              />
              {/* <div>
                            <span className='profile-hero-highlight'>Explore profiles</span> to see each other's personality, expertise, and project history.
                            </div> */}
            </div>

            <div id="profile-hero-blurb-2" className="profile-hero-blurb">
              <h2>Look for people to work with!</h2>
              <ThemeIcon
                light={'assets/bannerImages/people2_light.png'}
                dark={'assets/bannerImages/people2_dark.png'}
                id={'profile-hero-img-2'}
              />
              {/* <div className="panel-text">
                            Find someone interesting? <span className='profile-hero-highlight'>Send a message!</span><br/>
                            <div id='spacer'></div>
                            <span className='profile-hero-highlight'>Introduce yourself</span>, share project ideas, and show interest in working together!
                            </div> */}
            </div>

            <div id="profile-hero-blurb-3" className="profile-hero-blurb">
              <ThemeIcon
                light={'assets/bannerImages/people3_light.png'}
                dark={'assets/bannerImages/people3_dark.png'}
                id={'profile-hero-img-3'}
              />
              {/* <div>
                            Keep your profile up to date with your skills, project preferences, and interests to 
                            <span className='profile-hero-highlight'> find your group!</span>
                            </div> */}
            </div>
          </div>
        </div>
      }
    </div>
  );

  // --------------------
  // Global variables
  // --------------------
  // Important for ensuring data has properly loaded
  const [dataLoaded, setDataLoaded] = useState(false);

  // Full data and displayed data based on filter/search query
  const [fullItemList, setFullItemList] = useState<Item[]>([]);
  const [filteredItemList, setFilteredItemList] = useState<Item[]>([]);

  // Need this for searching
  let tempItemList: Item[] = fullItemList;

  // List that holds trimmed data for searching. Empty before fullItemList is initialized
  const [itemSearchData, setItemSearchData] = useState([]);

  // Format data for use with SearchBar, which requires it to be: [{ data: }]
  const dataSet = useMemo(() => {
    return [{ data: itemSearchData }];
  }, [itemSearchData]);

  // When passing in data for project carousel, just pass in first three projects
  const heroContent =
    category === 'projects' ? <DiscoverCarousel dataList={fullItemList.slice(0, 3)} /> : profileHero;

  // --------------------
  // Helper functions
  // --------------------
  const getData = async () => {
    const url = `/api/${category === 'projects' ? 'projects' : 'users'}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Don't assign if there's no array returned
      if (data.data !== undefined) {
        setFullItemList(data.data);
        setFilteredItemList(data.data);
        setItemSearchData(
          data.data.map((item) => {
            if (category === 'projects') {
              return { name: item.title, description: item.hook };
            } else {
              return {
                name: `${item.first_name} ${item.last_name}`,
                username: item.username,
                bio: item.bio,
              };
            }
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(`Unknown error: ${error}`);
      }
    }

    setDataLoaded(true);
  };

  if (!dataLoaded) {
    getData();
  }

  // Updates filtered project list with new search info
  const searchItems = (searchResults) => {
    // Clear list before handling search
    tempItemList = [];

    for (const result of searchResults[0]) {
      for (const item of itemSearchData) {
        if (result === item) {
          tempItemList.push(fullItemList[itemSearchData.indexOf(item)]);
          continue;
        }
      }
    }

    // If no items were found
    if (tempItemList.length === 0) {
      setFilteredItemList([]); // Clear the displayed list
      console.log('No matching items found.');
    } else {
      // setFilteredItemList(tempItemList);
      updateItemList([]); // Don't check for tags after searching
    }
  };

  const updateItemList = (activeTagFilters) => {
    let tagFilteredList = tempItemList.filter((item) => {
      let tagFilterCheck = true;

      for (const tag of activeTagFilters) {
        if (category === 'projects') {
          // Check project type by name since IDs are not unique relative to tags
          if (tag.type === 'Project Type') {
            if (item.project_types) {
              let projectTypes = item.project_types.map((tag) => tag.project_type.toLowerCase());

              if (!projectTypes.includes(tag.label.toLowerCase())) {
                tagFilterCheck = false;
                break;
              } 
            } else {
              tagFilterCheck = false;
              break;
            }
          }
          
          // Tag check can be done by ID
          if (tag.tag_id) {
            if (item.tags) {
              let tagIDs = item.tags.map((tag) => tag.id);

              if (!tagIDs.includes(tag.tag_id)) {
                tagFilterCheck = false;
                break;
              }
            } else {
              tagFilterCheck = false;
              break;
            }
          }
        } else {
          // Check role and major by name since IDs are not unique relative to tags
          if (tag.type === 'Role') {
            if (item.job_title) {
              if (item.job_title.toLowerCase() !== tag.label.toLowerCase()) {
                tagFilterCheck = false;
                break;
              }
            } else {
              tagFilterCheck = false;
              break;
            }
          } else if (tag.type === 'Major') {
            if (item.major) {
              if (item.major.toLowerCase() !== tag.label.toLowerCase()) {
                tagFilterCheck = false;
                break;
              }
            } else {
              tagFilterCheck = false;
              break;
            }
          } else if (tag.tag_id) {
            // Skill check can be done by ID
            if (item.skills) {
              let skillIDs = item.skills.map((skill) => skill.id);

              if (!skillIDs.includes(tag.tag_id)) {
                tagFilterCheck = false;
                break;
              }
            } else {
              tagFilterCheck = false;
              break;
            }
          }
        }
      }

      return tagFilterCheck;
    });

    // If no tags are currently selected, render all projects
    // !! Needs to be skipped if searchbar has any input !!
    if (tagFilteredList.length === 0 && activeTagFilters.length === 0) {
      tagFilteredList = JSON.parse(JSON.stringify(fullItemList));
    }

    // Set displayed projects
    setFilteredItemList(tagFilteredList);
  };

  return (
    <div className="page">
      {/* Search bar and profile/notification buttons */}
      <Header dataSets={dataSet} onSearch={searchItems} />
      {/* Contains the hero display, carousel if projects, profile intro if profiles*/}
      {heroContent}

      {/* Contains tag filters & button to access more filters 
                When page loads, determine if project tags or profile tags should be used
                Clicking a tag filter adds it to a list & updates panel display based on that list
                Changes to filters via filter menu are only applied after a confirmation
            */}
      <DiscoverFilters category={category} updateItemList={updateItemList} />

      {/* Panel container. itemAddInterval can be whatever. 25 feels good for now */}
      <div id="discover-panel-box">
        {/* If filteredItemList isn't done loading, display a loading bar */}
        {(filteredItemList.length === 0) ? (
          <div className='spinning-loader'></div>
        ) : (
          <PanelBox category={category} itemList={filteredItemList} itemAddInterval={25} />
        )}
      </div>
      <CreditsFooter />
      <ToTopButton />
    </div>
  );
};

export const Discover = () => {
  return <DiscoverAndMeet category={'projects'} />;
};

export const Meet = () => {
  return <DiscoverAndMeet category={'profiles'} />;
};
