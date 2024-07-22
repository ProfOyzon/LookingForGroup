// Jennifer Pichardo
// Project Profile Page
import * as firebase from "./firebase.js";

let projectID;

const init = () => {
    projectID = 6109;
    setupUI();
    getProjectData();
};

const getProjectData = async () => {
    const db = await firebase.getData();
    //console.log(db);

    let project = db.projects[projectID];
    console.log(project);

    //show project title and description
    document.title = `${decodeURI(project.title)} | LFG`;
    document.querySelector("#title").innerHTML = decodeURI(project.title);
    document.querySelector("#description").innerHTML = decodeURI(project.description);

    //show project tags
    project.tags.forEach(tag => {
        document.querySelector("#keywords").innerHTML += `<span>${tag}</span>`;
    });

    //show what project is hiring for
    if(project.isHiring){
        let hiringNeeds  = document.querySelector("#role-container");

        project.needs.forEach(role => {
            hiringNeeds.innerHTML += `<div class = "position">
            <h3>${role.roleType}: ${role.roleNum} </h3>
            </div>`;
        });
    }
};

const setupUI = () => {
    //Follow button
    document.querySelector("#follow-btn").onclick = () => {
        console.log("Click!");
    };

    //Member carousel
    const carousel = document.querySelector(".carousel"); 
    const arrowBtns = document.querySelectorAll(".wrapper i"); 
    const wrapper = document.querySelector(".wrapper"); 
  
    const firstCard = carousel.querySelector(".card"); 
    const firstCardWidth = firstCard.offsetWidth; 
  
    let isDragging = false, 
        startX, 
        startScrollLeft, 
        timeoutId; 
  
    const dragStart = (e) => {  
        isDragging = true; 
        carousel.classList.add("dragging"); 
        startX = e.pageX; 
        startScrollLeft = carousel.scrollLeft; 
    }; 
  
    const dragging = (e) => { 
        if (!isDragging) return; 
      
        // Calculate the new scroll position 
        const newScrollLeft = startScrollLeft - (e.pageX - startX); 
      
        // Check if the new scroll position exceeds  
        // the carousel boundaries 
        if (newScrollLeft <= 0 || newScrollLeft >=  
            carousel.scrollWidth - carousel.offsetWidth) { 
              
            // If so, prevent further dragging 
            isDragging = false; 
            return; 
        } 
      
        // Otherwise, update the scroll position of the carousel 
        carousel.scrollLeft = newScrollLeft; 
    }; 
  
    const dragStop = () => { 
        isDragging = false;  
        carousel.classList.remove("dragging"); 
    }; 
  
    carousel.addEventListener("mousedown", dragStart); 
    carousel.addEventListener("mousemove", dragging); 
    document.addEventListener("mouseup", dragStop); 
    wrapper.addEventListener("mouseenter", () =>  
        clearTimeout(timeoutId)); 
  
    // Add event listeners for the arrow buttons to  
    // scroll the carousel left and right 
    arrowBtns.forEach(btn => { 
        btn.addEventListener("click", () => { 
            carousel.scrollLeft += btn.id === "left" ?  
                -firstCardWidth : firstCardWidth; 
        }); 
    }); 

};

init();
