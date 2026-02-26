// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Check if running in Median native app
const isMedianApp = () => {
  return typeof window !== 'undefined' && 
         window.Median && 
         window.Median.isNativeApp?.();
};


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
let app, messaging;

if (!isMedianApp()) {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} else {
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
}
export { app, messaging };