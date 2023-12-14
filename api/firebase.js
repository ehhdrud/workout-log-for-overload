import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
    getAuth, // authentication 설정
    signInWithPopup, //google 로그인을 팝업창에 띄우기 위해
    GoogleAuthProvider, //google login 기능
    signInWithEmailAndPassword, // email 로그인
    createUserWithEmailAndPassword, //email 회원가입
    signOut, // 로그아웃
} from 'firebase/auth';

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

export const auth = getAuth();

//Email 회원가입
export const loginEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

//Email 로그인
export const signupEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

//Google 로그인
const provider = new GoogleAuthProvider();

export const loginGoogle = () => {
    return signInWithPopup(auth, provider);
};

//로그아웃
export const logout = () => {
    return signOut(auth);
};

export const db = getFirestore(app);

export default app;
