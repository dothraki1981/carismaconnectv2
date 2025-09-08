// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration - Synced with your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDGbLTosgj5HP2FVxao4s8zy3F1-LY9slo",
  authDomain: "carisma-connect-jupz2.firebaseapp.com",
  projectId: "carisma-connect-jupz2",
  storageBucket: "carisma-connect-jupz2.firebasestorage.app",
  messagingSenderId: "111655261768",
  appId: "1:111655261768:web:cac9a5f8e43b395eb2aa7d",
  measurementId: "",
  // Add the databaseURL for Realtime Database
  databaseURL: "https://carisma-connect-jupz2-default-rtdb.firebaseio.com",
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Database = getDatabase(app);

export { app, auth, db };
