import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBLrqXP0PxFh_kqDeKmvcgRWsWO8aCyz5M",
  authDomain: "tracker-9b92b.firebaseapp.com",
  projectId: "tracker-9b92b",
  storageBucket: "tracker-9b92b.firebasestorage.app",
  messagingSenderId: "742999838257",
  appId: "1:742999838257:web:e6404e7228299dfb460f10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Utility function for server timestamp (compatible with Firestore v9)
const serverTimestamp = () => {
  return new Date();
};

export { auth, db, serverTimestamp };