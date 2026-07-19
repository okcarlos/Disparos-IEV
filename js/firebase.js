import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBX4dvfebDQ2MRMdFxd8cqhdJ--rI62EH4",
    authDomain: "logins-disparos.firebaseapp.com",
    projectId: "logins-disparos",
    storageBucket: "logins-disparos.firebasestorage.app",
    messagingSenderId: "733556966794",
    appId: "1:733556966794:web:fee1f0bd13150ef4b5f473",
    measurementId: "G-JQGHZ72BW6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);