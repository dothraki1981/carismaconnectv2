// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "carisma-connect-jupz2",
  appId: "1:111655261768:web:1361f9541615c2a5b2aa7d",
  storageBucket: "carisma-connect-jupz2.firebasestorage.app",
  apiKey: "AIzaSyDGbLTosgj5HP2FVxao4s8zy3F1-LY9slo",
  authDomain: "carisma-connect-jupz2.firebaseapp.com",
  messagingSenderId: "111655261768",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
