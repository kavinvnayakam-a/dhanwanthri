'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "dhanwanthrimaruthuvam-83c7d.firebaseapp.com",
  projectId: "dhanwanthrimaruthuvam-83c7d",
  storageBucket: "dhanwanthrimaruthuvam-83c7d.firebasestorage.app",
  messagingSenderId: "215807140725",
  appId: "1:215807140725:web:cc658f6c98bfe4a63ae93c" 
};

// Initialize Firebase only if we have an API key or if we're on the client
// This prevents the build from crashing during prerendering when environment variables are missing
const app = (typeof window !== 'undefined' || !!firebaseConfig.apiKey) 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export { app };
