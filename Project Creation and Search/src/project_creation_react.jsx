const React = require('react');
const ReactDOM = require('react-dom');
import * as database from "./db.js";
//import { createRoot } from 'react-dom/client';

//title/desc/size/image/username/id/preferences elements
const titleInput = document.querySelector('#title');
const sizeInput = document.querySelector('#size');
const descInput = document.querySelector('#description');
const imgInput = document.querySelector('#image');
const idInput = document.querySelector('#id');
const prefInput = document.querySelector('#preferences');
//keyword elements
const keywordSubmit = document.querySelector('#keyword-submit');
const keyword = document.querySelector('#keyword');
const keywordContainer = document.querySelector('#keyword-container');
//role elements
const addRole = document.querySelector('#add-role');
const roles = document.querySelector('#roles');
//link elements
const linkInput = document.querySelector('#link-input');
const linkSubmit = document.querySelector('#link-submit');
const linkContainer = document.querySelector('#link-container');
//project create button
const newProject = document.querySelector('#submit');

//arrays for various input fields
let keywords = [];
let links = [];

//roleCount tracks what number to assign to role id's
let roleCount = 0;
let selectedID = -1;

//variables used when editing a project, unused if page is used for creation
let projectID = -1;

// Used to fill in the signin dropdown with available users
const initOptions = async (e) => {
  const db = await database.getData();
  if (!db) {
    console.log("ERROR: No database exists");
    return;
  }
  for (let id in db.users) {
    let newOpt = document.createElement("option");
    newOpt.value = id;
    newOpt.innerHTML = db.users[id].username;
    e.appendChild(newOpt);
  }
}

const writeProjectData = async (id = "-1", project, hasOpenings) => {
  // Encode strings
  let eTitle = encodeURI(project.title);
  let eDesc = encodeURI(project.description);

  // Write
  database.writeData({
    title: eTitle,
    description: eDesc,
    tags: project.keywords,
    isHiring: hasOpenings,
    needs: project.roles,
    owner: id
  }, "projects", projectID);
}

// Old Project creator, was used to render entire form
/*const ProjectCreator = (props) =>
{
  return (
    <>
    <div id="id-box">
      <label for="id">User: </label>
      <select id="id" name="id">
        <option value="-1">Select a user</option>
      </select>
    </div>

    <div id="title-box">
      <label for="title">Project Title: </label>
      <input type="text" id="title" name="title" />
    </div>

    <div id="size-box">
      <label for="size">Project Size: </label>
      <select id="size" name="size">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>

    <div id="desc-box">
      <label for="description">Description: </label>
      <textarea id="description" name="description"></textarea>
    </div>

    <div id="img-box">
      <input type="file" id="image" name="image" accept="image/*" />
    </div>

    <div id="keywords-box">
      <h3>Project Keywords</h3>
      <div id="keyword-container">

      </div>
      <input type="text" id="keyword" list="keyword-list" name="keyword"/>
      <datalist id="keyword-list">
        <option value="Game">Game</option>
        <option value="2d">2d</option>
        <option value="3d">3d</option>
        <option value="Analog">Analog</option>
        <option value="Digital">Digital</option>
        <option value="Casual">Casual</option>
      </datalist>
      <button type="button" id="keyword-submit" name="keyword-submit">Add keyword</button>
    </div>

    <div id="roles-box">
      <h3>Project Roles</h3>
      <button type="button" id="add-role">Add new role type</button>
      <div id="roles">

      </div>
    </div>

    <div id="prefs-box">
      <h3>Project Preferences</h3>
      <textarea id="preferences" name="preferences"></textarea>
    </div>

    <div id="links-box">
      <h3>Related Links</h3>
      <div id="link-container">

      </div>
      <input type="text" id="link-input" name="link-input"/>
      <button type="button" id="link-submit">Add link</button>
    </div>

    <button type="button" id="submit" name="submit">Create Project</button>
    <p>...This html was brought to you by React.js</p>
    </>
  );
}*/

const Keyword = (props) => 
{
  return (
    <div className='keyword' value={props.word}>
      {capitalize(props.word).replace('<', '&lt;').replace('>', '&gt;')}
      <button type='button' onClick={function () {removeKeyword(props.word)}}>x</button>
    </div>
  )
}

const KeywordContainer = (props) => 
{
  const keywordList = keywords.map(newWord =>
    <Keyword word={newWord}></Keyword>);
  
  return (
    <>{keywordList}</>
  )
}

const init = () =>
{
  //const ProjectForm = createRoot(document.getElementById('project-form'));
  //ProjectForm.render(<ProjectCreator />);
  //ReactDOM.render(<ProjectCreator />, document.getElementById('project-form'));
  console.log('is this even running?');

  initOptions(idInput);

  //Adds functions to respective buttons
  keywordSubmit.onclick = submitKeyword;
  addRole.onclick = createRole;
  linkSubmit.onclick = addLink;

  //Checks if there are queries in url
  let queryString = window.location.search;
  if (queryString != '') {
    let urlParams = new URLSearchParams(queryString);
    editProject(urlParams);
    return;
  }

  for (let i = 0; i < 3; i++) {
    createRole();
  }
  //Adds function to submit button if not editing
  newProject.onclick = createProject;

  initOptions(idInput);

  idInput.onchange = () => {
    selectedID = idInput.value;
  }
}

//Is called when url parameters are present
//To use, type '?userid=(id of user)&projectid=(id of project)' without the ''
//Replace parentheses items with the respective ids of the user and project you wish to test
const editProject = async (urlParams) => {
  projectID = urlParams.get('projectid');

  const snapshot = await database.getData();
  
  if (snapshot.projects[projectID] == undefined) {
    console.log('project not found, loading as creation page');
    //If project is not found, continues loading as project creation page
    for (let i = 0; i < 3; i++) {
      createRole();
    }
    newProject.onclick = createProject;
    return;
  }

  document.querySelector('h1').innerHTML = 'Edit Project';
  let project = snapshot.projects[projectID];
  console.log(project); //For test purposes

  //Make username and id inputs unusable
  document.querySelector('#id-box').innerHTML = `Project ID: ${projectID}`;
  selectedID = snapshot.projects[projectID].owner;

  //Fill in inputs with current project data
  titleInput.value = decode(project.title);
  descInput.value = decode(project.description);

  //Fill in keywords
  for (let word of project.tags) {
    addKeyword(word);
  }

  //Fill in roles
  for (let role of project.needs) {
    createCustomRole(role.roleType, role.roleNum);
  }

  //Assign function to submit button & change display
  newProject.innerHTML = "Save Changes";
  newProject.onclick = saveEdits;
}

//Creates a keyword based on content of the keyword input
const submitKeyword = () => {
  //Check if input has content, returns if empty
  if (keyword.value == '') {
    console.log('keyword input is empty, no keyword created');
    return;
  }
  let word = keyword.value.toLowerCase();
  //Check if keyword already exists, exits if it does
  if (keywords.indexOf(word) != -1) {
    console.log('keyword already exists');
    return;
  }
  addKeyword(word)
  //Clear content of keyword input
  keyword.value = '';
}

//Adds a keyword to keywords list and container
const addKeyword = (word) => {
  // Add keyword to keywords array
  keywords.push(word);
  // Re-render keyword container
  ReactDOM.render(<KeywordContainer />, keywordContainer);
  console.log('keyword created');
}

//Removes the respective keyword element from keyword container
//Also removes the keyword from the 'keywords' array
const removeKeyword = (word) => {
  console.log('removing keyword');
  let index = keywords.indexOf(word);
  keywords.splice(index, 1);
  // Re-render keyword container
  ReactDOM.render(<KeywordContainer />, keywordContainer);
}

//Adds a new role to project roles
const createRole = () => {
  roleCount++;
  //Create body of new role element
  let element = document.createElement('div');
  element.setAttribute("class", "role");
  element.innerHTML = `
    <label for="role${roleCount}">Role:</label>
    <select id="role${roleCount}" name="role${roleCount}">
      <option value="general">General</option>
      <option value="programmer">Programmer</option>
      <option value="artist">Artist</option>
      <option value="designer">Designer</option>
      <option value="tester">Tester</option>
      <option value="manager">Manager</option>
    </select>
    <label for="num${roleCount}">Positions:</label>
    <input type="number" id="num${roleCount}" name="num${roleCount}" min="1" value="3">
  `
  //Add remove button and assign function to it
  let removeButton = element.appendChild(document.createElement('button'));
  removeButton.innerHTML = '-';
  removeButton.onclick = function () { removeItem(element) };
  //Add element to role list
  roles.appendChild(element);
  console.log('new role created');
}

const createCustomRole = (roleType, roleNum) => {
  roleCount++;

  let element = document.createElement('div');
  element.setAttribute("class", "role");
  element.innerHTML = `
    <label for="role${roleCount}">Role:</label>
    <select id="role${roleCount}" name="role${roleCount}">
      <option value="general">General</option>
      <option value="programmer">Programmer</option>
      <option value="artist">Artist</option>
      <option value="designer">Designer</option>
      <option value="tester">Tester</option>
      <option value="manager">Manager</option>
    </select>
    <label for="num${roleCount}">Positions:</label>
    <input type="number" id="num${roleCount}" name="num${roleCount}" min="1" value="${roleNum}">
  `

  let options = element.querySelectorAll('option');
  for (let option of options) {
    if (option.value == roleType) {
      option.setAttribute('selected', 'selected');
      break;
    }
  }

  //Add remove button and assign function to it
  let removeButton = element.appendChild(document.createElement('button'));
  removeButton.innerHTML = '-';
  removeButton.onclick = function () { removeItem(element) };
  //Add element to role list
  roles.appendChild(element);
  console.log('new role created');
}

//Creates a new link element and adds it to relevant project links
const addLink = () => {
  //Get link from input
  let newLink = linkInput.value;

  //Test if input is a valid link
  try {
    let url = new URL(newLink);
  } catch (_) {
    console.log('invalid link');
    return;
  }
  //Create div item that will contain link and button
  let linkDiv = document.createElement('div');
  linkDiv.setAttribute('class', 'rel-link');
  linkDiv.value = newLink;
  //Create new link element
  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', newLink);
  linkElement.setAttribute('target', '_blank');
  linkElement.innerHTML = newLink;
  linkDiv.appendChild(linkElement);
  //Add remove button and assign function to it
  let removeButton = linkDiv.appendChild(document.createElement('button'));
  removeButton.innerHTML = 'x';
  removeButton.onclick = function () { removeLink(linkDiv) };
  //Add element to link container, add link to link array and remove input content
  linkContainer.appendChild(linkDiv);
  links.push(newLink);
  linkInput.value = '';
}

//Removes the respective link from the link container and link array
const removeLink = (element) => {
  console.log('removing link');
  let index = links.indexOf(element.value);
  links.splice(index, 1);
  element.remove();
}

//Removes an element when called
//element - the html element that is removed when called
const removeItem = (element) => {
  console.log('removing element');
  element.remove();
}

//Gets values from inputs and compiles into a json object
const getInputs = () => {
  //Get title, description, and size inputs
  let title = titleInput.value;
  let size = sizeInput.value;
  let description = descInput.value;
  let preferences = prefInput.value;
  //Run checks to ensure fields are filled & valid, exit if not
  if (title == '' || description == '' || keywords.length == 0) {
    console.log('Not all fields filled, requires username, title, description, & at least 1 keyword')
    return undefined;
  } else if (selectedID == '' || selectedID < 0) {
    console.log('Please use only positive numbers in project ID');
    return undefined;
  }
  //Create array of role objects
  let roles = [];
  let roleCheck = [];
  let roleList = document.getElementsByClassName('role');
  for (let item of roleList) {
    let roleType = item.querySelector('select').value;
    //Check if there is no duplicate role titles
    if (roleCheck.indexOf(roleType) != -1) {
      console.log('Multiple listings of same role type exist, please ensure each role is unique');
      return undefined;
    }
    roleCheck.push(roleType);
    let roleNum = item.querySelector('input').value;
    //Check if number of positions is valid
    if (roleNum == '' || roleNum < 0) {
      console.log('Please use only positive numbers in position numbers');
      return undefined;
    }
    let newRole = { roleType, roleNum };
    roles.push(newRole);
  }
  //let hiring = roles.length ? true : false;
  //Construct json object
  let json = { title, size, description, keywords, roles };
  return json;
}

//Create a JSON object using input values & uploads it to the user's projects
const createProject = () => {
  let json = getInputs();
  let hiring = json.roles.length ? true : false;
  writeProjectData(selectedID, json, hiring);
}

//Overwrite the data of the current project being edited with current input data
const saveEdits = () => {
  let json = getInputs();
  let hiring = json.roles.length ? true : false;
  writeProjectData(selectedID, json, hiring, true);
}

//Basic help function, capitalizes the inputted word
const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

//Help function, condenses decoding & string replacing into a single function
const decode = (content) => {
  return decodeURI(content).replace('<', '&lt;').replace('>', '&gt;');
}

init();