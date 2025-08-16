import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

let app: FirebaseApp | null = null;

export function getFirebaseApp() {
  if (!app) {
    const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.warn('Firebase API key missing. Did you set EXPO_PUBLIC_FIREBASE_API_KEY in .env?');
    }
    const config = {
      apiKey,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    app = initializeApp(config);
  }
  return app;
}

let authInstance = (() => {
  try {
    // Dynamically access to avoid type resolution hiccups
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('firebase/auth');
    if (mod.getReactNativePersistence) {
      return initializeAuth(getFirebaseApp(), {
        persistence: mod.getReactNativePersistence(AsyncStorage)
      });
    } else {
      console.warn('getReactNativePersistence not found; falling back to in-memory auth.');
      return getAuth(getFirebaseApp());
    }
  } catch (e) {
    console.warn('Failed to enable persistent auth, using memory only:', (e as Error).message);
    return getAuth(getFirebaseApp());
  }
})();

export const auth = authInstance;
export const db = getDatabase(getFirebaseApp());
