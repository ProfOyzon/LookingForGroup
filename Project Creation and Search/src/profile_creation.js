import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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

const generateRandomID = async (db) => {
    // Generate a random ID
    let tryID = Math.floor(Math.random() * 30000);

    // If the ID already exists, generate it again until unique
    await get(child(ref(db), "users")).then(async snapshot => {
        if (snapshot.exists)
            for (let id in snapshot.value) {
                if (id == tryID) tryID = await generateRandomID(db);
            }
    });

    return tryID;
}

const writeProfileData = async (uName, fName, lName, bio, userRole) => {
    const db = getDatabase(app);
    const uID = await generateRandomID(db);

    // Encode/create strings
    const realName = `${fName} ${lName}`;
    const userName = encodeURI(uName);
    const eBio = encodeURI(bio);

    // Set reference and write
    const r = ref(db, `users/${uID}`);
    set(r, {
        name: realName,
        username: userName,
        bio: eBio,
        role: userRole
    });
}

const init = () => {
    // Get HTML elements
    const fname = document.querySelector("#fname");
    const lname = document.querySelector("#lname");
    const uname = document.querySelector("#uname");
    const bio = document.querySelector("#bio");
    const role = document.querySelector("#role");
    const submit = document.querySelector("#create-profile");

    // Submission event
    submit.onclick = () => {
        writeProfileData(
            uname.value,
            fname.value,
            lname.value,
            bio.value,
            role.value
        );
    }
}

init();