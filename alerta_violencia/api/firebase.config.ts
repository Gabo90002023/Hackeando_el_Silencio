// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeyJq8sHZjePtllX3u23lbz4d9qb89lnY",
  authDomain: "backend-hes.firebaseapp.com",
  projectId: "backend-hes",
  storageBucket: "backend-hes.firebasestorage.app",
  messagingSenderId: "745486229163",
  appId: "1:745486229163:web:de1975331374c6a50721ee"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
