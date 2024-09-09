import { useState } from 'react';
import { sortItems } from '../functions/itemSort';
import { tags } from "../constants/tags";
import { SearchBar } from './SearchBar';
import { interests } from "../constants/interests";
import { softSkills, hardSkills, proficiencies } from "../constants/skills";

//This component will contain a list of tag buttons that can be used to filter projects and profiles

//props used: 
//projectFilter - boolean, if true this filters projects, if false this filters profiles
//setUseState - useState function to set states using filtered datasets
export const TagFilter = ({projectFilter, setUseState}) => {
  //Determine what we are filtering for; this tells what set of tags to use
  //create empty tag array to be filled based on this
  let tagsList : string[];
  //if projects...
  if (projectFilter) {
    //fill array using 'tags'
    tagsList = tags;
  } else { //if people...
    //fill array using 'softSkills', 'hardSkills', & 'proficiencies'
    tagsList = interests;
    for (let item of softSkills) {
      tagsList.push(item);
    }
    for (let item of hardSkills) {
      tagsList.push(item);
    }
    for (let item of proficiencies) {
      tagsList.push(item);
    }
  }
  //create useState using this array; this will be used for 'tag searching' and modify display accordingly
  let [displayedTags, setDisplayedTags] = useState(tagsList);
  //create empty array, which will be filled with tags selected by user
  let selectedTags : string[] = [];

  //toggle tag function
  //Runs when a tag item is clicked, either adds or removes tag from selected tag array
  //takes in a string representing the tag being selected
  const toggleTag = (tag : string) => {
    //First, check if tag is included in selected tag array
    //if the tag is not there...
    if (!selectedTags.includes(tag)) {
      //push the tag of the current selected tag in question
      selectedTags.push(tag);
    } else { //otherwise (if the tag IS there)...
      //remove the tag from the array
      selectedTags.splice(selectedTags.indexOf(tag), 1);
    }
    //In both cases, toggle the display of the tag in question to show it is selected
    //Undetermined on how to set up display functions yet, will save for later
    console.log(selectedTags);
  }
  

  //filter funciton
  //Also utilizes itemSort.tsx for sorting code (for now, ugh.)
  const filter = () => {
    //Passes in selected tag array to be run by sortItems
    let filteredData = sortItems(selectedTags, projectFilter);
    //Use returned data with the setUseState function passed into this component
    setUseState(filteredData); //May need adjustments due to same-name useState stuff
    //Additional stuff - if component is part of a popup or dropdown, have this function close it as well
    console.log(selectedTags);
  }


  //component HTML
  return (
    <>
      {/*Include searchbar component (check what searchbar needs to run correctly)*/}
      <SearchBar dataSets={[{data: tagsList}]} onSearch={setDisplayedTags}/>

      <div id='tag-filter-list'>
        {
          //For each item in the tag array...
          displayedTags.map(tag => {
            //Create an element containing the name of the tag
            //Make it clickable, assign toggle tag function to it
            //If tag is already in selected tags...
              //Use selected tag classname
            //Otherwise...
              //Use unselected tag classname
            return (
              <div className={'tag-filter'} onClick={() => toggleTag(tag)}>{tag}</div>
            )

          })
        }
      </div>

      {/* Include filter button, which runs filter function */}
      <button onClick={filter}>Filter</button>
      <button onClick={() => console.log(selectedTags)}>show selected tags</button>
    </>
  )
}