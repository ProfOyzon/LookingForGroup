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

const generateRandomID = async (db, uid) => {
  // Generate a random ID
  let tryID = Math.floor(Math.random() * 30000);

  // If the ID already exists, generate it again until unique
  await get(child(ref(db), `lgf-test/projects`)).then(async snapshot => {
    if (snapshot.exists())
      for (let id in snapshot.val()) {
        if (id == tryID) tryID = await generateRandomID(db, uid);
      }
  });

  return tryID;
}

const initOptions = async (e) => {
  const db = getDatabase(app);
  await get(child(ref(db), "lfg-test/users")).then(snapshot => {
    if(snapshot.exists()){
      for(let id in snapshot.val()){
        let newOpt = document.createElement("option");
        newOpt.value = id;
        newOpt.innerHTML = snapshot.val()[id].username;
        e.appendChild(newOpt);
      }
    }
  })
}

const writeProjectData = async (id = "-1", project, hasOpenings, editing = false) => {
  console.log(id);

  // encode strings
  let eTitle = encodeURI(project.title);
  let eDesc = encodeURI(project.description);

  const db = getDatabase(app);

  get(child(ref(db), `lfg-test`)).then(snapshot => {
    if (snapshot.exists()) {
      //Ensure the entered ID exists in the database
      for (let user in snapshot.val().users) {
        console.log(user);
        if (user == id) {
          return user;
        };
      }
      return -1;
    }
  }).then(async userID => {
    if (userID >= 0) {
      //Generate new project id if project is new, otherwise use current project id
      if (!editing)
      {
        const pid = await generateRandomID(db, userID)
        let r = ref(db, `lfg-test/projects/${pid}`);

        set(r, {
          title: eTitle,
          description: eDesc,
          tags: project.keywords,
          isHiring: hasOpenings,
          needs: project.roles,
          owner: userID
        });
        
        r = ref(db, `lfg-test/users/${userID}/projects/${pid}`);
        
        set(r,{
          status: "owner"
        })
        
      }
      else {
        const r = ref(db, `lfg-test/projects/${projectID}`);

        set(r, {
          title: eTitle,
          description: eDesc,
          tags: project.keywords,
          isHiring: hasOpenings,
          needs: project.roles,
          owner: id
        });
      } 
    }
    else{
      console.log("User ID must correspond to existing user.")
    }
  });
};

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

//Runs after loading
const init = () =>
{
  console.log('initializing');

  //Adds functions to respective buttons
  keywordSubmit.onclick = submitKeyword;
  addRole.onclick = createRole;
  linkSubmit.onclick = addLink;
  
  //Checks if there are queries in url
  let queryString = window.location.search;
  if (queryString != '')
  {
    let urlParams = new URLSearchParams(queryString);
    editProject(urlParams);
    return;
  }

  for (let i = 0; i < 3; i++){
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
const editProject = async (urlParams) =>
{
  selectedID = urlParams.get('userid');
  projectID = urlParams.get('projectid');

  const dbRef = ref(getDatabase(app));
  await get(child(dbRef, `users`)).then((snapshot) => {
    if (!snapshot.exists() || snapshot.val()[selectedID] == undefined || snapshot.val()[selectedID].projects[projectID] == undefined)
    {
      console.log('project not found, loading as creation page'); //For test purposes
      //If project is not found, continues loading as project creation page
      for (let i = 0; i < 3; i++){
        createRole();
      }
      newProject.onclick = createProject;
      return;
    }

    document.querySelector('h1').innerHTML = 'Edit Project';
    let project = snapshot.val()[selectedID].projects[projectID];
    console.log(project); //For test purposes

    //Make username and id inputs unusable
    document.querySelector('#id-box').innerHTML = `Username: ${snapshot.val()[selectedID].name}`;

    //Fill in inputs with current project data
    titleInput.value = decode(project.title);
    descInput.value = decode(project.description);

    //Fill in keywords
    for (let word of project.tags)
    {
      addKeyword(word);
    }

    //Fill in roles
    for (let role of project.needs)
    {
      createCustomRole(role.roleType, role.roleNum);
    }

    //Assign function to submit button & change display
    newProject.innerHTML = "Save Changes";
    newProject.onclick = saveEdits;
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

const createCustomRole = (roleType, roleNum) =>
{
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
  for (let option of options)
  {
    if (option.value == roleType)
    {
      option.setAttribute('selected', 'selected');
      break;
    }
  }

  //Add remove button and assign function to it
  let removeButton = element.appendChild(document.createElement('button'));
  removeButton.innerHTML = '-';
  removeButton.onclick = function() {removeItem(element)};
  //Add element to role list
  roles.appendChild(element);
  console.log('new role created');
}

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

//Gets values from inputs and compiles into a json object
const getInputs = () =>
{
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
  for (let item of roleList)
  {
    let roleType = item.querySelector('select').value;
    //Check if there is no duplicate role titles
    if (roleCheck.indexOf(roleType) != -1)
    {
      console.log('Multiple listings of same role type exist, please ensure each role is unique');
      return undefined;
    }
    roleCheck.push(roleType);
    let roleNum = item.querySelector('input').value;
    //Check if number of positions is valid
    if (roleNum == '' || roleNum < 0)
    {
      console.log('Please use only positive numbers in position numbers');
      return undefined;
    }
    let newRole = {roleType, roleNum};
    roles.push(newRole);
  }
  //let hiring = roles.length ? true : false;
  //Construct json object
  let json = {title, size, description, keywords, roles};
  return json;
}

//Create a JSON object using input values & uploads it to the user's projects
const createProject = () =>
{
  let json = getInputs();
  let hiring = json.roles.length ? true : false;
  writeProjectData(selectedID, json, hiring);
}

//Overwrite the data of the current project being edited with current input data
const saveEdits = () =>
{
  let json = getInputs();
  let hiring = json.roles.length ? true: false;
  writeProjectData(selectedID, json, hiring, true);
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