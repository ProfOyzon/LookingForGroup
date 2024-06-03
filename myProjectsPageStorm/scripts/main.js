"use strict";

const loadData = () => {
    const url = "../data/proto.json";
    const xhr = new XMLHttpRequest();
    xhr.onload = init;
    xhr.onerror = () => {
        console.log("Error loading JSON data");
    }

    xhr.open("GET", url);
    xhr.send();
}

const init = (e) => {
    const data = JSON.parse(e.target.responseText).projects;

    const projectList = document.getElementById("projectsList");

    let newProjectBoxes = "";
    let newMyProjectBoxes = "";

        for(let project of data){
            newProjectBoxes += `<div class="project" onmouseover="displayBackground(this)" onmouseleave="hideBackground(this)" data-url="${project.url}"> <h2 class="title">${project.name}</h2> <p>${project.description}</p> `;
            newProjectBoxes += `<div class="additional"><p class="genre">Genre: ${project.type}</p> <p class="length">Length of Project: ${project.length}</p></div></div>`;
        }
    

    projectList.innerHTML += newProjectBoxes;

    const myProjectList = document.querySelector(".allProjects");

    for(let project of data){
        newMyProjectBoxes += `<div class="project"> <img src="${project.icon}" class="projectImg">`;
        newMyProjectBoxes += `<div class="rightSide"><p class="name">${project.name}</p><p class="projectBio">${project.description}</p> <div class="tags">`;

        for(let i = 0; i < project.tags.length; i++){
            newProjectBoxes += `<p class="tag">${project.tags[i]}</p>`;
        }

        newMyProjectBoxes += `</div></div></div>`;
    }

    myProjectList.innerHTML += newMyProjectBoxes;

}

const projectSelect = document.querySelector("#project");

loadData();

function displayBackground(project){

    let foundUrl = project.getAttribute('data-url');
    project.style.backgroundImage = `url("${foundUrl}")`;
    project.style.backgroundSize = "cover";
    project.style.backgroundRepeat = "no-repeat";
    project.style.backgroundPosition = "center center";

}

function hideBackground(project){
    

    project.style.backgroundImage = `linear-gradient(rgba(243, 172, 31, 0.82), rgb(158, 107, 13))`;
    document.querySelector("#project").style.transition = "1s";
}