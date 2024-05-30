import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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

const getResults = async (selectedRoles = [], key = "", isHiring = true, selectedTags = []) => {
    let results = [];

    const dbRef = ref(getDatabase(app));
    await get(child(dbRef, `users`)).then((snapshot) => {
        if (snapshot.exists()) {
            for (let user in snapshot.val()) {
                for (let id in snapshot.val()[user]) {
                    let project = snapshot.val()[user][id];

                    // Check if keyword has been entered, skip if key is not in title
                    if (key &&
                        !decodeURI(project.title).toLowerCase().includes(key.toLowerCase()))
                        continue;

                    // Filter hiring
                    if (isHiring != project.isHiring) continue;

                    // If any selected tag does not apply, skip
                    let hasTags = true;
                    if (selectedTags.length > 0) {
                        for (let tag of project.tags) {
                            let check = tag.toLowerCase();
                            if (!selectedTags.includes(check)) hasTags = false;
                        }
                    }
                    if (!hasTags) continue;

                    // Same process applied to roles
                    let hasRoles = true;
                    if (project.needs) {
                        const pRoles = project.needs.map(r => { return r.roleType });
                        for (let role of selectedRoles) {
                            if (!pRoles.includes(role)) hasRoles = false;
                        }
                    }
                    if (!hasRoles) continue;

                    // Add result to results array
                    let newResult = `
                        <hr>
                        <p><h3>${decodeURI(project.title).replace('<', '&lt;').replace('>', '&gt;')}</h3></p>
                        <p><b>Author: <i>${user}</i>, Project ID: <i>${id}</i></b></p>
                        <p>${decodeURI(project.description).replace('<', '&lt;').replace('>', '&gt;')}</p>
                        <p><i>${project.tags.join(", ")}</i></p>
                    `;
                    if (project.needs){
                        let addRoles = project.needs.map(r => {return r.roleType});
                        newResult += `<p>Looking for: ${addRoles.join(", ")}</p>`;
                    } 
                    results.push(newResult);
                }
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

    return results;
}

const init = () => {
    // Get filters
    const keyword = document.querySelector("#keyword-input");
    const hiring = document.querySelector("#check");
    const roles = document.querySelector("#role-selection").querySelectorAll("option");

    // Tag elements
    const tagInput = document.querySelector("#tag-input");
    const tagSubmit = document.querySelector("#tag-submission");
    const tagClear = document.querySelector("#tag-clear");
    const tagList = document.querySelector("#tag-list");
    let tags = [];

    // Quicksearch Elements
    const quickRole = document.querySelector("#quick-select");
    const quickSearch = document.querySelector("#quick-search");

    // Search elements
    const search = document.querySelector("#user-data-search");
    const results = document.querySelector("#results");

    const searchProjects = async (selectedRoles = [], key = "", isHiring = true, selectedTags = []) => {
        // Clear results
        results.innerHTML = "";

        // Search database for viable results
        let foundResults = await getResults(selectedRoles, key, isHiring, selectedTags);

        // If no results were found, let the user know & quit
        if (foundResults.length <= 0) {
            results.innerHTML = "<hr><p><i>No results found!</i></p>"
            return;
        }

        // Add results to the page
        results.innerHTML = foundResults.join("");
    }

    // Tag functionality
    tagSubmit.onclick = () => {
        if (!tagInput.value) return;
        const input = tagInput.value.toLowerCase();
        tagInput.value = "";
        if (tags)
            for (let tag of tags)
                if (tag == input)
                    return;
        tags.push(input);
        if (tags.length <= 0) {
            tagList.innerHTML = input;
        }
        else {
            tagList.innerHTML = tags.join(", ")
        }
    }

    tagClear.onclick = () => {
        tagList.innerHTML = "No tags selected";
        tags = [];
    }

    // Search function (search by selected filters)
    search.onclick = () => {
        let selectedRoles = [];
        for (let i = 0; i < roles.length; i++) if (roles[i].selected) selectedRoles.push(roles[i].value);

        const key = keyword.value;

        const isHiring = hiring.checked;

        searchProjects(selectedRoles, key, isHiring, tags);
    }

    // Quicksearch function (search by needed roles)
    quickSearch.onclick = () => {
        searchProjects([quickRole.value]);
    }
}

init();