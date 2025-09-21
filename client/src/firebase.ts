// src/firebase.ts
// Firebase configuration and initialization for Subtrax
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Use environment variables for security and flexibility
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "subtrax-4964f.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "subtrax-4964f",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "subtrax-4964f.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Friendly runtime checks — warn if required env vars are missing in local dev
const required = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_APP_ID'
];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn('Missing Firebase env vars:', missing.join(', '));
  // Also show the expected project id from your service account
  // eslint-disable-next-line no-console
  console.info('Expected project id: subtrax-4964f — ensure your REACT_APP_FIREBASE_PROJECT_ID matches this');
}

// Prevent re-initialization in dev/hot-reload
const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
