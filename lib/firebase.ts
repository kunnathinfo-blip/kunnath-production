import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD8qC883eeMqGTB94l5liHD_I98EWaJPl8",
  authDomain: "kunnath-house.firebaseapp.com",
  projectId: "kunnath-house",
  storageBucket: "kunnath-house.firebasestorage.app",
  messagingSenderId: "552836717409",
  appId: "1:552836717409:web:334fc76088f3740a48c320",
  measurementId: "G-87GKFG49L0"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Set default language code
auth.languageCode = 'en';

export { app, auth };
