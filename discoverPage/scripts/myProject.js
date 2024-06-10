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
    const peopleData = JSON.parse(e.target.responseText).people;
    const myProjectList = document.querySelector(".allProjects");
    let buttonString = "";
    let newMyProjectBoxes = "";

    let buttons = document.querySelector(".changeSettings");
    buttonString += `<button class="projectButton">Projects</button>
    <button class="peopleButton">People</button>`;

    buttons.innerHTML += buttonString;
    


    for(let project of data){
        newMyProjectBoxes += `<div class="project"> <div><img src="${project.icon}" class="projectImg"></div>`;
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

        newMyProjectBoxes += `</div><p class="looking">Looking for: `

        for(let i = 0; i < project.lookingFor.length; i++){
            

            if(i == project.lookingFor.length - 1){
                newMyProjectBoxes += `${project.lookingFor[i]}`;
            }
            else{
                newMyProjectBoxes += `${project.lookingFor[i]}, `;
            }
        }
        newMyProjectBoxes += `</p></div></div>`;
    }

    myProjectList.innerHTML += newMyProjectBoxes;

}

loadData();
