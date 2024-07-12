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
    const myProjectList = document.querySelector(".allProjects");
    let newMyProjectBoxes = "";


    for(let project of data){
        newMyProjectBoxes += `<div class="project"> <img src="${project.icon}" class="projectImg">`;
        newMyProjectBoxes += `<div class="rightSide"><p class="name">${project.name}`;

        if(project.isAdmin == true){
            newMyProjectBoxes += `<img src="../src/crown.webp" class="adminImg"></p>`;
        }
        else{
            newMyProjectBoxes += `</p>`;
        }

        newMyProjectBoxes += `<p class="projectBio">${project.description}</p> <div class="tags">`;

        for(let i = 0; i < project.tags.length; i++){
            newMyProjectBoxes += `<p class="tag">${project.tags[i]}</p>`;
        }

        newMyProjectBoxes += `</div></div></div>`;
    }

    myProjectList.innerHTML += newMyProjectBoxes;

}

loadData();
