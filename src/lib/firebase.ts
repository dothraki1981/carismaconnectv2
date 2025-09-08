// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getAuth, Auth, initializeAuth, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration - Synced with your Firebase project
const firebaseConfig = {
  projectId: "carisma-connect-jupz2",
  appId: "1:111655261768:web:1361f9541615c2a5b2aa7d",
  storageBucket: "carisma-connect-jupz2.firebasestorage.app",
  apiKey: "AIzaSyDGbLTosgj5HP2FVxao4s8zy3F1-LY9slo",
  authDomain: "carisma-connect-jupz2.firebaseapp.com",
  messagingSenderId: "111655261768",
  measurementId: ""
};

// Singleton pattern to initialize Firebase services safely in Next.js
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, { persistence: browserLocalPersistence });
  db = initializeFirestore(app, { localCache: memoryLocalCache() });
} else if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

// Fallback for server-side rendering or environments where initialization might be tricky.
// This ensures 'auth' and 'db' are always exported, even if not fully initialized on the server.
if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

if (!auth) {
    auth = getAuth(app);
}

if (!db) {
    db = getFirestore(app);
}


export { app, auth, db };
