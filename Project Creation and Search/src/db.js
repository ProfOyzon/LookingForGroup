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

// Generate a random ID for either projects or users
const generateID = async (isUser = false) => {
    let tryID = Math.floor(Math.random() * 30000);
    const db = await getData();
    if (isUser) for (let id in db.users) if (id == tryID) tryID = await generateID(true);
    else for (let id in db.projects) if (id == tryID) tryID = await generateID();
    return tryID;
}

// Returns the current database object (or false in one doesn't exist)
export const getData = async () => {
    const db = getDatabase(app);
    return await get(child(ref(db), "lfg-test")).then(snapshot => {
        if (snapshot.exists()) return snapshot.val();
        else return false;
    });
}

// Writes both user and project data
export const writeData = async (dataObj, path, editID = -1) => {
    const db = getDatabase(app);
    const id = (editID < 0) ? await generateID(path == "users") : editID;
    let r = ref(db, `lfg-test/${path}/${id}`);
    set(r, dataObj);
    if(path == "projects"){
        r = ref(db, `lfg-test/users/${dataObj.owner}/projects/${id}`);
        set(r, {status:"owner"});
    }
}