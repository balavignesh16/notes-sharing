// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3tYHEvco22ipSAnnlquLlZ-_X6trZH34",
  authDomain: "notes-sharing-8e0f6.firebaseapp.com",
  projectId: "notes-sharing-8e0f6",
  storageBucket: "notes-sharing-8e0f6.firebasestorage.app",
  messagingSenderId: "504417196897",
  appId: "1:504417196897:web:5748072b6821e63fc50320"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // [cite: 95]

export { auth };
