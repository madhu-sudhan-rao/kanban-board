// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"
import "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN ,
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket:import.meta.env.VITE_STORAGE_BUCKET ,
//   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyBijC6OYWSlZX1Xa8T6SpKePGmJ6AE7SM8",
  authDomain: "kanban-board-9a8ad.firebaseapp.com",
  projectId: "kanban-board-9a8ad",
  storageBucket: "kanban-board-9a8ad.firebasestorage.app",
  messagingSenderId: "775857768141",
  appId: "1:775857768141:web:307b3ce0fd76de20ddcb84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app)
export const auth = getAuth()

