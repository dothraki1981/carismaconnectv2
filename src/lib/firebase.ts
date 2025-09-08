
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration - Synced with your Firebase project
const firebaseConfig = {
  projectId: "carisma-connect-jupz2",
  appId: "1:111655261768:web:1361f9541615c2a5b2aa7d",
  storageBucket: "carisma-connect-jupz2.firebasestorage.app",
  apiKey: "AIzaSyDGbLTosgj5HP2FVxao4s8zy3F1-LY9slo",
  authDomain: "carisma-connect-jupz2.firebaseapp.com",
  messagingSenderId: "111655261768"
};


// Initialize Firebase for SSR
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
