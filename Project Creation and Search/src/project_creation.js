//Firebase data taken from search prototype
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBimRr67hSVEwVyo4QhDnPNyGNfG_KDwIo",
  authDomain: "lfg-test-7da4d.firebaseapp.com",
  projectId: "lfg-test-7da4d",
  storageBucket: "lfg-test-7da4d.appspot.com",
  messagingSenderId: "362431495411",
  appId: "1:362431495411:web:964887f9b6f667c6f0cb86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const writeProjectData = (owner, id = 0, project, hasOpenings) => {
  // encode strings
  let eTitle = encodeURI(project.title);
  let eDesc = encodeURI(project.description);

  const db = getDatabase(app);
  const r = ref(db, `users/${owner}/${id}`);

  set(r, {
    title: eTitle,
    description: eDesc,
    tags: project.keywords,
    isHiring: hasOpenings,
    needs: project.roles
  });
};

//title/desc/size/image/username/id/preferences elements
const titleInput = document.querySelector('#title');
const sizeInput = document.querySelector('#size');
const descInput = document.querySelector('#description');
const imgInput = document.querySelector('#image');
const userInput = document.querySelector('#user');
const idInput = document.querySelector('#id');
const prefInput = document.querySelector('preferences');
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

let keywords = [];
let links = [];

//roleCount tracks what number to assign to role id's
let roleCount = 0;

//Runs after loading
const init = () =>
{
  console.log('initializing');

  //Adds functions to respective buttons
  keywordSubmit.onclick = submitKeyword;
  addRole.onclick = createRole;
  linkSubmit.onclick = addLink;
  
  //Checks if there are queries in url
  /*let queryString = window.location.search;
  if (queryString != '')
  {
    let urlParams = new URLSearchParams(queryString);
    editProject(urlParams);
    return;
  }*/

  for (let i = 0; i < 3; i++){
    createRole();
  }
  //Adds function to submit button if not editing
  newProject.onclick = createProject;
}

const editProject = async (urlParams) =>
{
  let username = urlParams.get('username');
  let id = urlParams.get('projectid');

  const dbRef = ref(getDatabase(app));
  await get(child(dbRef, `users`)).then((snapshot) => {
    if (!snapshot.exists() || snapshot.val()[username] == undefined || snapshot.val()[username][id] == undefined)
    {
      console.log('project not found, loading as creation page'); //For test purposes
      //If project is not found, continues loading as project creation page
      for (let i = 0; i < 3; i++){
        createRole();
      }
      newProject.onclick = createProject;
      return;
    }

    let project = snapshot.val()[username][id];
    console.log(project); //For test purposes

    //Make username and id inputs unusable
    document.querySelector('#user-box').innerHTML = `Username: ${username}`;
    document.querySelector('id-box').innerHTML = `Project ID: ${id}`;

    //Fill in inputs with current project data
    titleInput.value = decode(project.title);
    descInput.value = decode(project.description);

    //Fill in keywords
    for (let word of project.tags)
    {
      addKeyword(word);
    }

    //Fill in roles
  }).catch((error) => {
    console.error(error);
  });
}

//Creates a keyword based on content of the keyword input
const submitKeyword = () =>
{
  //Check if input has content, returns if empty
  if (keyword.value == '') {
    console.log('keyword input is empty, no keyword created');
    return;
  }
  let word = keyword.value.toLowerCase();
  //Check if keyword already exists, exits if it does
  if (keywords.indexOf(word) != -1)
  {
    console.log('keyword already exists');
    return;
  }
  addKeyword(word)
  //Clear content of keyword input
  keyword.value = '';
}

//Adds a keyword to keywords list and container
const addKeyword = (word) =>
{
  //Create element with content from keyword input
  let element = document.createElement('div');
  element.setAttribute("class", "keyword");
  element.innerHTML = `${capitalize(word).replace('<', '&lt;').replace('>', '&gt;')}`;
  element.value = word;
  //Add remove button and assign function to it
  let removeButton = element.appendChild(document.createElement('button'));
  removeButton.innerHTML = 'x';
  removeButton.onclick = function() {removeKeyword(element)};
  //Add keyword to keywords array
  keywords.push(word);
  //Add element to keyword container
  keywordContainer.appendChild(element);
  console.log('keyword created');
}

//Removes the respective keyword element from keyword container
//Also removes the keyword from the 'keywords' array
const removeKeyword = (element) =>
{
  console.log('removing keyword');
  let index = keywords.indexOf(element.value);
  keywords.splice(index, 1);
  element.remove();
}

//Adds a new role to project roles
const createRole = () =>
{
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
  removeButton.onclick = function() {removeItem(element)};
  //Add element to role list
  roles.appendChild(element);
  console.log('new role created');
}

/*const createCustomRole = () =>
{
  roleCount++;

  let element = document.createElement('div');
  element.setAttribute("class", "role");
}*/

//Creates a new link element and adds it to relevant project links
const addLink = () =>
{
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
  linkElement.setAttribute('target','_blank');
  linkElement.innerHTML = newLink;
  linkDiv.appendChild(linkElement);
  //Add remove button and assign function to it
  let removeButton = linkDiv.appendChild(document.createElement('button'));
  removeButton.innerHTML = 'x';
  removeButton.onclick = function() {removeLink(linkDiv)};
  //Add element to link container, add link to link array and remove input content
  linkContainer.appendChild(linkDiv);
  links.push(newLink);
  linkInput.value = '';
}

//Removes the respective link from the link container and link array
const removeLink = (element) => 
{
  console.log('removing link');
  let index = links.indexOf(element.value);
  links.splice(index, 1);
  element.remove();
}

//Removes an element when called
//element - the html element that is removed when called
const removeItem = (element) =>
{
  console.log('removing element');
  element.remove();
}

//Create a JSON object using input values
const createProject = () =>
{
  //Get username and ID inputs
  let username = userInput.value;
  let projectId = idInput.value;
  //Get title, description, and size inputs
  let title = titleInput.value;
  let size = sizeInput.value;
  let description = descInput.value;
  let preferences = prefInput.value;
  //Run checks to ensure fields are filled & valid, exit if not
  if (username == '' || title == '' || description == '' || keywords.length == 0)
  {
    console.log('Not all fields filled, requires username, title, description, & at least 1 keyword')
    return;
  } else if (projectId == '' || projectId < 0)
  {
    console.log('Please use only positive numbers in project ID');
    return;
  }
  //Create array of role objects
  let roles = [];
  let roleCheck = [];
  let roleList = document.getElementsByClassName('role');
  for (let item of roleList)
  {
    let roleType = item.querySelector('select').value;
    //Check if there is no duplicate role titles
    if (roleCheck.indexOf(roleType) != -1)
    {
      console.log('Multiple listings of same role type exist, please ensure each role is unique');
      return;
    }
    roleCheck.push(roleType);
    let roleNum = item.querySelector('input').value;
    //Check if number of positions is valid
    if (roleNum == '' || roleNum < 0)
    {
      console.log('Please use only positive numbers in position numbers');
      return;
    }
    let newRole = {roleType, roleNum};
    roles.push(newRole);
  }
  let hiring = roles.length ? true : false;
  //Construct json object
  let json = {title, size, description, keywords, roles};
  //Currently unused items: links, preferences, image
  //Left out to not cause problems with current firebase setup
  writeProjectData(username, projectId, json, hiring);
}

//Basic help function, capitalizes the inputted word
const capitalize = (word) =>
{
  return word.charAt(0).toUpperCase() + word.slice(1);
}

//Help function, condenses decoding & string replacing into a single function
const decode = (content) =>
{
  return decodeURI(content).replace('<', '&lt;').replace('>', '&gt;');
}

init();