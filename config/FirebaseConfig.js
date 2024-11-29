// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase Authentication
import { getAuth } from 'firebase/auth';

// Firebase Firestore
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ_7LMiJLq8EPuAF0lb7mTHQFiIJcaAVM",
  authDomain: "fir-project-23b7a.firebaseapp.com",
  projectId: "fir-project-23b7a",
  storageBucket: "fir-project-23b7a.firebasestorage.app",
  messagingSenderId: "380668149630",
  appId: "1:380668149630:web:f169f56ad50a20f9037d2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// create an object for authentication
export const auth = getAuth(app);

// create an object of firestore
export const db = getFirestore(app);