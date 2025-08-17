import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
  }
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || 'demo-api-key',
  authDomain: requiredEnvVars.authDomain || 'demo.firebaseapp.com',
  projectId: requiredEnvVars.projectId || 'demo-project',
  storageBucket: requiredEnvVars.storageBucket || 'demo-project.appspot.com',
  messagingSenderId: requiredEnvVars.messagingSenderId || '123456789',
  appId: requiredEnvVars.appId || '1:123456789:web:demo',
  measurementId: requiredEnvVars.measurementId || 'G-DEMO',
};

// Initialize Firebase only if we have valid config
let app: any = null;
let auth: any = null;
let db: any = null;
let analytics: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  // In development, we can continue without Firebase
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }
}

export { app, auth, db, analytics };
