import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ====================================================================================
// IMPORTANT: REPLACE THIS WITH THE CONFIGURATION FROM YOUR FIREBASE PROJECT
// Go to Project Settings > General > Your apps > SDK setup and configuration
// ====================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyA3tYHEvco22ipSAnnlquLlZ-_X6trZH34",
  authDomain: "notes-sharing-8e0f6.firebaseapp.com",
  projectId: "notes-sharing-8e0f6",
  storageBucket: "notes-sharing-8e0f6.firebasestorage.app",
  messagingSenderId: "504417196897",
  appId: "1:504417196897:web:e6b52aabe76eaa80c50320"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
