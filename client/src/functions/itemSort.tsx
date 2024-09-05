import { projects, profiles } from "../constants/fakeData";

//This file will hold code that will allow sorting and filtering projects & people via tags
//For now, this will be just an outline made in code comments

//Get list of tags (string array) to use for sorting
//Are we sorting through projects or people?
//if projects...
  //get projects currently in the database
  //Create an empty array to hold projects that meet criteria (project array)
  //iterate through all the projects. For each one...
    //Compare the list of tags we are using to the tags of the project
    //If project contains the specified tags...
      //add project to sorted list
  //Once all projects are filtered, return the filled list
//if people...
  //get people currently in the database
  //Create an empty array to hold people that meet criteria (profile array)
  //iterate through all people. For each one...
    //Compare the list of tags we are using to the tags of the person
    //If person contains the specified tags...
      //add person to sorted list
  //Once all people are filtered, return the filled list

const sortItems = (tags : String[]) => {

}

export {sortItems};