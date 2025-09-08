
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getAuth, Auth, initializeAuth, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration - Synced with your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDGbLTosgj5HP2FVxao4s8zy3F1-LY9slo",
  authDomain: "carisma-connect-jupz2.firebaseapp.com",
  projectId: "carisma-connect-jupz2",
  storageBucket: "carisma-connect-jupz2.firebasestorage.app",
  messagingSenderId: "111655261768",
  appId: "1:111655261768:web:cac9a5f8e43b395eb2aa7d",
  measurementId: ""
};

// Singleton pattern to initialize Firebase services safely in Next.js
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
        auth = initializeAuth(app, { persistence: browserLocalPersistence });
        db = initializeFirestore(app, { localCache: memoryLocalCache() });
    } else {
        app = getApp();
        auth = getAuth(app);
        db = getFirestore(app);
    }
}


// Fallback for server-side or other environments
if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
if (!auth) {
    // This will throw if called on server, but it's a fallback.
    // The client-side logic above should handle initialization.
    auth = getAuth(app);
}
if (!db) {
    db = getFirestore(app);
}


export { app, auth, db };
