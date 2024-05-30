window.onload = function(){
    loadData();
   
    
}

const loadData = () => {
  // Load JSON file
  const url = "data/data.json";
  const xhr = new XMLHttpRequest();
  xhr.onload = loadProfileData;
  xhr.onerror = () => {
      console.log("Error loading JSON data");
  }

  xhr.open("GET", url);
  xhr.send();
}

const loadProfileData = (e) => {
  //load the bio
  const bio = JSON.parse(e.target.responseText).Bio;

  const nameText = document.getElementById("name");
  nameText.innerText = bio[0].name;

  const pronounsText = document.getElementById("pronouns");
  pronounsText.innerText = bio[0].pronouns;

  const aboutText = document.getElementById("about")
  aboutText.innerText = bio[0].about;

  //load images for gallery
  const images = JSON.parse(e.target.responseText).Images;
  for (let image of images){
    addImage(image.src, image.alt);
  }

  //load links
  const links = JSON.parse(e.target.responseText).Links;
  for (let link of links){
    addLink(link.text, link.link);
  }

  //load the interests
  const interests = JSON.parse(e.target.responseText).Interests;
  
  const projectInterests = document.getElementById("projInterests");
  projectInterests.innerText = interests[0].ProjectInterests;

  const roleInterests = document.getElementById("roleInterests");
  roleInterests.innerText = interests[0].RoleInterests;

  const availability = document.getElementById("availability");
  availability.innerText = interests[0].Availability;

  //load the skills
  const languages = JSON.parse(e.target.responseText).Languages;

  for (let skill of languages){
    addSkill(skill.skill, "language", skill.featured);
  }

  const techSkills = JSON.parse(e.target.responseText).TechSkills;

  for (let skill of techSkills){
    addSkill(skill.skill, "technical", skill.featured);
  }

  const softSkills = JSON.parse(e.target.responseText).SoftSkills;

  for (let skill of softSkills){
    addSkill(skill.skill, "soft", skill.featured);
  }

  //load the endorsed skills
  const endorsedSkills = JSON.parse(e.target.responseText).EndorsedSkills;

  for (let skill of endorsedSkills){
    addEndorsedSkill(skill.name, skill.text, skill.project, skill == endorsedSkills[0]);
  }

  //set the default tab
  document.querySelector(".defaultSkill").click();

  //load the projects
  const projects = JSON.parse(e.target.responseText).Projects;
  for (let project of projects){
    addProject(project.name, project.date, project.description, project.role)
  }
}

function addSkill (skill, type, featured){
  let newSkill = document.createElement("p");
  newSkill.innerText = skill;

  switch(type){
    case "language":
      document.getElementById("languages").appendChild(newSkill)
      break;
    case "technical":
      document.getElementById("techSkills").appendChild(newSkill)
      break;
    case "soft":
      document.getElementById("softSkills").appendChild(newSkill)
      break;
  }

  if(featured){
    document.getElementById("featuredList").appendChild(newSkill);
  }

}

function addImage(src, alt){
  let newImage = document.createElement("img");
  newImage.src = src;
  newImage.alt = alt;
  document.getElementById("imageList").appendChild(newImage);
}

function addLink (text, link){
  let newLink = document.createElement("a");
  newLink.innerText = text;
  newLink.href = link;
  document.getElementById("linkList").appendChild(newLink);
  document.getElementById("linkList").appendChild(document.createElement("br"));
}

function addEndorsedSkill(skill, text, project, first){
  const skillButton = document.createElement("button");
  skillButton.classList.add("tablinks");
  skillButton.onclick = () => openTab(skill);
  skillButton.innerText= skill;
  skillButton.id = skill + "Button";

  if(first){skillButton.classList.add("defaultSkill");}

  const skillDiv = document.createElement("div");
  skillDiv.id = skill;
  skillDiv.classList.add("tabcontent");

  const projText = document.createElement("h3");
  projText.innerText = project;
  skillDiv.appendChild(projText);

  const skillText = document.createElement("p");
  skillText.innerText = text;
  skillDiv.appendChild(skillText);
  
  document.getElementById("tabList").appendChild(skillButton);
  document.getElementById("textList").appendChild(skillDiv);
}

function addProject (name, date, description, role){
  let project = document.createElement("div");
  project.classList.add("box");
  let headerDiv = document.createElement("div")
  headerDiv.classList.add("header")

  let nameHeader = document.createElement("h2");
  nameHeader.innerText = name;
  headerDiv.appendChild(nameHeader)

  let dateText = document.createElement("p")
  dateText.innerText = date;
  headerDiv.appendChild(dateText)

  //let editButton = document.createElement("button");
  //editButton.classList.add("editButton");
  //let editButtonImg = document.createElement("img")
  //editButtonImg.alt = "edit"
  //editButtonImg.src = "assets/pencil.jpg"
  //editButtonImg.width = 20;
  //editButtonImg.height = 20;
  //editButton.appendChild(editButtonImg);
  //headerDiv.appendChild(editButton);

  project.appendChild(headerDiv);

  let roleText = document.createElement("h3");
  roleText.innerText = role;
  project.appendChild(roleText);


  let descriptionText = document.createElement("p");
  descriptionText.innerText = description;
  project.appendChild(descriptionText);

  document.getElementById("projectList").appendChild(project);
}

function openTab(skill) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(skill).style.display = "block";
    document.getElementById(skill + "Button").classList.add("active");
}