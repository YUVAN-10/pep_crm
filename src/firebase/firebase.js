/**
 * Firebase Config & Architecture Placeholder for PEP CRM V1
 * Ready for future .env environment variable injection
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'pep_demo_api_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'pep-crm.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pep-crm',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'pep-crm.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

// Initialize Firebase (Placeholder mode - safely guarded when credentials missing)
let app;
let auth;
let db;

try {
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase initialization running in offline demo mode:', error);
}

export { app, auth, db };
