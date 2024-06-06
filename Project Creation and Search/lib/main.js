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
const getResults = async (selectedRoles = [], key = "", isHiring = true, selectedTags = [], type = "project") => {
  let results = [];
  const dbRef = ref(getDatabase(app));
  await get(child(dbRef, `lfg-test`)).then(snapshot => {
    if (snapshot.exists()) {
      if (type == "project") {
        for (let id in snapshot.val().projects) {
          let project = snapshot.val().projects[id];

          // Check if keyword has been entered, skip if key is not in title
          if (key && !decodeURI(project.title).toLowerCase().includes(key.toLowerCase())) continue;

          // Filter hiring
          if (isHiring != project.isHiring) continue;

          // If any selected tag does not apply, skip
          let hasTags = false;
          if (selectedTags.length <= 0) hasTags = true;else {
            for (let tag of project.tags) {
              let check = tag.toLowerCase();
              if (selectedTags.includes(check)) hasTags = true;
            }
          }
          if (!hasTags) continue;

          // Same process applied to roles
          let hasRoles = true;
          if (project.needs) {
            const pRoles = project.needs.map(r => {
              return r.roleType;
            });
            for (let role of selectedRoles) {
              if (!pRoles.includes(role)) hasRoles = false;
            }
          }
          if (!hasRoles) continue;

          // Add result to results array
          let newResult = `
                        <hr>
                        <p><h3>${decodeURI(project.title).replace('<', '&lt;').replace('>', '&gt;')}</h3></p>
                        <p><b>Author: <i>${snapshot.val().users[project.owner].username}</i>, Project ID: <i>${id}</i></b></p>
                        <p>${decodeURI(project.description).replace('<', '&lt;').replace('>', '&gt;')}</p>
                        <p><i>${project.tags.join(", ")}</i></p>
                    `;
          if (project.needs) {
            let addRoles = project.needs.map(r => {
              return r.roleType;
            });
            newResult += `<p>Looking for: ${addRoles.join(", ")}</p>`;
          }
          results.push(newResult);
        }
      } else if (type == "profile") {
        for (let id in snapshot.val().users) {
          let user = snapshot.val().users[user];
          if (key && !decodeURI(user.username).toLowerCase().includes(key)) continue;
          if (selectedRoles.length > 0 && !selectedRoles.includes(user.profile.role)) continue;
          let newResult = `
                    <hr>
                    <p><h3>${decodeURI(user.username).replace('<', '&lt;').replace('>', '&gt;')}</h3></p>
                    <p><b>${user.profile.name}</b></p>
                    <p>${user.profile.role}</p>
                    <p><i>${decodeURI(user.profile.bio).replace('<', '&lt;').replace('>', '&gt;')}</i></p>
                    `;
          results.push(newResult);
        }
      }
    } else {
      console.log("No data available");
    }
  }).catch(error => {
    console.error(error);
  });
  return results;
};
const init = () => {
  // These two objects are used for quick searching
  // For now they only store one value each, but more can be added later
  let me = {
    role: ""
  };
  let myProject = {
    needs: []
  };

  // These elements are always displayed and control which search/quicksearch methods are used
  const searchType = document.querySelector("#search-select");
  const signIn = document.querySelector("#signin"); // Placeholder for actual login functionality

  // Get filters
  const keyword = document.querySelector("#keyword-input");
  const hiring = document.querySelector("#check");
  const roles = document.querySelector("#role-selection").querySelectorAll("option");
  const uname = document.querySelector("#uname-input");
  const uroles = document.querySelector("#u-role-selection");

  // Tag elements
  const tagInput = document.querySelector("#tag-input");
  const tagSubmit = document.querySelector("#tag-submission");
  const tagClear = document.querySelector("#tag-clear");
  const tagList = document.querySelector("#tag-list");
  let tags = [];

  // Quicksearch Elements
  const quickSelect = document.querySelector("#quick-select");
  const quickSearch = document.querySelector("#quick-search");

  // Search elements
  const search = document.querySelector("#user-data-search");
  const results = document.querySelector("#results");
  const refreshSignIn = () => {
    // Called every time the page refreshes or the search type is changed
    // Fills the signin dropdown with all users and sets the default values for "me"

    const db = getDatabase(app);
    signIn.innerHTML = "";
    get(child(ref(db), "lfg-test/users")).then(snapshot => {
      if (snapshot.exists()) {
        // Fill signin
        for (let user in snapshot.val()) {
          let newOpt = document.createElement("option");
          newOpt.innerHTML = decodeURI(snapshot.val()[user].username).replace('<', '&lt;').replace('>', '&gt;');
          newOpt.value = user;
          signIn.appendChild(newOpt);
        }
        me.role = snapshot.val()[signIn.value].role;
        refreshProjects();
      }
    });
  };
  const refreshProjects = () => {
    // Called after every refreshSignIn or when the signin selection is changed
    // Fills the quicksearch dropdown with the signin user's projects and set the default values of "myProject"

    const db = getDatabase(app);
    quickSelect.innerHTML = "";
    get(child(ref(db), "lfg-test")).then(snapshot => {
      if (snapshot.exists()) {
        let user = signIn.value;
        if (snapshot.val().users[user].projects) {
          for (let projectID in snapshot.val().users[user].projects) {
            let project = snapshot.val().projects[projectID];
            let newOpt = document.createElement("option");
            newOpt.innerHTML = decodeURI(project.title).replace('<', '&lt;').replace('>', '&gt;');
            newOpt.value = projectID;
            quickSelect.appendChild(newOpt);
          }
          myProject.needs = [];
          let myNeeds = snapshot.val().projects[quickSelect.value].needs;
          for (let i = 0; i < myNeeds.length; i++) {
            myProject.needs.push(myNeeds[i].roleType);
          }
        }
      }
    });
  };
  signIn.onchange = () => {
    const db = getDatabase(app);
    get(child(ref(db), "users")).then(snapshot => {
      if (snapshot.exists()) {
        me.role = snapshot.val()[signIn.value].role;
      }
    });
    refreshProjects();
  };
  quickSelect.onchange = () => {
    const db = getDatabase(app);
    get(child(ref(db), "users")).then(snapshot => {
      if (snapshot.exists()) {
        myProject.needs = snapshot.val()[signIn.value].projects[quickSelect.value].needs;
      }
    });
  };
  const searchProjects = async (selectedRoles = [], key = "", isHiring = true, selectedTags = []) => {
    // Clear results
    results.innerHTML = "";
    const type = searchType.value;

    // Search database for viable results
    let foundResults = await getResults(selectedRoles, key, isHiring, selectedTags, type);

    // If no results were found, let the user know & quit
    if (foundResults.length <= 0) {
      results.innerHTML = "<hr><p><i>No results found!</i></p>";
      return;
    }

    // Add results to the page
    results.innerHTML = foundResults.join("");
  };

  // Tag functionality
  tagSubmit.onclick = () => {
    if (!tagInput.value) return;
    const input = tagInput.value.toLowerCase();
    tagInput.value = "";
    if (tags) for (let tag of tags) if (tag == input) return;
    tags.push(input);
    if (tags.length <= 0) {
      tagList.innerHTML = input;
    } else {
      tagList.innerHTML = tags.join(", ");
    }
  };
  tagClear.onclick = () => {
    tagList.innerHTML = "No tags selected";
    tags = [];
  };

  // Search function (search by selected filters)
  search.onclick = () => {
    let selectedRoles = [];
    const rolePool = searchType.value == "project" ? roles : uroles;
    for (let i = 0; i < rolePool.length; i++) if (rolePool[i].selected) selectedRoles.push(rolePool[i].value);
    const key = searchType.value == "project" ? keyword.value : uname.value;
    const isHiring = hiring.checked;
    searchProjects(selectedRoles, key, isHiring, tags);
  };

  // Quicksearch function
  quickSearch.onclick = () => {
    searchProjects(searchType.value == "project" ? [me.role] : myProject.needs);
  };

  // Switches which divs are displayed depending on searchType
  searchType.onchange = () => {
    const projDiv = document.querySelector("#project");
    const profDiv = document.querySelector("#profile");
    const qsDiv = document.querySelector("#qs-items");
    if (searchType.value == "project") {
      projDiv.style = "";
      profDiv.style = "display:none";
      qsDiv.style = "display:none";
      return;
    }
    projDiv.style = "display:none";
    profDiv.style = "";
    qsDiv.style = "";
  };
  refreshSignIn();
};
init();