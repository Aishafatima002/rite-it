import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut, GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
    getFirestore, collection, addDoc, serverTimestamp, query, orderBy,  doc, getDocs
    , updateDoc,setDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsE2mtR_efOOu4ugdlEDaK8uFa5J8BHC4",
    authDomain: "rite-f9c21.firebaseapp.com",
    projectId: "rite-f9c21",
    storageBucket: "rite-f9c21.firebasestorage.app",
    messagingSenderId: "1072438684849",
    appId: "1:1072438684849:web:16bf40cec48f9773ba0690",
    measurementId: "G-34VNN1MB0K"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider()
const db = getFirestore(app);



export { 
    auth, 
    GoogleAuthProvider,
    provider,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    db, 
    doc, 
    setDoc, 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    orderBy, 

getDocs ,
 signInWithPopup

};