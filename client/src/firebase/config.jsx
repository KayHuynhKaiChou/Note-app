// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1d-MOKjmMtqBsUmK7KY8OLiQFT2EZn8k",
  authDomain: "note-app-595e2.firebaseapp.com",
  projectId: "note-app-595e2",
  storageBucket: "note-app-595e2.appspot.com",
  messagingSenderId: "626969858756",
  appId: "1:626969858756:web:84a440b71d022d65176f91",
  measurementId: "G-QK68ZN19RR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);