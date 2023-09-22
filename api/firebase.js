import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGE_ID,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

export default app;
