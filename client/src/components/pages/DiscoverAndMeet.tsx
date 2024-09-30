import "./pages.css";
import { ProjectCard } from "../ProjectCard";
import { ProfileCard } from "../ProfileCard";
import { ProjectPanel } from "../ProjectPanel";
import { ProfilePanel } from "../ProfilePanel";
import { DiscoverButton } from "../DiscoverButton";
import { NotifButton } from "../NotificationButton";
import { SearchBar } from "../SearchBar";
import { TagFilter } from "../TagFilter";
import "../Styles/styles.css";
import { projects } from "../../constants/fakeData";
import { profiles } from "../../constants/fakeData";
import * as tags from "../../constants/tags";
import { Children, useCallback } from "react";
import { sortItems } from "../../functions/itemSort";
import { useState } from 'react';
import { useEffect } from 'react' ;
import CreditsFooter from '../CreditsFooter';
import ToTopButton from "../ToTopButton";

const DiscoverAndMeet = () => {
  //Get whether we are loading projects or profiles using search query
  let urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  //Set the hero component based on projects or profiles
  //const heroComponent = category === 'projects' ? (component 1) : (component 2)
  //Get a list of tags to use for tag filters (project tags for projects, profession tags for profiles)
  const tagList = category === 'projects' ? tags.tags : tags.proficiencies;
  return(
    <>
    {/* Contains the hero display, carossel if projects, profile intro if profiles*/}
    <div>

    </div>

    {/* Contains tag filters & button to access more filters 
      When page loads, determine if project tags or profile tags should be used
      Clicking a tag filter adds it to a list & updates panel display based on that list
      Changes to filters via filter menu are only applied after a confirmation
    */}
    <div>
      <div>
        
      </div>
      <button>Filters</button>
    </div>

    {/* Panel container */}
    <div>

    </div>
    </>
  )
}

export default DiscoverAndMeet;